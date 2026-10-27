// ============================================================
// SOUND.JS — Web Audio API Sound Effects (SFX) & Multi-Track
//            Background Music (BGM) Engine for Petualangan TUMBUH
// ============================================================

const SoundManager = {
  _ctx: null,
  _sfxEnabled: true,
  _bgmEnabled: true,
  _bgmMode: 'auto', // 'auto' | 'ceria' | 'alam' | 'tantangan' | 'kompetisi' | 'refleksi'
  _currentTrack: 'ceria',
  _bgmInterval: null,
  _stepIdx: 0,
  _volume: 0.45,
  _unlocked: false,
  _panelExpanded: false,
  _pausedForVideo: false,

  tracks: {
    ceria: {
      name: '🌿 Petualangan Ceria',
      desc: 'Melodi semangat berpetualang (Beranda)',
      tempo: 260,
      wave: 'triangle',
      bassWave: 'sine',
      notes: [
        523.25, 659.25, 783.99, 659.25, 880.00, 783.99, 659.25, 587.33,
        523.25, 587.33, 659.25, 783.99, 659.25, 587.33, 523.25, 0
      ],
      bass: [
        261.63, 0, 261.63, 0, 220.00, 0, 196.00, 0,
        174.61, 0, 196.00, 0, 261.63, 0, 261.63, 0
      ]
    },
    alam: {
      name: '🔭 Eksplorasi Alam',
      desc: 'Suasana tenang menjelajah ilmu (Pos 1)',
      tempo: 340,
      wave: 'sine',
      bassWave: 'triangle',
      notes: [
        587.33, 0, 659.25, 783.99, 880.00, 0, 783.99, 659.25,
        587.33, 659.25, 523.25, 0, 440.00, 523.25, 587.33, 0
      ],
      bass: [
        196.00, 0, 0, 196.00, 220.00, 0, 0, 220.00,
        174.61, 0, 0, 174.61, 196.00, 0, 0, 196.00
      ]
    },
    tantangan: {
      name: '🎡 Misteri Tantangan',
      desc: 'Irama pemecahan kasus kelompok (Pos 2)',
      tempo: 240,
      wave: 'triangle',
      bassWave: 'triangle',
      notes: [
        440.00, 523.25, 659.25, 440.00, 587.33, 659.25, 783.99, 659.25,
        440.00, 523.25, 659.25, 880.00, 783.99, 659.25, 587.33, 523.25
      ],
      bass: [
        220.00, 220.00, 0, 220.00, 196.00, 196.00, 0, 196.00,
        174.61, 174.61, 0, 174.61, 164.81, 0, 196.00, 0
      ]
    },
    kompetisi: {
      name: '🏆 Arena Kompetisi',
      desc: 'Ketukan cepat kuis & tantangan (Pos 3)',
      tempo: 195,
      wave: 'square',
      bassWave: 'triangle',
      notes: [
        659.25, 659.25, 0, 659.25, 0, 523.25, 659.25, 0,
        783.99, 0, 0, 0, 392.00, 0, 523.25, 587.33
      ],
      bass: [
        261.63, 329.63, 392.00, 329.63, 220.00, 261.63, 329.63, 261.63,
        196.00, 246.94, 293.66, 246.94, 261.63, 0, 196.00, 0
      ]
    },
    refleksi: {
      name: '🌱 Refleksi Damai',
      desc: 'Melodi lembut merenungkan langkah tumbuh (Pos 4)',
      tempo: 420,
      wave: 'sine',
      bassWave: 'sine',
      notes: [
        523.25, 659.25, 783.99, 1046.50, 880.00, 783.99, 659.25, 0,
        587.33, 698.46, 880.00, 783.99, 659.25, 587.33, 523.25, 0
      ],
      bass: [
        261.63, 0, 0, 0, 220.00, 0, 0, 0,
        174.61, 0, 0, 0, 196.00, 0, 0, 0
      ]
    }
  },

  init() {
    // Load saved preferences
    const saved = localStorage.getItem('tumbuh_audio_prefs');
    if (saved) {
      try {
        const p = JSON.parse(saved);
        if (typeof p.sfxEnabled === 'boolean') this._sfxEnabled = p.sfxEnabled;
        if (typeof p.bgmEnabled === 'boolean') this._bgmEnabled = p.bgmEnabled;
        if (p.bgmMode) this._bgmMode = p.bgmMode;
        if (typeof p.volume === 'number') this._volume = p.volume;
      } catch {}
    }

    this._renderFloatingControl();
    this._bindGlobalEvents();
  },

  _savePrefs() {
    localStorage.setItem('tumbuh_audio_prefs', JSON.stringify({
      sfxEnabled: this._sfxEnabled,
      bgmEnabled: this._bgmEnabled,
      bgmMode: this._bgmMode,
      volume: this._volume
    }));
  },

  _ensureContext() {
    if (!this._ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this._ctx = new AudioCtx();
    }
    if (this._ctx && this._ctx.state === 'suspended') {
      this._ctx.resume();
    }
    if (!this._unlocked && this._ctx) {
      this._unlocked = true;
      if (this._bgmEnabled && !this._bgmInterval && !this._pausedForVideo) {
        this.startBGM();
      }
    }
    return this._ctx;
  },

  _bindGlobalEvents() {
    // Unlock Web Audio on first user interaction & play button click SFX
    document.addEventListener('click', (e) => {
      this._ensureContext();

      // Auto-close expanded audio dropdown panel when clicking outside the audio widget
      if (this._panelExpanded && !e.target.closest('#audio-control-widget')) {
        this._panelExpanded = false;
        this._updateFloatingUI();
      }

      // Do not play normal click if inside audio panel toggle that plays its own sound
      const interactive = e.target.closest(
        'button, .role-pill, .hint-card, .filter-pill, .pos-card, .topic-card, .turn-order-item, .pos4-dot, .murid-select-item'
      );
      if (interactive && !interactive.disabled && !interactive.classList.contains('locked')) {
        if (interactive.classList.contains('btn-spin')) {
          this.playSFX('spinStart');
        } else if (interactive.classList.contains('kuis-option') || interactive.classList.contains('ta-option')) {
          // Handled by answer check
        } else if (interactive.classList.contains('sidebar-nav-btn') || interactive.classList.contains('pos-back-btn')) {
          this.playSFX('nav');
        } else {
          this.playSFX('click');
        }
      }
    }, true);

    // Subtle hover sound on main buttons & cards
    document.addEventListener('mouseover', (e) => {
      if (!this._unlocked || !this._sfxEnabled) return;
      const btn = e.target.closest('.pos-card, .btn-spin, .pos3-mode-card');
      if (btn && !btn.dataset.hoverSoundPlayed) {
        btn.dataset.hoverSoundPlayed = '1';
        this.playSFX('hover');
        btn.addEventListener('mouseleave', () => {
          delete btn.dataset.hoverSoundPlayed;
        }, { once: true });
      }
    });
  },

  // ══════════════════════════════════════════════════════════
  // SOUND EFFECTS (SFX) SYNTHESIZER
  // ══════════════════════════════════════════════════════════
  playSFX(type) {
    if (!this._sfxEnabled) return;
    const ctx = this._ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const vol = Math.min(1, this._volume * 1.3);

    switch (type) {
      case 'click': {
        this._tone(660, now, 0.045, 'sine', vol * 0.45, 880);
        break;
      }
      case 'nav': {
        this._tone(523.25, now, 0.05, 'triangle', vol * 0.4, 659.25);
        this._tone(659.25, now + 0.045, 0.06, 'triangle', vol * 0.4, 783.99);
        break;
      }
      case 'hover': {
        this._tone(880, now, 0.025, 'sine', vol * 0.15, 987.77);
        break;
      }
      case 'tick': {
        this._tone(900, now, 0.03, 'triangle', vol * 0.35, 450);
        break;
      }
      case 'spinStart': {
        [392, 523.25, 659.25, 783.99].forEach((f, i) => {
          this._tone(f, now + i * 0.05, 0.08, 'triangle', vol * 0.45);
        });
        break;
      }
      case 'reveal': {
        [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
          this._tone(f, now + i * 0.06, 0.14, 'sine', vol * 0.5);
        });
        break;
      }
      case 'correct':
      case 'success': {
        [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
          this._tone(f, now + i * 0.07, 0.16, 'triangle', vol * 0.55);
        });
        break;
      }
      case 'wrong':
      case 'error': {
        this._tone(311.13, now, 0.16, 'sawtooth', vol * 0.35, 277.18);
        this._tone(261.63, now + 0.15, 0.25, 'sawtooth', vol * 0.35, 207.65);
        break;
      }
      case 'warning': {
        this._tone(440, now, 0.1, 'triangle', vol * 0.4);
        this._tone(440, now + 0.14, 0.12, 'triangle', vol * 0.4);
        break;
      }
      case 'fanfare': {
        const melody = [
          { f: 523.25, d: 0.1, t: 0 },
          { f: 659.25, d: 0.1, t: 0.1 },
          { f: 783.99, d: 0.1, t: 0.2 },
          { f: 1046.50, d: 0.28, t: 0.3 },
          { f: 783.99, d: 0.12, t: 0.6 },
          { f: 1046.50, d: 0.4, t: 0.74 },
        ];
        melody.forEach(n => {
          this._tone(n.f, now + n.t, n.d, 'triangle', vol * 0.6);
        });
        break;
      }
    }
  },

  _tone(freq, startTime, duration, type = 'sine', peakGain = 0.2, endFreq = null) {
    const ctx = this._ctx;
    if (!ctx || !freq) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);
    if (endFreq) {
      osc.frequency.exponentialRampToValueAtTime(endFreq, startTime + duration);
    }

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(peakGain, startTime + Math.min(0.015, duration * 0.25));
    gain.gain.exponentialRampToValueAtTime(0.0008, startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.01);
  },

  // ══════════════════════════════════════════════════════════
  // MULTI-TRACK BACKGROUND MUSIC (BGM) ENGINE
  // ══════════════════════════════════════════════════════════
  onNavigate(viewName) {
    this._pausedForVideo = false;
    if (this._bgmMode === 'auto') {
      const map = {
        login: 'ceria',
        dashboard: 'ceria',
        admin: 'ceria',
        guru: 'ceria',
        murid: 'ceria',
        pos1: 'alam',
        pos2: 'tantangan',
        pos3: 'kompetisi',
        pos4: 'refleksi',
      };
      const nextTrack = map[viewName] || 'ceria';
      if (nextTrack !== this._currentTrack || !this._bgmInterval) {
        this._currentTrack = nextTrack;
        if (this._bgmEnabled && this._unlocked) {
          this.startBGM();
        }
      }
    }
    this._updateFloatingUI();
  },

  startBGM() {
    this.stopBGM();
    if (!this._bgmEnabled || this._pausedForVideo) return;
    const ctx = this._ensureContext();
    if (!ctx) return;

    const trackKey = this._bgmMode === 'auto' ? this._currentTrack : this._bgmMode;
    const track = this.tracks[trackKey] || this.tracks.ceria;
    this._stepIdx = 0;

    this._bgmInterval = setInterval(() => {
      if (!this._bgmEnabled || this._pausedForVideo || !this._ctx || this._ctx.state !== 'running') return;
      const now = this._ctx.currentTime;
      const idx = this._stepIdx % track.notes.length;
      const noteFreq = track.notes[idx];
      const bassFreq = track.bass[idx];
      const dur = (track.tempo / 1000) * 0.85;

      // Lead note
      if (noteFreq > 0) {
        const leadGain = track.wave === 'square' ? this._volume * 0.08 : this._volume * 0.16;
        this._tone(noteFreq, now, dur, track.wave, leadGain);
      }
      // Bass note
      if (bassFreq > 0) {
        this._tone(bassFreq, now, dur * 1.1, track.bassWave || 'sine', this._volume * 0.12);
      }

      this._stepIdx++;
    }, track.tempo);

    this._updateFloatingUI();
  },

  stopBGM() {
    if (this._bgmInterval) {
      clearInterval(this._bgmInterval);
      this._bgmInterval = null;
    }
  },

  pauseBGMForMedia(pause = true) {
    this._pausedForVideo = pause;
    if (pause) {
      this.stopBGM();
    } else if (this._bgmEnabled) {
      this.startBGM();
    }
    this._updateFloatingUI();
  },

  toggleBGM() {
    this._ensureContext();
    this._bgmEnabled = !this._bgmEnabled;
    this._savePrefs();
    if (this._bgmEnabled) {
      this.startBGM();
      this.playSFX('click');
    } else {
      this.stopBGM();
    }
    this._updateFloatingUI();
  },

  toggleSFX() {
    this._ensureContext();
    this._sfxEnabled = !this._sfxEnabled;
    this._savePrefs();
    if (this._sfxEnabled) {
      this.playSFX('correct');
    }
    this._updateFloatingUI();
  },

  setBGMTrack(mode) {
    this._ensureContext();
    this._bgmMode = mode;
    if (mode !== 'auto') {
      this._currentTrack = mode;
    } else if (window.App && App.currentView) {
      this.onNavigate(App.currentView);
      this._savePrefs();
      return;
    }
    this._savePrefs();
    if (this._bgmEnabled) {
      this.startBGM();
    }
    this._updateFloatingUI();
  },

  setVolume(val) {
    this._volume = parseFloat(val);
    this._savePrefs();
  },

  togglePanel() {
    this._panelExpanded = !this._panelExpanded;
    this._updateFloatingUI();
  },

  // ══════════════════════════════════════════════════════════
  // FLOATING AUDIO CONTROL WIDGET (Desktop & PID Friendly)
  // ══════════════════════════════════════════════════════════
  _renderFloatingControl() {
    let widget = document.getElementById('audio-control-widget');
    if (!widget) {
      widget = document.createElement('div');
      widget.id = 'audio-control-widget';
      widget.className = 'audio-widget';
      document.body.appendChild(widget);
    }
    this._updateFloatingUI();
  },

  _updateFloatingUI() {
    const widget = document.getElementById('audio-control-widget');
    if (!widget) return;

    const activeTrackKey = this._bgmMode === 'auto' ? this._currentTrack : this._bgmMode;
    const activeTrack = this.tracks[activeTrackKey] || this.tracks.ceria;

    widget.innerHTML = `
      <div class="audio-pill-bar compact" title="Pengaturan Musik & Suara Tombol">
        <button class="audio-btn-icon ${this._bgmEnabled ? 'on' : 'off'}"
          onclick="SoundManager.toggleBGM()"
          title="Musik Latar: ${this._bgmEnabled ? 'ON (Klik untuk Matikan)' : 'OFF (Klik untuk Nyalakan)'}">
          ${this._bgmEnabled ? '🎵' : '🔇'}
        </button>

        <button class="audio-btn-icon ${this._sfxEnabled ? 'on' : 'off'}"
          onclick="SoundManager.toggleSFX()"
          title="Suara Tombol: ${this._sfxEnabled ? 'ON (Klik untuk Matikan)' : 'OFF (Klik untuk Nyalakan)'}">
          ${this._sfxEnabled ? '🔊' : '🔈'}
        </button>

        <button class="audio-btn-expand ${this._panelExpanded ? 'active' : ''}"
          onclick="SoundManager.togglePanel()"
          title="Buka / Tutup Menu Musik & Volume">
          ${this._panelExpanded ? '✕' : '🎼'}
        </button>
      </div>

      ${this._panelExpanded ? `
        <div class="audio-dropdown-panel">
          <div class="audio-panel-title">
            <span>🎼 Pengaturan Audio</span>
            <button class="audio-panel-close" onclick="SoundManager.togglePanel()" title="Tutup Panel">✕</button>
          </div>

          <!-- Quick Toggles Inside Panel -->
          <div class="audio-panel-toggles">
            <button class="audio-toggle-card ${this._bgmEnabled ? 'on' : 'off'}" onclick="SoundManager.toggleBGM()">
              <span>${this._bgmEnabled ? '🎵' : '🔇'} Musik Latar</span>
              <strong>${this._bgmEnabled ? 'ON' : 'OFF'}</strong>
            </button>
            <button class="audio-toggle-card ${this._sfxEnabled ? 'on' : 'off'}" onclick="SoundManager.toggleSFX()">
              <span>${this._sfxEnabled ? '🔊' : '🔈'} Suara Tombol</span>
              <strong>${this._sfxEnabled ? 'ON' : 'OFF'}</strong>
            </button>
          </div>

          <div class="audio-panel-sublabel">Pilih Tema Musik (${activeTrack.name}):</div>

          <div class="audio-track-list">
            <button class="audio-track-item ${this._bgmMode === 'auto' ? 'active' : ''}"
              onclick="SoundManager.setBGMTrack('auto')">
              <span>✨ <strong>Otomatis Sesuai Pos</strong> (Berganti tiap Pos)</span>
              ${this._bgmMode === 'auto' ? '<span class="track-active-dot">● Aktif</span>' : ''}
            </button>

            ${Object.entries(this.tracks).map(([key, t]) => `
              <button class="audio-track-item ${this._bgmMode === key ? 'active' : ''}"
                onclick="SoundManager.setBGMTrack('${key}')">
                <div>
                  <div><strong>${t.name}</strong></div>
                  <small>${t.desc}</small>
                </div>
                ${activeTrackKey === key ? '<span class="track-active-dot">♫</span>' : ''}
              </button>
            `).join('')}
          </div>

          <div class="audio-volume-row">
            <span>🔉 Volume</span>
            <input type="range" min="0.1" max="1" step="0.05" value="${this._volume}"
              oninput="SoundManager.setVolume(this.value)">
            <span>🔊</span>
          </div>
        </div>
      ` : ''}
    `;
  }
};
