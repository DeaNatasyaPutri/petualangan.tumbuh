// ============================================================
// POS3.JS — Pos 3: Kuis Kejutan (Kelompok - 15s Option Delay Timer)
//           & Tantangan Akhir (Individu - Pilihan Ganda & Esai)
// ============================================================

const Pos3View = {
  // Kuis Kejutan (Kelompok) state
  _kk: {
    questions: [],
    currentIdx: 0,
    scores: {},
    kelompok: [],
    phase: 'setup',
    answered: false,
    revealTimer: null,
    revealTimeLeft: 15,
    optionsRevealed: false,
  },

  // Tantangan Akhir (Individu: PG & Esai) state
  _ta: {
    questions: [],
    currentIdx: 0,
    score: 0,
    timer: null,
    timeLeft: 30,
    answered: false,
    userAnswers: [],
    phase: 'start',
  },

  render() {
    this._clearAllTimers();
    const user = Auth.getCurrentUser();
    const backTarget = (user?.role === 'guru' || user?.role === 'admin') ? 'dashboard' : 'murid';
    const kkList = DB.getKuisKejutan();
    const taList = DB.getTantanganAkhir();
    const pgCount = taList.filter(q => (q.type || 'pg') === 'pg').length;
    const esaiCount = taList.filter(q => q.type === 'esai').length;

    const el = document.getElementById('view-pos3');
    el.innerHTML = `
      <div class="pos-layout">
        <!-- Header -->
        <div class="pos-header" style="background:linear-gradient(135deg,#F9A825,#E65100)">
          <button class="pos-back-btn" onclick="Pos3View._clearAllTimers(); App.navigate('${backTarget}')">← Kembali</button>
          <div class="pos-header-content">
            <div class="pos-header-num">POS 3</div>
            <h1 class="pos-header-title">🏆 Kuis Kejutan & Tantangan Akhir</h1>
            <p class="pos-header-desc">Evaluasi pemahamanmu melalui Kuis Kompetisi Kelompok dan Asesmen Individu (Pilihan Ganda & Esai)!</p>
          </div>
          ${(Auth.isGuru() || Auth.isAdmin()) ? `
            <button class="pos-back-btn" onclick="Pos3View._clearAllTimers(); App.navigate('guru',{tab:'kuis'})">✏️ Kelola Soal PG & Esai</button>
          ` : ''}
        </div>

        <!-- Menu Pilihan -->
        <div class="pos-content pos3-menu-content" id="pos3-menu">
          <h2 class="pos3-menu-title">Pilih Mode Evaluasi Pembelajaran</h2>
          <div class="pos3-cards">
            <!-- Kuis Kejutan (Kelompok) -->
            <div class="pos3-mode-card kuis">
              <div class="pos3-mode-header">
                <span class="pos3-mode-emoji">⚡</span>
                <div class="pos3-mode-badge">Kompetisi Kelompok</div>
              </div>
              <h2>Kuis Kejutan (Kelompok)</h2>
              <p>Kompetisi seru antar kelompok! Soal beserta pilihan jawaban ditayangkan selama 15 detik hitung mundur sebelum kunci jawaban muncul.</p>
              <ul class="pos3-mode-features">
                <li>⚡ ${kkList.length} soal kompetisi (Babak Utama & Penentuan)</li>
                <li>⏱️ Soal & pilihan jawaban tampil dengan timer 15 detik</li>
                <li>🏅 Papan skor digital langsung (+10 poin benar, 0 salah)</li>
                <li>🔄 Navigasi ke soal/jawaban sebelumnya & setelahnya</li>
              </ul>
              <button class="btn-pos3-kuis" onclick="Pos3View.startKuisSetup()">⚡ Mulai Kuis Kelompok!</button>
            </div>

            <!-- Tantangan Akhir (Individu: PG & Esai) -->
            <div class="pos3-mode-card tantangan">
              <div class="pos3-mode-header">
                <span class="pos3-mode-emoji">⏱️</span>
                <div class="pos3-mode-badge">Asesmen Individu (PG & Esai)</div>
              </div>
              <h2>Tantangan Akhir (Individu)</h2>
              <p>Asesmen sumatif individu yang memadukan soal Pilihan Ganda dan Esai dengan penghitung waktu otomatis.</p>
              <ul class="pos3-mode-features">
                <li>📝 ${pgCount} Soal Pilihan Ganda & ${esaiCount} Soal Esai</li>
                <li>⏱️ Timer visual per soal (otomatis pindah saat habis)</li>
                <li>✍️ Antarmuka lembar jawab Pilihan Ganda & Uraian Esai</li>
                <li>📊 Evaluasi & rincian hasil lengkap di akhir</li>
              </ul>
              <button class="btn-pos3-tantangan" onclick="Pos3View.startTantangan()">⏱️ Mulai Kuis Individu!</button>
            </div>
          </div>
        </div>

        <!-- Kuis Kejutan Area -->
        <div id="pos3-kuis-area" style="display:none"></div>

        <!-- Tantangan Akhir Area -->
        <div id="pos3-tantangan-area" style="display:none"></div>
      </div>`;
  },

  _clearAllTimers() {
    if (this._kk.revealTimer) {
      clearInterval(this._kk.revealTimer);
      this._kk.revealTimer = null;
    }
    if (this._ta.timer) {
      clearInterval(this._ta.timer);
      this._ta.timer = null;
    }
  },

  // ══════════════════════════════════════════════════════════
  // 1. KUIS KEJUTAN (KELOMPOK - PILIHAN MUNCUL SETELAH 15 DETIK)
  // ══════════════════════════════════════════════════════════
  startKuisSetup() {
    this._clearAllTimers();
    document.getElementById('pos3-menu').style.display = 'none';
    const area = document.getElementById('pos3-kuis-area');
    area.style.display = 'block';
    area.innerHTML = `
      <div class="kuis-setup">
        <div class="kuis-setup-header">
          <h2>⚡ Kuis Kejutan — Pendaftaran Kelompok Kompetisi</h2>
          <p>Daftarkan kelompok yang akan bertanding! Setiap soal beserta pilihan jawaban ditampilkan dengan timer 15 detik sebelum kunci jawaban muncul.</p>
        </div>
        <div class="kelompok-setup-grid">
          <div class="kelompok-input-section">
            <label class="form-label">👥 Tambah Kelompok Peserta (Minimal 2 Kelompok)</label>
            <div class="kelompok-add-row">
              <input type="text" id="kk-kelompok-input" class="form-input" placeholder="Masukkan nama kelompok...">
              <button class="btn-primary" onclick="Pos3View.addKelompok()">➕ Tambah</button>
            </div>
            <div id="kk-kelompok-list" class="kelompok-list-chips"></div>
          </div>
          <div class="kuis-setup-preview">
            <h3>📋 Aturan Kuis Kelompok</h3>
            <div class="setup-info-row"><span>Babak Utama</span><strong>6 Soal</strong></div>
            <div class="setup-info-row"><span>Babak Penentuan</span><strong>4 Soal</strong></div>
            <div class="setup-info-row"><span>Waktu Menjawab per Soal</span><strong>⏱️ 15 Detik Visual</strong></div>
            <div class="setup-info-row"><span>Poin Jawaban Benar</span><strong>+10 Poin</strong></div>
            <div class="setup-info-row"><span>Poin Jawaban Salah</span><strong>0 Poin</strong></div>
          </div>
        </div>
        <div class="setup-actions">
          <button class="btn-secondary" onclick="Pos3View.render()">← Kembali ke Menu Pos 3</button>
          <button class="btn-primary lg" onclick="Pos3View.startKuisGame()">🚀 Mulai Kompetisi Sekarang!</button>
        </div>
      </div>`;

    this._kk.kelompok = [];
    this._kk.scores = {};
    ['Kelompok Matahari', 'Kelompok Bintang', 'Kelompok Pelangi'].forEach(k => this.addKelompok(k));
  },

  addKelompok(name) {
    const input = document.getElementById('kk-kelompok-input');
    const n = name || input?.value.trim();
    if (!n) { App.showToast('Masukkan nama kelompok!', 'error'); return; }
    if (this._kk.kelompok.includes(n)) { App.showToast('Nama kelompok sudah ada!', 'warning'); return; }

    this._kk.kelompok.push(n);
    this._kk.scores[n] = 0;
    if (input) input.value = '';
    this._renderKelompokChips();
  },

  removeKelompok(name) {
    this._kk.kelompok = this._kk.kelompok.filter(k => k !== name);
    delete this._kk.scores[name];
    this._renderKelompokChips();
  },

  _renderKelompokChips() {
    const listEl = document.getElementById('kk-kelompok-list');
    if (listEl) {
      listEl.innerHTML = this._kk.kelompok.map(k => `
        <div class="kelompok-chip-item">
          <span>👥 ${k}</span>
          <button onclick="Pos3View.removeKelompok('${k.replace(/'/g, "\\'")}')">✕</button>
        </div>`).join('');
    }
  },

  startKuisGame() {
    if (this._kk.kelompok.length < 2) {
      App.showToast('Minimal 2 kelompok untuk berkompetisi!', 'error');
      return;
    }

    const allQ = DB.getKuisKejutan();
    this._kk.questions = allQ;
    this._kk.currentIdx = 0;
    this._kk.phase = 'playing';
    this._kk.answered = false;
    this._kk.kelompok.forEach(k => { this._kk.scores[k] = 0; });

    this._renderKuisQuestion();
  },

  _renderKuisQuestion() {
    this._clearAllTimers();
    const area = document.getElementById('pos3-kuis-area');
    const q = this._kk.questions[this._kk.currentIdx];
    const isLast = this._kk.currentIdx >= this._kk.questions.length - 1;
    const isPenentuan = q?.babak === 'penentuan';
    const settings = DB.getSettings();

    if (!q) { this._renderKuisResult(); return; }

    this._kk.revealTimeLeft = 15;
    this._kk.optionsRevealed = false;
    this._kk.answered = false;
    const circumference = 2 * Math.PI * 44;

    area.innerHTML = `
      <div class="kuis-game-layout">
        <!-- Scoreboard -->
        <div class="kuis-scoreboard">
          <div class="scoreboard-header">
            <span>🏆 Papan Skor Digital</span>
            <span class="soal-counter">Soal ${this._kk.currentIdx + 1}/${this._kk.questions.length}</span>
          </div>
          <div class="scoreboard-list">
            ${this._renderScoreboard()}
          </div>
          ${isPenentuan
            ? '<div class="babak-badge penentuan">🔴 BABAK PENENTUAN!</div>'
            : '<div class="babak-badge utama">🔵 BABAK UTAMA</div>'}
        </div>

        <!-- Question Area -->
        <div class="kuis-question-area">
          <div class="kuis-q-header ${isPenentuan ? 'penentuan' : 'utama'}">
            <div class="kuis-q-num">Soal ${this._kk.currentIdx + 1} dari ${this._kk.questions.length}</div>
            <div class="kuis-q-type">${isPenentuan ? '🔴 Babak Penentuan (4 Soal)' : '🔵 Babak Utama (6 Soal)'}</div>
          </div>

          <div class="kuis-q-text">${q.pertanyaan}</div>

          <!-- Options Grid (Displayed immediately alongside the question during the 15s timer) -->
          <div class="kuis-options-grid" id="kk-options-grid">
            ${q.pilihan.map((p, i) => `
              <button class="kuis-option" id="kuis-opt-${i}"
                onclick="Pos3View.selectAnswer(${i}, ${q.jawaban})">
                <span class="kuis-opt-letter">${'ABCD'[i]}</span>
                <span class="kuis-opt-text">${p}</span>
              </button>`).join('')}
          </div>

          <!-- 15-Second Visual Countdown Box Before Correct Answer Appears -->
          <div id="kk-delay-box" class="kk-delay-countdown-box">
            <div class="kk-delay-ring-wrap">
              <svg class="ta-timer-ring" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="44" class="ta-ring-bg"/>
                <circle cx="50" cy="50" r="44" class="ta-ring-progress" id="kk-delay-ring"
                  stroke-dasharray="${circumference}" stroke-dashoffset="0" style="stroke:#F9A825"/>
              </svg>
              <div class="ta-timer-center" id="kk-delay-num">15</div>
            </div>
            <div class="kk-delay-info">
              <h4>⏳ Waktu Diskusi & Menjawab Kelompok (15 Detik)</h4>
              <p>Pilih jawaban A, B, C, atau D! Kunci jawaban yang benar akan muncul otomatis dalam <strong id="kk-delay-text">15</strong> detik...</p>
              <div class="kk-delay-bar-track">
                <div class="kk-delay-bar-fill" id="kk-delay-bar" style="width:100%"></div>
              </div>
            </div>
          </div>

          <div id="kuis-answer-reveal" style="display:none" class="kuis-answer-reveal"></div>

          <!-- Kelompok Scoring Buttons -->
          <div id="kuis-scoring-area" style="display:none" class="kuis-scoring-area">
            <p class="scoring-prompt">🏆 Berikan poin kepada kelompok yang menjawab benar (+${settings.pointsBenar} poin) atau jawaban salah (0 poin):</p>
            <div class="scoring-kelompok-grid">
              ${this._kk.kelompok.map(k => `
                <button class="btn-score-kelompok" onclick="Pos3View.addScore('${k.replace(/'/g, "\\'")}', ${settings.pointsBenar})">
                  👥 ${k} <span>+${settings.pointsBenar} Poin</span>
                </button>`).join('')}
              <button class="btn-score-none" onclick="Pos3View.noWinner()">❌ Jawaban Salah / Tidak Ada (0 Poin)</button>
            </div>
          </div>

          <!-- Navigation Buttons: Previous & Next Question/Answer -->
          <div class="kuis-nav-area">
            <button class="btn-secondary" onclick="Pos3View.prevKuisQ()" ${this._kk.currentIdx === 0 ? 'disabled' : ''}>
              ← Sebelumnya
            </button>
            <div style="display:flex;gap:10px;align-items:center">
              <button class="btn-secondary sm" id="btn-kk-show-ans" onclick="Pos3View._revealKuisOptions()">
                💡 Tampilkan Jawaban Sekarang
              </button>
              <button class="btn-primary" id="btn-kuis-next" onclick="Pos3View.nextKuisQ()">
                ${isLast ? '🏆 Lihat Hasil Akhir →' : 'Selanjutnya →'}
              </button>
            </div>
          </div>
        </div>
      </div>`;

    this._startKuis15SecCountdown();
  },

  _startKuis15SecCountdown() {
    const total = 15;
    const circumference = 2 * Math.PI * 44;

    this._kk.revealTimer = setInterval(() => {
      this._kk.revealTimeLeft--;

      const numEl = document.getElementById('kk-delay-num');
      const txtEl = document.getElementById('kk-delay-text');
      const ringEl = document.getElementById('kk-delay-ring');
      const barEl = document.getElementById('kk-delay-bar');

      if (numEl) numEl.textContent = this._kk.revealTimeLeft;
      if (txtEl) txtEl.textContent = this._kk.revealTimeLeft;
      if (ringEl) {
        const offset = circumference * (1 - this._kk.revealTimeLeft / total);
        ringEl.style.strokeDashoffset = offset;
        ringEl.style.stroke = this._kk.revealTimeLeft <= 5 ? '#E53935' : '#F9A825';
      }
      if (barEl) {
        barEl.style.width = `${(this._kk.revealTimeLeft / total) * 100}%`;
      }

      if (this._kk.revealTimeLeft <= 5 && this._kk.revealTimeLeft > 0) {
        if (typeof SoundManager !== 'undefined') SoundManager.playSFX('tick');
      }

      if (this._kk.revealTimeLeft <= 0) {
        clearInterval(this._kk.revealTimer);
        this._kk.revealTimer = null;
        this._revealKuisOptions();
      }
    }, 1000);
  },

  _revealKuisOptions() {
    if (this._kk.revealTimer) {
      clearInterval(this._kk.revealTimer);
      this._kk.revealTimer = null;
    }
    this._kk.optionsRevealed = true;
    this._kk.answered = true;
    if (typeof SoundManager !== 'undefined') SoundManager.playSFX('reveal');

    const q = this._kk.questions[this._kk.currentIdx];
    if (!q) return;

    const delayBox = document.getElementById('kk-delay-box');
    if (delayBox) {
      delayBox.innerHTML = `
        <div class="kk-options-ready-banner">
          ⏰ <strong>Waktu 15 Detik Selesai!</strong> Kunci jawaban untuk Soal ${this._kk.currentIdx + 1} ditampilkan di bawah:
        </div>`;
    }

    // Highlight the correct option
    document.querySelectorAll('.kuis-option').forEach((btn, i) => {
      btn.disabled = true;
      if (i === q.jawaban) btn.classList.add('correct');
    });

    // Show Answer & Explanation + Previous/Next Answer Navigation
    const reveal = document.getElementById('kuis-answer-reveal');
    if (reveal) {
      reveal.style.display = 'block';
      reveal.innerHTML = `
        <div class="answer-reveal-inner correct">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap">
            <strong>✅ Kunci Jawaban Benar: ${'ABCD'[q.jawaban]}. ${q.pilihan[q.jawaban]}</strong>
            <div style="display:flex;gap:8px">
              <button class="btn-secondary sm" onclick="Pos3View.prevKuisQ()" ${this._kk.currentIdx === 0 ? 'disabled' : ''}>← Jawaban Sebelumnya</button>
              <button class="btn-primary sm" onclick="Pos3View.nextKuisQ()">
                ${this._kk.currentIdx >= this._kk.questions.length - 1 ? '🏆 Hasil Akhir' : 'Jawaban Setelahnya →'}
              </button>
            </div>
          </div>
          ${q.penjelasan ? `<p style="margin-top:6px">${q.penjelasan}</p>` : ''}
        </div>`;
    }

    const scoringArea = document.getElementById('kuis-scoring-area');
    if (scoringArea) scoringArea.style.display = 'block';

    const showAnsBtn = document.getElementById('btn-kk-show-ans');
    if (showAnsBtn) showAnsBtn.style.display = 'none';
  },

  _renderScoreboard() {
    const sorted = [...this._kk.kelompok].sort((a, b) => (this._kk.scores[b] || 0) - (this._kk.scores[a] || 0));
    const medals = ['🥇', '🥈', '🥉'];
    return sorted.map((k, i) => `
      <div class="score-row-kuis ${i === 0 ? 'leader' : ''}">
        <span class="score-medal">${medals[i] || `${i + 1}.`}</span>
        <span class="score-name">${k}</span>
        <span class="score-poin">${this._kk.scores[k] || 0} poin</span>
      </div>`).join('');
  },

  selectAnswer(idx, correctIdx) {
    if (this._kk.answered) return;
    this._kk.answered = true;
    if (this._kk.revealTimer) {
      clearInterval(this._kk.revealTimer);
      this._kk.revealTimer = null;
    }

    const isCorrect = idx === correctIdx;
    const q = this._kk.questions[this._kk.currentIdx];

    const delayBox = document.getElementById('kk-delay-box');
    if (delayBox) {
      delayBox.innerHTML = `
        <div class="kk-options-ready-banner">
          ${isCorrect ? '✅ <strong>Jawaban Terpilih: BENAR!</strong>' : '❌ <strong>Jawaban Terpilih: SALAH!</strong>'}
        </div>`;
    }

    document.querySelectorAll('.kuis-option').forEach((btn, i) => {
      btn.disabled = true;
      if (i === correctIdx) btn.classList.add('correct');
      else if (i === idx && !isCorrect) btn.classList.add('wrong');
    });

    const reveal = document.getElementById('kuis-answer-reveal');
    reveal.style.display = 'block';
    reveal.innerHTML = `
      <div class="answer-reveal-inner ${isCorrect ? 'correct' : 'reveal-only'}">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap">
          <strong>${isCorrect ? '✅ Jawaban BENAR (+10 Poin)! Kunci:' : '❌ Jawaban kurang tepat (0 Poin). Kunci Jawaban:'} ${'ABCD'[correctIdx]}. ${q.pilihan[correctIdx]}</strong>
          <div style="display:flex;gap:8px">
            <button class="btn-secondary sm" onclick="Pos3View.prevKuisQ()" ${this._kk.currentIdx === 0 ? 'disabled' : ''}>← Jawaban Sebelumnya</button>
            <button class="btn-primary sm" onclick="Pos3View.nextKuisQ()">
              ${this._kk.currentIdx >= this._kk.questions.length - 1 ? '🏆 Hasil Akhir' : 'Jawaban Setelahnya →'}
            </button>
          </div>
        </div>
        ${q.penjelasan ? `<p style="margin-top:6px">${q.penjelasan}</p>` : ''}
      </div>`;

    if (isCorrect) App.showConfetti(30);

    document.getElementById('kuis-scoring-area').style.display = 'block';
    const showAnsBtn = document.getElementById('btn-kk-show-ans');
    if (showAnsBtn) showAnsBtn.style.display = 'none';

    App.showToast(isCorrect ? '✅ Jawaban BENAR!' : '❌ Jawaban Salah (0 Poin)', isCorrect ? 'success' : 'error');
  },

  addScore(kelompok, points) {
    this._kk.scores[kelompok] = (this._kk.scores[kelompok] || 0) + points;
    document.getElementById('kuis-scoring-area').innerHTML =
      `<div class="score-added">✅ +${points} poin ditambahkan untuk <strong>${kelompok}</strong>!</div>`;

    document.querySelector('.scoreboard-list').innerHTML = this._renderScoreboard();
    App.showConfetti(20);
    App.showToast(`+${points} poin untuk ${kelompok}!`, 'success');
  },

  noWinner() {
    document.getElementById('kuis-scoring-area').innerHTML =
      '<div class="score-added">⏭️ Jawaban salah — 0 poin diberikan pada soal ini.</div>';
  },

  nextKuisQ() {
    this._clearAllTimers();
    if (this._kk.currentIdx >= this._kk.questions.length - 1) {
      this._renderKuisResult();
      return;
    }
    this._kk.currentIdx++;
    this._kk.answered = false;
    this._renderKuisQuestion();
  },

  prevKuisQ() {
    this._clearAllTimers();
    if (this._kk.currentIdx > 0) {
      this._kk.currentIdx--;
      this._kk.answered = false;
      this._renderKuisQuestion();
    }
  },

  _renderKuisResult() {
    this._clearAllTimers();
    const area = document.getElementById('pos3-kuis-area');
    const sorted = [...this._kk.kelompok].sort((a, b) => (this._kk.scores[b] || 0) - (this._kk.scores[a] || 0));
    const medals = ['🥇', '🥈', '🥉'];
    const winner = sorted[0];

    App.showConfetti(100);

    area.innerHTML = `
      <div class="kuis-result-page">
        <div class="kuis-result-header">
          <div class="kuis-result-trophy">🏆</div>
          <h1>Kompetisi Kuis Kelompok Selesai!</h1>
          <p>Kelompok Terbaik: <strong>${winner}</strong> (${this._kk.scores[winner] || 0} Poin) 🎉</p>
        </div>
        <div class="kuis-final-scoreboard">
          <h3>📊 Papan Skor Akhir Kelompok</h3>
          ${sorted.map((k, i) => `
            <div class="final-score-row ${i === 0 ? 'winner' : ''}">
              <span class="final-medal">${medals[i] || `${i + 1}.`}</span>
              <span class="final-name">${k}</span>
              <div class="final-bar-wrap">
                <div class="final-bar" style="width:${this._kk.scores[sorted[0]] ? (this._kk.scores[k] / this._kk.scores[sorted[0]]) * 100 : 0}%"></div>
              </div>
              <span class="final-score">${this._kk.scores[k] || 0} poin</span>
            </div>`).join('')}
        </div>
        <div class="kuis-result-actions">
          <button class="btn-secondary" onclick="Pos3View.startKuisSetup()">🔄 Main Lagi</button>
          <button class="btn-primary" onclick="Pos3View.render()">🏠 Menu Utama Pos 3</button>
        </div>
      </div>`;

    const user = Auth.getCurrentUser();
    if (user?.role === 'murid') {
      const topScore = this._kk.scores[winner] || 0;
      DB.saveScore(user.id, 'pos3', { kuis: topScore });
      MuridView.awardBadge(user.id, 'pos3_done');
    }
  },

  // ══════════════════════════════════════════════════════════
  // 2. TANTANGAN AKHIR (INDIVIDU — PILIHAN GANDA & ESAI)
  // ══════════════════════════════════════════════════════════
  startTantangan() {
    this._clearAllTimers();
    document.getElementById('pos3-menu').style.display = 'none';
    const area = document.getElementById('pos3-tantangan-area');
    area.style.display = 'block';

    const questions = DB.getTantanganAkhir();
    const pgQ = questions.filter(q => (q.type || 'pg') === 'pg');
    const esaiQ = questions.filter(q => q.type === 'esai');
    // Order: PG questions first, followed by Essay questions
    const orderedQuestions = [...pgQ, ...esaiQ];

    this._ta = {
      questions: orderedQuestions,
      currentIdx: 0,
      score: 0,
      timer: null,
      timeLeft: DB.getSettings().timerTantangan || 30,
      answered: false,
      userAnswers: [],
      phase: 'start',
    };

    area.innerHTML = `
      <div class="tantangan-start">
        <div class="tantangan-start-header" style="text-align:center;margin-bottom:20px">
          <div style="font-size:4rem">⏱️</div>
          <h2>Tantangan Akhir — Kuis Individu</h2>
          <p>Asesmen Sumatif Pilihan Ganda & Esai dengan Penghitung Waktu Otomatis</p>
        </div>
        <div class="ta-rules">
          <div class="ta-rule-item"><span>🔘</span><span><strong>${pgQ.length} Soal Pilihan Ganda</strong> — Pilih jawaban paling tepat (A, B, C, atau D)</span></div>
          <div class="ta-rule-item"><span>✍️</span><span><strong>${esaiQ.length} Soal Esai / Uraian</strong> — Ketik analisis jawabanmu pada kotak esai yang tersedia</span></div>
          <div class="ta-rule-item"><span>⏱️</span><span><strong>Timer Otomatis</strong> — Soal berpindah otomatis saat waktu hitung mundur habis</span></div>
        </div>
        <div class="ta-start-actions">
          <button class="btn-secondary" onclick="Pos3View.render()">← Kembali</button>
          <button class="btn-primary lg" onclick="Pos3View._renderTantanganQ()">🚀 Mulai Asesmen Individu!</button>
        </div>
      </div>`;
  },

  _renderTantanganQ() {
    this._clearAllTimers();
    const area = document.getElementById('pos3-tantangan-area');
    const q = this._ta.questions[this._ta.currentIdx];
    const total = this._ta.questions.length;
    const progress = ((this._ta.currentIdx) / total) * 100;

    if (!q) { this._renderTantanganResult(); return; }

    const isEsai = q.type === 'esai';
    this._ta.timeLeft = q.waktu || (isEsai ? 90 : (DB.getSettings().timerTantangan || 30));
    this._ta.answered = false;

    area.innerHTML = `
      <div class="tantangan-game">
        <!-- Progress -->
        <div class="ta-progress-bar-wrap">
          <div class="ta-progress-fill" style="width:${progress}%"></div>
        </div>

        <!-- Header -->
        <div class="ta-game-header">
          <div style="display:flex;align-items:center;gap:10px">
            <span class="ta-soal-info">Soal ${this._ta.currentIdx + 1} dari ${total}</span>
            <span class="q-babak ${isEsai ? 'badge-penentuan' : 'badge-utama'}">
              ${isEsai ? '✍️ SOAL ESAI' : '🔘 PILIHAN GANDA'}
            </span>
          </div>
          <div class="ta-score-display">⭐ Skor Sementara: <strong>${this._ta.score}</strong></div>
          <div class="ta-timer-wrap">
            <span class="ta-timer" id="ta-timer">${this._ta.timeLeft}s</span>
          </div>
        </div>

        <!-- Timer Ring -->
        <div class="ta-timer-ring-wrap">
          <svg class="ta-timer-ring" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" class="ta-ring-bg"/>
            <circle cx="60" cy="60" r="54" class="ta-ring-progress" id="ta-ring"
              stroke-dasharray="${2 * Math.PI * 54}" stroke-dashoffset="0"/>
          </svg>
          <div class="ta-timer-center" id="ta-timer-center">${this._ta.timeLeft}</div>
        </div>

        <!-- Question Card (PG or Esai) -->
        <div class="ta-question-card">
          <div class="ta-q-text">${q.pertanyaan}</div>

          ${isEsai ? `
            <div class="ta-esai-box">
              <label class="form-label">✍️ Tuliskan Jawaban Esai Kamu:</label>
              <textarea class="form-input ta-esai-textarea" id="ta-esai-input" rows="5"
                placeholder="Ketik jawaban uraianmu secara jelas dan lengkap di sini..."></textarea>
              <div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px">
                <small class="form-hint">💡 Jawaban yang sudah diketik akan otomatis tersimpan jika waktu habis.</small>
                <button class="btn-primary lg" id="btn-submit-esai" onclick="Pos3View.submitEsaiAnswer()">
                  ✅ Simpan & Lanjut Soal Berikutnya
                </button>
              </div>
            </div>
          ` : `
            <div class="ta-options-grid">
              ${(q.pilihan || []).map((p, i) => `
                <button class="ta-option" id="ta-opt-${i}" onclick="Pos3View.answerTantangan(${i}, ${q.jawaban})">
                  <span class="ta-opt-letter">${'ABCD'[i]}</span>
                  <span>${p}</span>
                </button>`).join('')}
            </div>
          `}
        </div>

        <!-- Footer -->
        <div class="ta-game-footer">
          <button class="btn-secondary sm" onclick="Pos3View._skipTantanganQ()">⏩ Lewati Soal</button>
          <span class="ta-progress-text">Progres: ${this._ta.currentIdx + 1} / ${total}</span>
        </div>
      </div>`;

    this._startTimer(q);
  },

  _startTimer(q) {
    const circumference = 2 * Math.PI * 54;
    const isEsai = q.type === 'esai';
    const totalTime = q.waktu || (isEsai ? 90 : (DB.getSettings().timerTantangan || 30));

    this._ta.timer = setInterval(() => {
      this._ta.timeLeft--;

      const timerEl = document.getElementById('ta-timer');
      const timerCenter = document.getElementById('ta-timer-center');
      const ring = document.getElementById('ta-ring');

      if (timerEl) timerEl.textContent = this._ta.timeLeft + 's';
      if (timerCenter) timerCenter.textContent = this._ta.timeLeft;

      if (ring) {
        const offset = circumference * (1 - this._ta.timeLeft / totalTime);
        ring.style.strokeDashoffset = offset;
        ring.style.stroke = this._ta.timeLeft <= 5 ? '#E53935' : this._ta.timeLeft <= 10 ? '#F9A825' : '#43A047';
      }

      if (timerCenter) {
        timerCenter.className = 'ta-timer-center' + (this._ta.timeLeft <= 5 ? ' urgent' : '');
      }

      if (this._ta.timeLeft <= 5 && this._ta.timeLeft > 0) {
        if (typeof SoundManager !== 'undefined') SoundManager.playSFX('tick');
      }

      if (this._ta.timeLeft <= 0) {
        clearInterval(this._ta.timer);
        if (!this._ta.answered) {
          if (isEsai) {
            // Auto-submit whatever essay text the student has written
            this.submitEsaiAnswer(true);
          } else {
            this._ta.userAnswers.push({ qId: q.id, type: 'pg', selected: -1, correct: q.jawaban, isCorrect: false });
            App.showToast('⏰ Waktu habis! Berpindah ke soal berikutnya.', 'warning');
            setTimeout(() => this._autoNextTantangan(), 600);
          }
        }
      }
    }, 1000);
  },

  answerTantangan(selectedIdx, correctIdx) {
    if (this._ta.answered) return;
    this._ta.answered = true;
    clearInterval(this._ta.timer);

    const isCorrect = selectedIdx === correctIdx;
    const q = this._ta.questions[this._ta.currentIdx];

    this._ta.userAnswers.push({
      qId: q.id,
      type: 'pg',
      selected: selectedIdx,
      correct: correctIdx,
      isCorrect
    });

    document.querySelectorAll('.ta-option').forEach((btn, i) => {
      btn.disabled = true;
      if (i === correctIdx) btn.classList.add('correct');
      else if (i === selectedIdx && !isCorrect) btn.classList.add('wrong');
    });

    if (isCorrect) {
      this._ta.score += 10;
      App.showConfetti(25);
      App.showToast('✅ Jawaban Pilihan Ganda Benar! +10 poin', 'success');
    } else {
      App.showToast(`❌ Kurang tepat! Kunci: ${q.pilihan[correctIdx]}`, 'error');
    }

    const scoreEl = document.querySelector('.ta-score-display');
    if (scoreEl) scoreEl.innerHTML = `⭐ Skor Sementara: <strong>${this._ta.score}</strong>`;

    setTimeout(() => this._autoNextTantangan(), 1500);
  },

  submitEsaiAnswer(autoFromTimer = false) {
    if (this._ta.answered) return;
    this._ta.answered = true;
    clearInterval(this._ta.timer);

    const q = this._ta.questions[this._ta.currentIdx];
    const inp = document.getElementById('ta-esai-input');
    const text = inp ? inp.value.trim() : '';

    if (inp) inp.disabled = true;
    const btn = document.getElementById('btn-submit-esai');
    if (btn) btn.disabled = true;

    // Evaluate essay response based on length & keyword matches
    let isCorrect = false;
    if (text.length >= 15) {
      const lower = text.toLowerCase();
      const keywords = q.kataKunci || [];
      const matched = keywords.filter(k => lower.includes(k.toLowerCase()));
      isCorrect = keywords.length === 0 ? text.length >= 20 : (matched.length >= 1 || text.length >= 35);
    }

    if (isCorrect) {
      this._ta.score += 10;
    }

    this._ta.userAnswers.push({
      qId: q.id,
      type: 'esai',
      essayText: text || '(Tidak dijawab)',
      kunciEsai: q.kunciEsai || '',
      isCorrect
    });

    if (autoFromTimer) {
      App.showToast('⏰ Waktu habis! Jawaban esai disimpan otomatis.', 'info');
    } else {
      App.showToast('✍️ Jawaban esai berhasil disimpan!', 'success');
    }

    setTimeout(() => this._autoNextTantangan(), 900);
  },

  _skipTantanganQ() {
    if (this._ta.answered) return;
    clearInterval(this._ta.timer);
    const q = this._ta.questions[this._ta.currentIdx];
    if (q.type === 'esai') {
      this._ta.userAnswers.push({ qId: q.id, type: 'esai', essayText: '(Dilewati)', kunciEsai: q.kunciEsai || '', isCorrect: false });
    } else {
      this._ta.userAnswers.push({ qId: q.id, type: 'pg', selected: -1, correct: q.jawaban, isCorrect: false });
    }
    this._autoNextTantangan();
  },

  _autoNextTantangan() {
    if (this._ta.currentIdx >= this._ta.questions.length - 1) {
      this._renderTantanganResult();
    } else {
      this._ta.currentIdx++;
      this._renderTantanganQ();
    }
  },

  _renderTantanganResult() {
    this._clearAllTimers();
    const area = document.getElementById('pos3-tantangan-area');
    const total = this._ta.questions.length;
    const correct = this._ta.userAnswers.filter(a => a.isCorrect).length;
    const pct = total ? Math.round((correct / total) * 100) : 0;
    const maxScore = total * 10;

    const grade = pct >= 90 ? { label: 'Luar Biasa!', emoji: '🌟', color: '#43A047' }
                : pct >= 75 ? { label: 'Bagus Sekali!', emoji: '🎉', color: '#1565C0' }
                : pct >= 60 ? { label: 'Cukup Baik', emoji: '👍', color: '#F9A825' }
                : { label: 'Terus Berlatih!', emoji: '💪', color: '#E53935' };

    App.showConfetti(pct >= 75 ? 80 : 30);

    area.innerHTML = `
      <div class="tantangan-result">
        <div class="ta-result-header" style="background:linear-gradient(135deg,${grade.color},${grade.color}cc)">
          <div class="ta-result-grade-emoji">${grade.emoji}</div>
          <h2>${grade.label}</h2>
          <p>Asesmen Individu (Pilihan Ganda & Esai) Selesai!</p>
        </div>

        <div class="ta-result-stats">
          <div class="ta-result-stat">
            <div class="ta-result-val" style="color:${grade.color}">${pct}%</div>
            <div class="ta-result-label">Nilai Akhir</div>
          </div>
          <div class="ta-result-stat">
            <div class="ta-result-val">${correct}/${total}</div>
            <div class="ta-result-label">Soal Terjawab Tepat</div>
          </div>
          <div class="ta-result-stat">
            <div class="ta-result-val">${this._ta.score}/${maxScore}</div>
            <div class="ta-result-label">Total Poin</div>
          </div>
        </div>

        <!-- Detail Soal Pilihan Ganda & Esai -->
        <div class="ta-result-detail">
          <h3>📋 Rincian Jawaban Pilihan Ganda & Esai</h3>
          <div class="ta-answers-grid">
            ${this._ta.userAnswers.map((a, i) => {
              const q = this._ta.questions.find(x => x.id === a.qId);
              if (a.type === 'esai') {
                return `
                  <div class="ta-answer-row ${a.isCorrect ? 'correct' : 'wrong'}" style="flex-direction:column;align-items:flex-start;gap:6px">
                    <div style="display:flex;justify-content:space-between;width:100%">
                      <strong>Soal ${i + 1} (Esai): ${q?.pertanyaan || ''}</strong>
                      <span>${a.isCorrect ? '✅ Terjawab Baik (+10)' : '📝 Perlu Dilengkapi'}</span>
                    </div>
                    <div style="font-size:0.88rem;background:rgba(255,255,255,0.7);padding:8px 12px;border-radius:8px;width:100%">
                      <strong>Jawabanmu:</strong> ${a.essayText}
                    </div>
                    <div style="font-size:0.84rem;color:#1B5E20">
                      <strong>Referensi Kunci:</strong> ${a.kunciEsai || '-'}
                    </div>
                  </div>`;
              }
              return `
                <div class="ta-answer-row ${a.isCorrect ? 'correct' : 'wrong'}">
                  <span class="ta-ans-num">${i + 1}</span>
                  <div class="ta-ans-q"><strong>(PG)</strong> ${q?.pertanyaan || ''}</div>
                  <div class="ta-ans-result">
                    ${a.isCorrect ? '✅ Benar (+10)' : `❌ Kunci: ${q?.pilihan?.[a.correct] || '-'}`}
                  </div>
                </div>`;
            }).join('')}
          </div>
        </div>

        <div class="ta-result-actions">
          <button class="btn-secondary" onclick="Pos3View.startTantangan()">🔄 Kerjakan Ulang</button>
          <button class="btn-primary lg" onclick="App.navigate('pos4')">Lanjut ke Pos 4 (Jejak Tumbuhku) →</button>
        </div>
      </div>`;

    const user = Auth.getCurrentUser();
    if (user?.role === 'murid') {
      const existing = DB.getScoreByUser(user.id);
      DB.saveScore(user.id, 'pos3', {
        ...existing.pos3,
        tantangan: pct,
        tantanganPoin: this._ta.score,
        essayAnswers: this._ta.userAnswers.filter(a => a.type === 'esai')
      });
      MuridView.addPoin(user.id, this._ta.score);
      MuridView.awardBadge(user.id, 'pos3_done');
    }
  },
};
