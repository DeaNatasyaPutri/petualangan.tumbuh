#!/usr/bin/env python3
"""
Local + 24/7 Cloud Real-Time Sync Server for Petualangan TUMBUH.
Allows multiple Chrome profiles (different Google emails), different browsers,
and different devices (phones, tablets, other laptops, PIDs) across any network
to share 100% of state and uploaded media in real time.
"""

import json
import os
import shutil
import threading
import time
import urllib.request
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse, parse_qs

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_FILE = os.path.join(BASE_DIR, "sync-db.json")
RESTORED_DATA_FILE = os.path.join(BASE_DIR, "js", "restored_data.js")
UPLOADS_DIR = os.path.join(BASE_DIR, "uploads")
PORT = 8765

CLOUD_BASE_URL = "https://ntfy.sh"
CLOUD_TOPIC = "ptumbuh_dea_sync_v11"

os.makedirs(UPLOADS_DIR, exist_ok=True)

_lock = threading.Lock()
_baseline_store = {}
_processed_cloud_ids = set()
_last_cloud_id = "all"
_last_snapshot_ts = time.time()

_state = {
    "version": int(time.time() * 1000),
    "store": {},          # key -> JSON-parsed value
    "keyTimestamps": {},  # key -> millisecond timestamp of last update
    "modifiedKeys": [],   # keys explicitly modified
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
                        "keyTimestamps": data.get("keyTimestamps", {}),
                        "modifiedKeys": data.get("modifiedKeys", []),
                        "lastEvent": data.get("lastEvent", None)
                    }
        except Exception as e:
            print("Warning: failed to load sync-db.json:", e)
    if not _state["store"] and _baseline_store:
        now_ms = int(time.time() * 1000)
        _state["store"] = dict(_baseline_store)
        _state["keyTimestamps"] = {k: now_ms for k in _baseline_store}
        _state["modifiedKeys"] = list(_baseline_store.keys())


def save_db():
    try:
        tmp_file = DB_FILE + ".tmp"
        with open(tmp_file, "w", encoding="utf-8") as f:
            json.dump(_state, f, ensure_ascii=False)
        os.replace(tmp_file, DB_FILE)

        # Also write live snapshot to js/restored_data.js for automatic offline/static baseline sync
        if _state.get("store"):
            with open(RESTORED_DATA_FILE, "w", encoding="utf-8") as rf:
                rf.write("// Auto-restored data snapshot for Guru Dea Natasya\nwindow.RESTORED_DEA_DATA = " + json.dumps(_state["store"], ensure_ascii=False) + ";\n")
    except Exception as e:
        print("Warning: failed to save sync-db.json:", e)


def _apply_cloud_msg(msg):
    global _last_cloud_id
    if not isinstance(msg, dict) or msg.get("event") != "message":
        return False
    msg_id = msg.get("id")
    if not msg_id or msg_id in _processed_cloud_ids:
        return False
    _processed_cloud_ids.add(msg_id)
    _last_cloud_id = msg_id

    payload = None
    try:
        att = msg.get("attachment")
        if isinstance(att, dict) and att.get("url"):
            req = urllib.request.Request(att["url"], headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=15) as resp:
                payload = json.loads(resp.read().decode("utf-8"))
        elif msg.get("message"):
            payload = json.loads(msg["message"])
    except Exception:
        return False

    if not isinstance(payload, dict):
        return False

    changed = False
    with _lock:
        key_ts_map = _state.setdefault("keyTimestamps", {})
        mod_set = set(_state.get("modifiedKeys", []))

        if payload.get("type") == "FULL_SNAPSHOT" and isinstance(payload.get("store"), dict):
            incoming_ts_map = payload.get("keyTimestamps") or {}
            for k, v in payload["store"].items():
                inc_ts = incoming_ts_map.get(k) or payload.get("ts") or 0
                cur_ts = key_ts_map.get(k, 0)
                if inc_ts > cur_ts or k not in _state["store"]:
                    _state["store"][k] = v
                    key_ts_map[k] = inc_ts
                    mod_set.add(k)
                    changed = True
        elif "key" in payload and "value" in payload:
            k = payload["key"]
            inc_ts = payload.get("ts") or int((msg.get("time") or time.time()) * 1000)
            cur_ts = key_ts_map.get(k, 0)
            if inc_ts >= cur_ts:
                if _state["store"].get(k) != payload["value"]:
                    changed = True
                _state["store"][k] = payload["value"]
                key_ts_map[k] = inc_ts
                mod_set.add(k)
                if payload.get("event"):
                    _state["lastEvent"] = payload["event"]
        elif payload.get("type") == "RT_EVENT" and payload.get("event"):
            _state["lastEvent"] = payload["event"]
            changed = True

        if changed:
            _state["modifiedKeys"] = list(mod_set)
            _state["version"] = int(time.time() * 1000)
            save_db()
    return changed


def _publish_cloud_snapshot():
    global _last_snapshot_ts
    try:
        with _lock:
            now_ms = int(time.time() * 1000)
            snap_bytes = json.dumps({
                "type": "FULL_SNAPSHOT",
                "senderId": "server_keepalive",
                "ts": now_ms,
                "store": _state["store"],
                "keyTimestamps": _state.get("keyTimestamps", {})
            }, ensure_ascii=False).encode("utf-8")
        req = urllib.request.Request(
            f"{CLOUD_BASE_URL}/{CLOUD_TOPIC}",
            data=snap_bytes,
            headers={"Filename": f"snapshot_{now_ms}.json", "User-Agent": "Mozilla/5.0"},
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=20) as resp:
            res_json = json.loads(resp.read().decode("utf-8"))
            if res_json.get("id"):
                _processed_cloud_ids.add(res_json["id"])
        _last_snapshot_ts = time.time()
    except Exception:
        pass


def _cloud_sync_loop():
    global _last_snapshot_ts
    while True:
        try:
            url = f"{CLOUD_BASE_URL}/{CLOUD_TOPIC}/json?poll=1&since={_last_cloud_id}"
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=15) as resp:
                raw_lines = resp.read().decode("utf-8").splitlines()
            for line in raw_lines:
                line = line.strip()
                if not line:
                    continue
                try:
                    msg = json.loads(line)
                    _apply_cloud_msg(msg)
                except Exception:
                    pass
            # Re-publish keepalive snapshot every 3 hours so 24/7 cloud state never expires
            if (time.time() - _last_snapshot_ts) > 3 * 3600:
                _publish_cloud_snapshot()
        except Exception:
            pass
        time.sleep(3.0)


load_baseline()
load_db()


class SyncRequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def log_message(self, format, *args):
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
        parsed = urlparse(self.path)
        if parsed.path == "/api/sync":
            qs = parse_qs(parsed.query)
            client_ver = int(qs.get("since", ["0"])[0] or 0)
            with _lock:
                has_update = (_state["version"] != client_ver) or (client_ver == 0)
                payload = {
                    "ok": True,
                    "version": _state["version"],
                    "changed": has_update,
                    "store": _state["store"] if has_update else None,
                    "keyTimestamps": _state.get("keyTimestamps", {}),
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

        if parsed.path == "/player":
            qs = parse_qs(parsed.query)
            video_id = qs.get("id", [""])[0]
            safe_id = "".join(c for c in video_id if c.isalnum() or c in ("_", "-"))
            autoplay = qs.get("autoplay", ["1"])[0]
            ap_val = "1" if autoplay in ("1", "true") else "0"
            html = f"""<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="referrer" content="strict-origin-when-cross-origin">
  <title>Pemutar Video Petualangan TUMBUH</title>
  <style>
    * {{ margin: 0; padding: 0; box-sizing: border-box; }}
    html, body {{ width: 100%; height: 100%; overflow: hidden; background: #000; display: flex; align-items: center; justify-content: center; }}
    #player-wrap {{ position: relative; width: 100%; height: 100%; }}
    iframe {{ position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; }}
  </style>
</head>
<body>
  <div id="player-wrap">
    <iframe
      id="ytplayer"
      src="https://www.youtube.com/embed/{safe_id}?autoplay={ap_val}&rel=0&modestbranding=1&enablejsapi=1"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
      referrerpolicy="strict-origin-when-cross-origin">
    </iframe>
  </div>
</body>
</html>"""
            resp = html.encode("utf-8")
            self.send_response(200)
            self._send_cors_headers()
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(resp)))
            self.end_headers()
            self.wfile.write(resp)
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
                key_ts_map = _state.setdefault("keyTimestamps", {})
                now_ms = int(time.time() * 1000)

                # 1. Single key update (from DB.set)
                if "key" in body:
                    k = body["key"]
                    val = body.get("value")
                    inc_ts = body.get("ts") or now_ms
                    if inc_ts >= key_ts_map.get(k, 0) or body.get("explicit"):
                        _state["store"][k] = val
                        key_ts_map[k] = inc_ts
                        mod_set.add(k)
                        _state["version"] = now_ms

                # 2. Bulk store merge/seed
                if "store" in body and isinstance(body["store"], dict):
                    only_if_empty = body.get("onlyIfEmpty", False)
                    inc_ts_map = body.get("keyTimestamps") or {}
                    any_updated = False
                    for k, v in body["store"].items():
                        inc_ts = inc_ts_map.get(k, 0)
                        cur_ts = key_ts_map.get(k, 0)
                        if k not in _state["store"]:
                            _state["store"][k] = v
                            key_ts_map[k] = inc_ts or now_ms
                            mod_set.add(k)
                            any_updated = True
                        elif not only_if_empty and inc_ts > cur_ts:
                            _state["store"][k] = v
                            key_ts_map[k] = inc_ts
                            mod_set.add(k)
                            any_updated = True
                    if any_updated:
                        _state["version"] = now_ms

                # 3. Realtime event broadcast
                if "event" in body and body["event"]:
                    _state["lastEvent"] = body["event"]
                    _state["version"] = now_ms

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
                now_ms = int(time.time() * 1000)
                _state["store"] = dict(_baseline_store)
                _state["keyTimestamps"] = {k: now_ms for k in _baseline_store}
                _state["modifiedKeys"] = list(_baseline_store.keys())
                _state["version"] = now_ms
                _state["lastEvent"] = {"type": "SYSTEM_RESET", "ts": now_ms}
                save_db()

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
    t = threading.Thread(target=_cloud_sync_loop, daemon=True)
    t.start()
    server = ThreadingHTTPServer(("0.0.0.0", PORT), SyncRequestHandler)
    print(f"Petualangan TUMBUH Sync Server aktif di http://127.0.0.1:{PORT}")
    if "--open" in sys.argv:
        threading.Timer(0.4, lambda: webbrowser.open(f"http://127.0.0.1:{PORT}")).start()
    server.serve_forever()
