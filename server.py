#!/usr/bin/env python3
"""
Local Cross-Profile / Cross-Browser Real-Time Sync Server for Petualangan TUMBUH.
Allows multiple Chrome profiles (different Google emails), different browsers,
and file://, http://localhost, or https:// github.io tabs to share 100% of state
and uploaded media (Video MP4/WebM, PDF, Images, LKK, Quizzes, Scores, Users, Groups)
in real time.
"""

import json
import os
import shutil
import threading
import time
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse, parse_qs

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_FILE = os.path.join(BASE_DIR, "sync-db.json")
RESTORED_DATA_FILE = os.path.join(BASE_DIR, "js", "restored_data.js")
UPLOADS_DIR = os.path.join(BASE_DIR, "uploads")
PORT = 8765

os.makedirs(UPLOADS_DIR, exist_ok=True)

_lock = threading.Lock()
_baseline_store = {}
_first_get_ts = None
_state = {
    "version": int(time.time() * 1000),
    "store": {},          # key -> JSON-parsed value
    "modifiedKeys": [],   # keys explicitly modified or upgraded from baseline
    "lastEvent": None
}


def load_baseline():
    global _baseline_store
    if os.path.exists(RESTORED_DATA_FILE):
        try:
            with open(RESTORED_DATA_FILE, "r", encoding="utf-8") as f:
                raw = f.read()
            idx = raw.find("window.RESTORED_DEA_DATA")
            if idx != -1:
                brace_start = raw.find("{", idx)
                brace_end = raw.rfind("}")
                if brace_start != -1 and brace_end != -1:
                    _baseline_store = json.loads(raw[brace_start:brace_end + 1])
        except Exception as e:
            print("Warning: failed to load baseline from restored_data.js:", e)


def _is_baseline_value(key, val):
    if key == "pos2State":
        if not isinstance(val, dict):
            return True
        return (
            not val.get("turnOrder")
            and not val.get("activeGroupId")
            and not val.get("assignments")
            and not val.get("lkk")
        )
    if key == "pos3GroupState":
        if not isinstance(val, dict):
            return True
        return not val.get("groups")
    if key in _baseline_store:
        return val == _baseline_store[key]
    return False


def load_db():
    global _state
    if os.path.exists(DB_FILE):
        try:
            with open(DB_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
                if isinstance(data, dict) and "store" in data:
                    _state = {
                        "version": data.get("version", int(time.time() * 1000)),
                        "store": data.get("store", {}),
                        "modifiedKeys": data.get("modifiedKeys", []),
                        "lastEvent": data.get("lastEvent", None)
                    }
        except Exception as e:
            print("Warning: failed to load sync-db.json:", e)


def save_db():
    try:
        tmp_file = DB_FILE + ".tmp"
        with open(tmp_file, "w", encoding="utf-8") as f:
            json.dump(_state, f, ensure_ascii=False)
        os.replace(tmp_file, DB_FILE)
    except Exception as e:
        print("Warning: failed to save sync-db.json:", e)


load_baseline()
load_db()


class SyncRequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def log_message(self, format, *args):
        # Keep console output quiet for polling requests
        pass

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        super().end_headers()

    def _send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, HEAD, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, X-File-Name, X-File-Type")
        self.send_header("Access-Control-Expose-Headers", "Content-Type, X-File-Name")
        self.send_header("Access-Control-Allow-Private-Network", "true")
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")

    def do_OPTIONS(self):
        self.send_response(204)
        self._send_cors_headers()
        self.end_headers()

    def do_HEAD(self):
        parsed = urlparse(self.path)
        if parsed.path.startswith("/api/media/"):
            media_id = parsed.path.split("/api/media/", 1)[1].strip("/")
            safe_id = "".join(c for c in media_id if c.isalnum() or c in ("_", "-", "."))
            bin_path = os.path.join(UPLOADS_DIR, safe_id + ".bin")
            meta_path = os.path.join(UPLOADS_DIR, safe_id + ".meta.json")
            if not os.path.exists(bin_path):
                self.send_response(404)
                self._send_cors_headers()
                self.end_headers()
                return

            mime = "application/octet-stream"
            fname = safe_id
            if os.path.exists(meta_path):
                try:
                    with open(meta_path, "r", encoding="utf-8") as mf:
                        meta = json.load(mf)
                        mime = meta.get("type") or mime
                        fname = meta.get("name") or fname
                except Exception:
                    pass

            file_size = os.path.getsize(bin_path)
            self.send_response(200)
            self._send_cors_headers()
            self.send_header("Content-Type", mime)
            self.send_header("X-File-Name", fname)
            self.send_header("Content-Length", str(file_size))
            self.end_headers()
            return
        return super().do_HEAD()

    def do_GET(self):
        global _first_get_ts
        parsed = urlparse(self.path)
        if parsed.path == "/api/sync":
            qs = parse_qs(parsed.query)
            client_ver = int(qs.get("since", ["0"])[0] or 0)
            now = time.time()
            with _lock:
                if _first_get_ts is None:
                    _first_get_ts = now
                # During the initial 2.0s collection window when store has no modified keys yet,
                # return empty store so all open tabs across browsers push their localStorage dump
                in_collection_window = (
                    (now - _first_get_ts) < 2.0
                    and len(_state.get("modifiedKeys", [])) == 0
                )
                if in_collection_window:
                    payload = {
                        "ok": True,
                        "version": 0,
                        "changed": True,
                        "store": {},
                        "modifiedKeys": [],
                        "lastEvent": None
                    }
                else:
                    has_update = (_state["version"] != client_ver) or (client_ver == 0)
                    payload = {
                        "ok": True,
                        "version": _state["version"],
                        "changed": has_update,
                        "store": _state["store"] if has_update else None,
                        "modifiedKeys": _state.get("modifiedKeys", []),
                        "lastEvent": _state["lastEvent"]
                    }
            body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
            self.send_response(200)
            self._send_cors_headers()
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return

        if parsed.path.startswith("/api/media/"):
            media_id = parsed.path.split("/api/media/", 1)[1].strip("/")
            safe_id = "".join(c for c in media_id if c.isalnum() or c in ("_", "-", "."))
            bin_path = os.path.join(UPLOADS_DIR, safe_id + ".bin")
            meta_path = os.path.join(UPLOADS_DIR, safe_id + ".meta.json")
            if not os.path.exists(bin_path):
                self.send_response(404)
                self._send_cors_headers()
                self.end_headers()
                return

            mime = "application/octet-stream"
            if os.path.exists(meta_path):
                try:
                    with open(meta_path, "r", encoding="utf-8") as mf:
                        meta = json.load(mf)
                        mime = meta.get("type") or mime
                except Exception:
                    pass

            file_size = os.path.getsize(bin_path)
            self.send_response(200)
            self._send_cors_headers()
            self.send_header("Content-Type", mime)
            self.send_header("Content-Length", str(file_size))
            self.end_headers()
            with open(bin_path, "rb") as bf:
                shutil.copyfileobj(bf, self.wfile)
            return

        return super().do_GET()

    def do_POST(self):
        parsed = urlparse(self.path)
        content_len = int(self.headers.get("Content-Length", 0) or 0)

        if parsed.path == "/api/sync":
            raw = self.rfile.read(content_len) if content_len > 0 else b"{}"
            try:
                body = json.loads(raw.decode("utf-8"))
            except Exception:
                body = {}

            with _lock:
                mod_set = set(_state.get("modifiedKeys", []))

                # 1. Single key update (from DB.set)
                if "key" in body:
                    k = body["key"]
                    val = body.get("value")
                    # Guard against legacy cached DB.init() wiping pos2State without an event
                    is_legacy_init_wipe = (
                        k == "pos2State"
                        and not body.get("event")
                        and not body.get("explicit")
                        and _is_baseline_value("pos2State", val)
                        and k in _state["store"]
                        and not _is_baseline_value("pos2State", _state["store"][k])
                    )
                    if not is_legacy_init_wipe:
                        _state["store"][k] = val
                        mod_set.add(k)
                        _state["version"] = int(time.time() * 1000)

                # 2. Bulk store merge/seed
                if "store" in body and isinstance(body["store"], dict):
                    only_if_empty = body.get("onlyIfEmpty", False)
                    any_updated = False
                    for k, v in body["store"].items():
                        incoming_is_base = _is_baseline_value(k, v)
                        if k not in _state["store"]:
                            _state["store"][k] = v
                            if not incoming_is_base:
                                mod_set.add(k)
                            any_updated = True
                        else:
                            current_is_base = _is_baseline_value(k, _state["store"][k])
                            # Upgrade baseline value if incoming tab has non-baseline user edits!
                            if current_is_base and not incoming_is_base and k not in mod_set:
                                _state["store"][k] = v
                                mod_set.add(k)
                                any_updated = True
                            elif not only_if_empty and not incoming_is_base:
                                _state["store"][k] = v
                                mod_set.add(k)
                                any_updated = True
                    if any_updated:
                        _state["version"] = int(time.time() * 1000)

                # 3. Realtime event broadcast
                if "event" in body and body["event"]:
                    _state["lastEvent"] = body["event"]
                    _state["version"] = int(time.time() * 1000)

                _state["modifiedKeys"] = list(mod_set)
                save_db()
                ver = _state["version"]

            resp = json.dumps({"ok": True, "version": ver}).encode("utf-8")
            self.send_response(200)
            self._send_cors_headers()
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(resp)))
            self.end_headers()
            self.wfile.write(resp)
            return

        if parsed.path == "/api/reset":
            with _lock:
                _state["store"] = {}
                _state["modifiedKeys"] = []
                _state["version"] = int(time.time() * 1000)
                _state["lastEvent"] = {"type": "SYSTEM_RESET", "ts": _state["version"]}
                save_db()
                for fn in os.listdir(UPLOADS_DIR):
                    try:
                        os.remove(os.path.join(UPLOADS_DIR, fn))
                    except Exception:
                        pass

            resp = json.dumps({"ok": True, "version": _state["version"]}).encode("utf-8")
            self.send_response(200)
            self._send_cors_headers()
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(resp)))
            self.end_headers()
            self.wfile.write(resp)
            return

        if parsed.path.startswith("/api/media/"):
            media_id = parsed.path.split("/api/media/", 1)[1].strip("/")
            safe_id = "".join(c for c in media_id if c.isalnum() or c in ("_", "-", "."))
            file_data = self.rfile.read(content_len) if content_len > 0 else b""
            file_name = self.headers.get("X-File-Name", safe_id)
            file_type = self.headers.get("X-File-Type", "application/octet-stream")

            bin_path = os.path.join(UPLOADS_DIR, safe_id + ".bin")
            meta_path = os.path.join(UPLOADS_DIR, safe_id + ".meta.json")
            with open(bin_path, "wb") as bf:
                bf.write(file_data)
            with open(meta_path, "w", encoding="utf-8") as mf:
                json.dump({"id": safe_id, "name": file_name, "type": file_type, "size": len(file_data)}, mf)

            resp = json.dumps({"ok": True, "id": safe_id}).encode("utf-8")
            self.send_response(200)
            self._send_cors_headers()
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(resp)))
            self.end_headers()
            self.wfile.write(resp)
            return

        self.send_response(404)
        self._send_cors_headers()
        self.end_headers()


if __name__ == "__main__":
    import sys
    import webbrowser
    server = ThreadingHTTPServer(("0.0.0.0", PORT), SyncRequestHandler)
    print(f"Petualangan TUMBUH Sync Server aktif di http://127.0.0.1:{PORT}")
    if "--open" in sys.argv:
        threading.Timer(0.4, lambda: webbrowser.open(f"http://127.0.0.1:{PORT}")).start()
    server.serve_forever()
