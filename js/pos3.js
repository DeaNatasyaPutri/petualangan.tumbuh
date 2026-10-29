// ============================================================
// POS3.JS — Pos 3: Kuis Kejutan (Kelompok - Real-Time Terpusat
//           per ID Kelompok, Timer 15 Detik, Navigasi Sebelumnya/Setelahnya,
//           & Feedback Poin Otomatis) + Tantangan Akhir (Individu PG & Esai)
// ============================================================

const Pos3View = {
  _mode: 'menu', // 'menu' | 'kelompok' | 'tantangan'
  _syncBound: false,

  // Local 15s timer for Kuis Kelompok
  _kkTimer: null,
  _kkTimeLeft: 15,
  _guruSelectedGroupId: null, // For Guru monitoring or presenting

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

  _ensureSyncSubscribed() {
    if (this._syncBound || typeof RealtimeSync === 'undefined') return;
    this._syncBound = true;

    RealtimeSync.subscribe((msg) => {
      const viewEl = document.getElementById('view-pos3');
      if (!viewEl || !viewEl.classList.contains('active')) return;
      if (this._mode !== 'kelompok') return;

      const user = Auth.getCurrentUser();
      if (!user) return;

      const myGroup = user.role === 'murid'
        ? Auth.getCurrentGroup()
        : DB.getGroupById(this._guruSelectedGroupId || DB.getGroups()[0]?.id);

      const { groupId, qIdx, optionIdx, essayText, userName, answerRecord, totalScore } = msg.payload || {};

      // 1. Live Option Selection by a Group Member
      if (msg.event === 'POS3_OPTION_SELECTED') {
        if (myGroup && myGroup.id === groupId) {
          this._updateLiveGroupOptionUI(qIdx, optionIdx, userName);
        }
        if (user.role !== 'murid') {
          this._refreshGuruLiveScoreboard();
        }
        return;
      }

      // 1b. Live Essay Typing by a Group Member
      if (msg.event === 'POS3_ESSAY_TYPING') {
        if (myGroup && myGroup.id === groupId) {
          this._updateLiveGroupEssayUI(qIdx, essayText, userName);
        }
        if (user.role !== 'murid') {
          this._refreshGuruLiveScoreboard();
        }
        return;
      }

      // 2. Group Answer Locked & Submitted -> Show Automatic Point Feedback Pop-up!
      if (msg.event === 'POS3_ANSWER_SUBMITTED') {
        if (myGroup && myGroup.id === groupId) {
          this._clearAllTimers();
          this._renderGroupKuisQuestion(myGroup, false);

          const questions = DB.getKuisKejutan();
          const q = questions[qIdx];
          if (q && answerRecord) {
            const detailText = q.type === 'esai'
              ? `Kunci Jawaban Esai: ${q.kunciEsai || q.penjelasan || '-'}`
              : `Kunci Jawaban: ${'ABCD'[q.jawaban]}. ${q.pilihan[q.jawaban]}${q.penjelasan && !q.penjelasan.startsWith('Kunci Jawaban:') ? ' — ' + q.penjelasan : ''}`;
            App.showPointFeedback({
              groupName: `${myGroup.emoji || '👥'} ${myGroup.name}`,
              pointsEarned: answerRecord.points || 0,
              totalScore: totalScore || 0,
              isCorrect: !!answerRecord.isCorrect,
              title: answerRecord.isCorrect ? 'Jawaban Kelompok BENAR!' : 'Jawaban Kelompok Belum Tepat',
              subtitle: `Soal #${qIdx + 1} • Dikirim oleh ${answerRecord.submittedBy || 'Anggota Kelompok'}`,
              detail: detailText
            });
          }
        }
        if (user.role !== 'murid') {
          this._refreshGuruLiveScoreboard();
        }
        return;
      }

      // 3. Group Navigated to Previous / Next Question
      if (msg.event === 'POS3_QUESTION_CHANGED' || msg.event === 'POS3_RESET') {
        if (myGroup && myGroup.id === groupId) {
          this._clearAllTimers();
          this._renderGroupKuisQuestion(myGroup, true);
        }
        if (user.role !== 'murid') {
          this._refreshGuruLiveScoreboard();
        }
        return;
      }
    });
  },

  render() {
    this._ensureSyncSubscribed();
    this._clearAllTimers();
    this._mode = 'menu';

    const user = Auth.getCurrentUser();
    const backTarget = (user?.role === 'guru' || user?.role === 'admin') ? 'dashboard' : 'murid';
    const kkList = DB.getKuisKejutan();
    const taList = DB.getTantanganAkhir();
    const pgCount = taList.filter(q => (q.type || 'pg') === 'pg').length;
    const esaiCount = taList.filter(q => q.type === 'esai').length;
    const myGroup = user?.role === 'murid' ? Auth.getCurrentGroup() : null;
    const myGroupPos3 = myGroup ? DB.getPos3ForGroup(myGroup.id) : null;

    const el = document.getElementById('view-pos3');
    el.innerHTML = `
      <div class="pos-layout">
        <!-- Header -->
        <div class="pos-header" style="background:linear-gradient(135deg,#F9A825,#E65100)">
          <button class="pos-back-btn" onclick="Pos3View._clearAllTimers(); App.navigate('${backTarget}')">← Kembali</button>
          <div class="pos-header-content">
            <div class="pos-header-num">POS 3</div>
            <h1 class="pos-header-title">🏆 Kuis Kejutan & Tantangan Akhir</h1>
            <p class="pos-header-desc">Evaluasi pemahamanmu melalui Kuis Kompetisi Kelompok Real-Time dan Asesmen Individu (Pilihan Ganda & Esai)!</p>
          </div>
          ${myGroup ? `
            <div class="mini-group-scoreboard">
              <div class="mgs-top">
                <span class="mgs-emoji">${myGroup.emoji || '👥'}</span>
                <div>
                  <div class="mgs-name">${myGroup.name}</div>
                  <div class="mgs-sub">🟢 Terhubung ke Kelompok</div>
                </div>
              </div>
              <div class="mgs-points">⭐ <strong>${myGroupPos3?.totalScore || 0}</strong> Poin Kuis</div>
            </div>
          ` : ''}
          ${(Auth.isGuru() || Auth.isAdmin()) ? `
            <button class="pos-back-btn" onclick="Pos3View._clearAllTimers(); App.navigate('guru',{tab:'kuis'})">✏️ Kelola Soal PG & Esai</button>
          ` : ''}
        </div>

        <!-- Menu Pilihan -->
        <div class="pos-content pos3-menu-content" id="pos3-menu">
          <h2 class="pos3-menu-title">Pilih Mode Evaluasi Pembelajaran</h2>
          <div class="pos3-cards">
            <!-- Kuis Kejutan (Kelompok Real-Time) -->
            <div class="pos3-mode-card kuis">
              <div class="pos3-mode-header">
                <span class="pos3-mode-emoji">⚡</span>
                <div class="pos3-mode-badge">Kompetisi Kelompok (Real-Time Sync)</div>
              </div>
              <h2>Kuis Kejutan (Kelompok)</h2>
              <p>Akses terpusat khusus kelompokmu! Pilihan jawaban disinkronkan secara langsung antar anggota kelompok dengan hitung mundur 15 detik.</p>
              <ul class="pos3-mode-features">
                <li>👥 ${myGroup ? `Ruang Khusus: <strong>${myGroup.emoji || ''} ${myGroup.name}</strong>` : 'Tampilan terisolasi & tersinkronisasi per kelompok'}</li>
                <li>⚡ ${kkList.length} soal kompetisi (6 Babak Utama & 4 Penentuan)</li>
                <li>⏱️ Soal & pilihan jawaban tampil bersama timer 15 detik</li>
                <li>🏅 Pop-up feedback poin otomatis (+10 benar, 0 salah)</li>
              </ul>
              <button class="btn-pos3-kuis" onclick="Pos3View.openKuisKelompok()">⚡ Masuk Ruang Kuis Kelompok!</button>
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
    if (this._kkTimer) {
      clearInterval(this._kkTimer);
      this._kkTimer = null;
    }
    if (this._ta.timer) {
      clearInterval(this._ta.timer);
      this._ta.timer = null;
    }
  },

  // ══════════════════════════════════════════════════════════
  // 1. KUIS KEJUTAN (KELOMPOK - TERISOLASI PER ID KELOMPOK & REAL-TIME)
  // ══════════════════════════════════════════════════════════
  openKuisKelompok() {
    this._clearAllTimers();
    this._mode = 'kelompok';
    document.getElementById('pos3-menu').style.display = 'none';
    const area = document.getElementById('pos3-kuis-area');
    area.style.display = 'block';

    const user = Auth.getCurrentUser();
    if (!user) return;

    if (user.role === 'murid') {
      const myGroup = Auth.getCurrentGroup();
      if (!myGroup) {
        area.innerHTML = `
          <div class="pos-content">
            <div class="pos2-waiting-card">
              <div class="waiting-pulse-icon">👥</div>
              <h2>Akunmu Belum Masuk ke Kelompok Belajar</h2>
              <p>Mintalah Bapak/Ibu Guru untuk memasukkan akunmu (<strong>${user.name}</strong>) ke dalam kelompok melalui menu <strong>Manajemen Kelompok</strong> di Dasbor Guru.</p>
              <button class="btn-secondary" style="margin-top:14px" onclick="Pos3View.render()">← Kembali ke Menu Pos 3</button>
            </div>
          </div>
        `;
        return;
      }
      this._renderGroupKuisQuestion(myGroup, true);
    } else {
      // Guru / Admin View: Live All-Group Scoreboard + Group Selector to Monitor/Control
      const groups = DB.getGroups();
      if (!this._guruSelectedGroupId && groups.length > 0) {
        this._guruSelectedGroupId = groups[0].id;
      }
      const selectedGroup = DB.getGroupById(this._guruSelectedGroupId) || groups[0];
      this._renderGroupKuisQuestion(selectedGroup, true);
    }
  },

  selectGuruMonitorGroup(groupId) {
    this._guruSelectedGroupId = groupId;
    const grp = DB.getGroupById(groupId);
    if (grp) {
      this._clearAllTimers();
      this._renderGroupKuisQuestion(grp, true);
    }
  },

  _refreshGuruLiveScoreboard() {
    const sbEl = document.getElementById('kk-live-scoreboard-list');
    if (sbEl) {
      sbEl.innerHTML = this._buildGroupScoreboardHTML();
    }
  },

  _syncInPlaceFromStorage() {
    if (this._mode !== 'kelompok') return;
    const user = Auth.getCurrentUser();
    if (!user) return;
    const myGroup = user.role === 'murid'
      ? Auth.getCurrentGroup()
      : DB.getGroupById(this._guruSelectedGroupId || DB.getGroups()[0]?.id);
    if (!myGroup) return;
    const gState = DB.getPos3ForGroup(myGroup.id);
    const qIdx = gState.currentIdx || 0;
    const pick = gState.selectedOptions?.[qIdx];
    if (pick && pick.optionIdx !== undefined) {
      this._updateLiveGroupOptionUI(qIdx, pick.optionIdx, pick.selectedBy || 'Anggota');
    }
    const draft = gState.essayDrafts?.[qIdx];
    if (draft && draft.text !== undefined) {
      this._updateLiveGroupEssayUI(qIdx, draft.text, draft.typedBy || 'Anggota');
    }
    this._refreshGuruLiveScoreboard();
  },

  _buildGroupScoreboardHTML() {
    const user = Auth.getCurrentUser();
    const isGuru = user?.role === 'guru' || user?.role === 'admin';
    const myGroup = user?.role === 'murid' ? Auth.getCurrentGroup() : null;

    // For Murid: Isolate view to their own group scoreboard & stats (or show their group card prominently)
    if (!isGuru && myGroup) {
      const gState = DB.getPos3ForGroup(myGroup.id);
      const totalQ = DB.getKuisKejutan().length;
      const answeredCount = Object.keys(gState.answers || {}).length;
      const correctCount = Object.values(gState.answers || {}).filter(a => a.isCorrect).length;
      const members = DB.getUsers().filter(u => (myGroup.memberIds || []).includes(u.id));

      return `
        <div class="isolated-group-scorecard" style="border-left: 5px solid #FB8C00">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
            <span style="font-size:2rem">${myGroup.emoji || '👥'}</span>
            <div>
              <strong style="font-size:1.05rem;display:block">${myGroup.name}</strong>
              <small style="color:var(--text-muted)">🟢 Jawaban Disinkronkan Bersama</small>
            </div>
          </div>
          <div class="isolated-score-big">
            <span>Total Skor Kelompok</span>
            <strong id="isolated-group-total-score">${gState.totalScore || 0} Poin</strong>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:0.82rem;font-weight:800;color:var(--text-muted);margin:10px 0">
            <span>Terjawab: ${answeredCount}/${totalQ}</span>
            <span style="color:#2E7D32">Benar: ${correctCount} Soal</span>
          </div>
          <div style="border-top:1px solid #ECEFF1;padding-top:10px;margin-top:6px">
            <small style="font-weight:800;color:var(--text-muted);display:block;margin-bottom:6px">👦👧 Anggota Kelompok Aktif:</small>
            <div style="display:flex;flex-direction:column;gap:5px">
              ${members.map(m => `
                <div style="display:flex;align-items:center;gap:6px;font-size:0.84rem;font-weight:700">
                  <span>${m.avatar || '👦'}</span>
                  <span>${m.name} ${m.id === user.id ? '<strong style="color:#1565C0">(Kamu)</strong>' : ''}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    }

    // For Guru / Admin: Show all groups live scoreboard & switcher
    const groups = DB.getGroups();
    const sorted = [...groups].sort((a, b) => {
      const sa = DB.getPos3ForGroup(a.id).totalScore || 0;
      const sb = DB.getPos3ForGroup(b.id).totalScore || 0;
      return sb - sa;
    });
    const medals = ['🥇', '🥈', '🥉'];

    return sorted.map((g, i) => {
      const gs = DB.getPos3ForGroup(g.id);
      const isSelected = this._guruSelectedGroupId === g.id;
      return `
        <div class="score-row-kuis ${i === 0 ? 'leader' : ''}"
          style="cursor:pointer;${isSelected ? 'outline:2px solid #1565C0;background:#E3F2FD' : ''}"
          onclick="Pos3View.selectGuruMonitorGroup('${g.id}')">
          <span class="score-medal">${medals[i] || `${i + 1}.`}</span>
          <span class="score-name">${g.emoji || '👥'} ${g.name}</span>
          <span class="score-poin">${gs.totalScore || 0} poin</span>
        </div>
      `;
    }).join('');
  },

  _renderGroupKuisQuestion(groupObj, startTimerIfUnanswered = true) {
    this._clearAllTimers();
    const area = document.getElementById('pos3-kuis-area');
    if (!area || !groupObj) return;

    const user = Auth.getCurrentUser();
    const isGuru = user?.role === 'guru' || user?.role === 'admin';
    const questions = DB.getKuisKejutan();
    const gState = DB.getPos3ForGroup(groupObj.id);
    const currentIdx = Math.max(0, Math.min(gState.currentIdx || 0, questions.length - 1));
    const q = questions[currentIdx];

    if (!q) {
      this._renderGroupKuisFinalResult(groupObj);
      return;
    }

    const isLast = currentIdx >= questions.length - 1;
    const isPenentuan = q.babak === 'penentuan';
    const isEsai = q.type === 'esai';
    const submittedAnswer = gState.answers?.[currentIdx] || null;
    const livePick = gState.selectedOptions?.[currentIdx] || null;
    const liveEssay = gState.essayDrafts?.[currentIdx] || null;
    const isAnswered = !!submittedAnswer;

    this._kkTimeLeft = 15;
    const circumference = 2 * Math.PI * 44;

    area.innerHTML = `
      <div class="kuis-game-layout">
        <!-- Left Sidebar: Papan Skor Mini Kelompok (Isolated for Murid, All-Group for Guru) -->
        <div class="kuis-scoreboard">
          <div class="scoreboard-header">
            <span>🏆 ${isGuru ? 'Pantauan Skor Kelompok' : 'Papan Skor Kelompokmu'}</span>
            <span class="soal-counter">Soal ${currentIdx + 1}/${questions.length}</span>
          </div>
          <div class="scoreboard-list" id="kk-live-scoreboard-list">
            ${this._buildGroupScoreboardHTML()}
          </div>
          ${isPenentuan
            ? '<div class="babak-badge penentuan">🔴 BABAK PENENTUAN (ESAI)!</div>'
            : '<div class="babak-badge utama">🔵 BABAK UTAMA (PILIHAN GANDA)</div>'}
          <div style="margin-top:14px;display:flex;flex-direction:column;gap:8px">
            <button class="btn-secondary sm" onclick="Pos3View._renderGroupKuisFinalResult(DB.getGroupById('${groupObj.id}'))">📊 Lihat Rekap Skor</button>
            ${isGuru ? `<button class="btn-danger sm" onclick="Pos3View.resetGroupQuizConfirm('${groupObj.id}')">🔄 Reset Kuis ${groupObj.name}</button>` : ''}
            <button class="btn-secondary sm" onclick="Pos3View.render()">← Menu Pos 3</button>
          </div>
        </div>

        <!-- Right Main Area: Question, Synchronized Options / Essay, 15s Timer, & Lock Button -->
        <div class="kuis-question-area">
          ${!isAnswered ? `
            <!-- 15-Second Visual Countdown Box (Positioned at Top of Screen) -->
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
                <p>Diskusikan bersama anggota <strong>${groupObj.name}</strong>! Waktu tersisa <strong id="kk-delay-text">15</strong> detik sebelum jawaban dikunci otomatis...</p>
                <div class="kk-delay-bar-track">
                  <div class="kk-delay-bar-fill" id="kk-delay-bar" style="width:100%"></div>
                </div>
              </div>
            </div>
          ` : ''}

          <!-- Top Group Sync Banner -->
          <div class="group-sync-live-bar" style="border-left:5px solid #FB8C00">
            <div>
              <strong>${groupObj.emoji || '👥'} Ruang Kuis Terpusat: ${groupObj.name}</strong>
              <span style="font-size:0.84rem;color:var(--text-muted);display:block">
                Setiap jawaban yang dipilih atau diketik anggota kelompok langsung tersinkronisasi di layar seluruh anggota ${groupObj.name}.
              </span>
            </div>
            <span class="badge-done">🟢 Real-Time Aktif</span>
          </div>

          <div class="kuis-q-header ${isPenentuan ? 'penentuan' : 'utama'}">
            <div class="kuis-q-num">Soal ${currentIdx + 1} dari ${questions.length}</div>
            <div class="kuis-q-type">${isEsai ? '✍️ Babak Penentuan — Esai (Soal 7–10)' : '🔘 Babak Utama — Pilihan Ganda (Soal 1–6)'}</div>
          </div>

          <div class="kuis-q-text" style="white-space:pre-line">${q.pertanyaan}</div>

          ${isEsai ? `
            <!-- Synchronized Group Essay Answer Box (For Questions 7-10) -->
            <div class="ta-esai-box" id="kk-essay-box" style="margin-bottom:16px">
              <label class="form-label">✍️ Jawaban Esai Kelompok (${groupObj.name}):</label>
              <textarea class="form-input ta-esai-textarea" id="kk-essay-input" rows="4"
                ${isAnswered ? 'disabled' : ''}
                placeholder="Ketik hasil diskusi jawaban esai kelompokmu di sini..."
                oninput="Pos3View.onInputGroupEssay('${groupObj.id}', ${currentIdx}, this.value)">${isAnswered ? (submittedAnswer.essayText || '') : (liveEssay?.text || '')}</textarea>
            </div>
          ` : `
            <!-- Options Grid (Displayed immediately with Question during 15s Timer, Synced Across Group) -->
            <div class="kuis-options-grid" id="kk-options-grid">
              ${(q.pilihan || []).map((p, i) => {
                let btnClass = 'kuis-option';
                if (isAnswered) {
                  if (i === q.jawaban) btnClass += ' correct';
                  else if (submittedAnswer.selected === i && !submittedAnswer.isCorrect) btnClass += ' wrong';
                } else if (livePick && livePick.optionIdx === i) {
                  btnClass += ' group-selected';
                }
                return `
                  <button class="${btnClass}" id="kuis-opt-${i}"
                    ${isAnswered ? 'disabled' : ''}
                    onclick="Pos3View.onClickGroupOption('${groupObj.id}', ${currentIdx}, ${i})">
                    <span class="kuis-opt-letter">${'ABCD'[i]}</span>
                    <span class="kuis-opt-text">${p}</span>
                    <span class="kuis-opt-sync-tag" id="kuis-opt-tag-${i}">
                      ${!isAnswered && livePick && livePick.optionIdx === i
                        ? `👥 Dipilih oleh ${livePick.selectedBy}`
                        : (isAnswered && submittedAnswer.selected === i ? `🔒 Jawaban Kelompok` : '')}
                    </span>
                  </button>
                `;
              }).join('')}
            </div>
          `}

          <!-- Live Group Selection & Lock Action Bar (When not yet submitted) -->
          ${!isAnswered ? `
            <div class="group-lock-answer-bar" id="group-lock-bar">
              <div id="group-live-pick-status">
                ${isEsai
                  ? (liveEssay && liveEssay.text
                      ? `✍️ Jawaban esai <strong>${groupObj.name}</strong> sedang diketik oleh <strong>${liveEssay.typedBy}</strong>`
                      : `💡 Ketik jawaban esai hasil diskusi kelompokmu sebelum waktu habis!`)
                  : (livePick && livePick.optionIdx !== undefined
                      ? `👥 Pilihan <strong>${groupObj.name}</strong> saat ini: <strong style="color:#1565C0">Pilihan ${'ABCD'[livePick.optionIdx]}</strong> (dipilih oleh <strong>${livePick.selectedBy}</strong>)`
                      : `💡 Klik salah satu opsi (A, B, C, atau D) untuk berdiskusi dan menyamakan pilihan kelompokmu!`)}
              </div>
              <button class="btn-primary lg" id="btn-lock-group-ans"
                onclick="Pos3View.submitGroupAnswerNow('${groupObj.id}', ${currentIdx})">
                🔒 Kunci & Kirim Jawaban Kelompok
              </button>
            </div>
          ` : `
            <!-- Answer Reveal Box (Shown after Group Submits or 15s Timer Ends) -->
            <div id="kuis-answer-reveal" class="kuis-answer-reveal" style="display:block">
              <div class="answer-reveal-inner ${submittedAnswer.isCorrect ? 'correct' : 'reveal-only'}">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap">
                  <div>
                    <div style="font-size:0.84rem;font-weight:800;margin-bottom:4px">
                      ${submittedAnswer.isCorrect
                        ? `🎉 JAWABAN ${groupObj.name.toUpperCase()} BENAR! (+${submittedAnswer.points} Poin) • Dikirim oleh ${submittedAnswer.submittedBy}`
                        : `❌ JAWABAN ${groupObj.name.toUpperCase()} BELUM TEPAT (0 Poin) • Dikirim oleh ${submittedAnswer.submittedBy}`}
                    </div>
                    ${isEsai
                      ? `<strong>✅ Kunci Jawaban Esai: ${q.kunciEsai || q.penjelasan || '-'}</strong>`
                      : `<strong>✅ Kunci Jawaban: ${'ABCD'[q.jawaban]}. ${q.pilihan[q.jawaban]}</strong>`}
                  </div>
                  <div style="display:flex;gap:8px">
                    <button class="btn-secondary sm" onclick="Pos3View.prevKuisQ('${groupObj.id}')" ${currentIdx === 0 ? 'disabled' : ''}>← Jawaban Sebelumnya</button>
                    <button class="btn-primary sm" onclick="Pos3View.nextKuisQ('${groupObj.id}')">
                      ${isLast ? '🏆 Lihat Hasil Akhir →' : 'Jawaban Setelahnya →'}
                    </button>
                  </div>
                </div>
                ${!isEsai && q.penjelasan && !q.penjelasan.startsWith('Kunci Jawaban:') ? `<p style="margin-top:8px">${q.penjelasan}</p>` : ''}
              </div>
            </div>
          `}

          <!-- Bottom Navigation Buttons: Previous & Next Question/Answer -->
          <div class="kuis-nav-area">
            <button class="btn-secondary" onclick="Pos3View.prevKuisQ('${groupObj.id}')" ${currentIdx === 0 ? 'disabled' : ''}>
              ← Sebelumnya
            </button>
            <div style="display:flex;gap:10px;align-items:center">
              ${!isAnswered ? `
                <button class="btn-secondary sm" onclick="Pos3View.submitGroupAnswerNow('${groupObj.id}', ${currentIdx})">
                  💡 Kunci & Tampilkan Kunci Jawaban
                </button>
              ` : ''}
              <button class="btn-primary" onclick="Pos3View.nextKuisQ('${groupObj.id}')">
                ${isLast ? '🏆 Lihat Hasil Akhir Kelompok →' : 'Selanjutnya →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    if (!isAnswered && startTimerIfUnanswered) {
      this._startGroup15SecCountdown(groupObj.id, currentIdx);
    }
  },

  onClickGroupOption(groupId, qIdx, optionIdx) {
    const user = Auth.getCurrentUser();
    if (!user) return;
    if (typeof SoundManager !== 'undefined') SoundManager.playSFX('click');

    DB.selectPos3GroupOption(groupId, qIdx, optionIdx, user.name);
    this._updateLiveGroupOptionUI(qIdx, optionIdx, user.name);
  },

  onInputGroupEssay(groupId, qIdx, value) {
    const user = Auth.getCurrentUser();
    if (!user) return;
    DB.updatePos3GroupEssay(groupId, qIdx, value, user.name);
    const statusEl = document.getElementById('group-live-pick-status');
    if (statusEl) {
      statusEl.innerHTML = `✍️ Jawaban esai kelompok sedang diketik oleh <strong>${user.name}</strong>`;
    }
  },

  _updateLiveGroupEssayUI(qIdx, essayText, userName) {
    const inp = document.getElementById('kk-essay-input');
    if (inp && document.activeElement !== inp) {
      inp.value = essayText || '';
    }
    const statusEl = document.getElementById('group-live-pick-status');
    if (statusEl) {
      statusEl.innerHTML = `✍️ Jawaban esai kelompok sedang diketik oleh <strong>${userName}</strong>`;
    }
  },

  _updateLiveGroupOptionUI(qIdx, optionIdx, userName) {
    document.querySelectorAll('#kk-options-grid .kuis-option').forEach((btn, i) => {
      btn.classList.toggle('group-selected', i === optionIdx);
      const tag = document.getElementById(`kuis-opt-tag-${i}`);
      if (tag) {
        tag.textContent = i === optionIdx ? `👥 Dipilih oleh ${userName}` : '';
      }
    });

    const statusEl = document.getElementById('group-live-pick-status');
    if (statusEl && optionIdx !== undefined && optionIdx >= 0) {
      statusEl.innerHTML = `👥 Pilihan kelompok saat ini: <strong style="color:#1565C0">Pilihan ${'ABCD'[optionIdx]}</strong> (dipilih oleh <strong>${userName}</strong>)`;
    }
  },

  _startGroup15SecCountdown(groupId, qIdx) {
    const total = 15;
    const circumference = 2 * Math.PI * 44;

    this._kkTimer = setInterval(() => {
      this._kkTimeLeft--;

      const numEl = document.getElementById('kk-delay-num');
      const txtEl = document.getElementById('kk-delay-text');
      const ringEl = document.getElementById('kk-delay-ring');
      const barEl = document.getElementById('kk-delay-bar');

      if (numEl) numEl.textContent = this._kkTimeLeft;
      if (txtEl) txtEl.textContent = this._kkTimeLeft;
      if (ringEl) {
        const offset = circumference * (1 - this._kkTimeLeft / total);
        ringEl.style.strokeDashoffset = offset;
        ringEl.style.stroke = this._kkTimeLeft <= 5 ? '#E53935' : '#F9A825';
      }
      if (barEl) {
        barEl.style.width = `${(this._kkTimeLeft / total) * 100}%`;
      }

      if (this._kkTimeLeft <= 5 && this._kkTimeLeft > 0) {
        if (typeof SoundManager !== 'undefined') SoundManager.playSFX('tick');
      }

      if (this._kkTimeLeft <= 0) {
        clearInterval(this._kkTimer);
        this._kkTimer = null;
        this.submitGroupAnswerNow(groupId, qIdx, true);
      }
    }, 1000);
  },

  submitGroupAnswerNow(groupId, qIdx, fromTimer = false) {
    this._clearAllTimers();
    const user = Auth.getCurrentUser();
    const grp = DB.getGroupById(groupId);
    if (!grp) return;

    // Make sure current essay textarea text is saved if this is an essay question
    const essayInp = document.getElementById('kk-essay-input');
    if (essayInp) {
      DB.updatePos3GroupEssay(groupId, qIdx, essayInp.value, user?.name || 'Anggota Kelompok');
    }

    const gState = DB.getPos3ForGroup(groupId);
    if (gState.answers?.[qIdx]) {
      this._renderGroupKuisQuestion(grp, false);
      return;
    }

    const submitterLabel = fromTimer ? 'Timer 15 Detik Habis' : (user?.name || 'Anggota Kelompok');
    const updatedState = DB.submitPos3GroupAnswer(groupId, qIdx, submitterLabel);
    const ansRec = updatedState?.answers?.[qIdx];
    const q = DB.getKuisKejutan()[qIdx];

    this._renderGroupKuisQuestion(grp, false);

    if (q && ansRec) {
      const detailText = q.type === 'esai'
        ? `Kunci Jawaban Esai: ${q.kunciEsai || q.penjelasan || '-'}`
        : `Kunci Jawaban: ${'ABCD'[q.jawaban]}. ${q.pilihan[q.jawaban]}${q.penjelasan && !q.penjelasan.startsWith('Kunci Jawaban:') ? ' — ' + q.penjelasan : ''}`;
      App.showPointFeedback({
        groupName: `${grp.emoji || '👥'} ${grp.name}`,
        pointsEarned: ansRec.points || 0,
        totalScore: updatedState.totalScore || 0,
        isCorrect: !!ansRec.isCorrect,
        title: ansRec.isCorrect ? 'Jawaban Kelompok BENAR!' : 'Jawaban Kelompok Belum Tepat',
        subtitle: `Soal #${qIdx + 1} • ${fromTimer ? 'Waktu 15 Detik Selesai' : 'Dikirim oleh ' + submitterLabel}`,
        detail: detailText
      });
    }
  },

  nextKuisQ(groupId) {
    this._clearAllTimers();
    const grp = DB.getGroupById(groupId);
    if (!grp) return;
    const questions = DB.getKuisKejutan();
    const gState = DB.getPos3ForGroup(groupId);
    const curr = gState.currentIdx || 0;

    if (curr >= questions.length - 1) {
      this._renderGroupKuisFinalResult(grp);
      return;
    }

    DB.navigatePos3GroupQuestion(groupId, curr + 1);
    this._renderGroupKuisQuestion(grp, true);
  },

  prevKuisQ(groupId) {
    this._clearAllTimers();
    const grp = DB.getGroupById(groupId);
    if (!grp) return;
    const gState = DB.getPos3ForGroup(groupId);
    const curr = gState.currentIdx || 0;

    if (curr > 0) {
      DB.navigatePos3GroupQuestion(groupId, curr - 1);
      this._renderGroupKuisQuestion(grp, true);
    }
  },

  resetGroupQuizConfirm(groupId) {
    const grp = DB.getGroupById(groupId);
    if (!grp) return;
    App.showModal(`
      <div class="modal-confirm">
        <div class="confirm-icon">🔄</div>
        <h3>Reset Kuis Kelompok ${grp.name}?</h3>
        <p>Seluruh jawaban dan skor Kuis Kelompok untuk <strong>${grp.name}</strong> akan direset kembali ke Soal 1.</p>
        <div class="confirm-actions">
          <button class="btn-secondary" onclick="App.closeModal()">Batal</button>
          <button class="btn-danger" onclick="Pos3View.doResetGroupQuiz('${grp.id}')">Ya, Reset</button>
        </div>
      </div>
    `);
  },

  doResetGroupQuiz(groupId) {
    DB.resetPos3Group(groupId);
    App.closeModal();
    const grp = DB.getGroupById(groupId);
    if (grp) this._renderGroupKuisQuestion(grp, true);
    App.showToast('Kuis kelompok berhasil direset!', 'info');
  },

  _renderGroupKuisFinalResult(groupObj) {
    this._clearAllTimers();
    const area = document.getElementById('pos3-kuis-area');
    if (!area || !groupObj) return;

    const questions = DB.getKuisKejutan();
    const gState = DB.getPos3ForGroup(groupObj.id);
    const totalScore = gState.totalScore || 0;
    const maxScore = questions.length * (DB.getSettings().pointsBenar || 10);
    const correctCount = Object.values(gState.answers || {}).filter(a => a.isCorrect).length;

    App.showConfetti(90);

    area.innerHTML = `
      <div class="kuis-result-page">
        <div class="kuis-result-header">
          <div class="kuis-result-trophy">🏆</div>
          <h1>Rekap Skor Kuis Kelompok — ${groupObj.emoji || '👥'} ${groupObj.name}</h1>
          <p>Total Perolehan Skor Kelompok: <strong>${totalScore} / ${maxScore} Poin</strong> (${correctCount} dari ${questions.length} Soal Benar) 🎉</p>
        </div>

        <div class="kuis-final-scoreboard">
          <h3>📋 Rincian Jawaban Kelompok (${groupObj.name})</h3>
          <div style="display:flex;flex-direction:column;gap:10px;margin-top:12px">
            ${questions.map((q, idx) => {
              const ans = gState.answers?.[idx];
              const isEsai = q.type === 'esai';
              return `
                <div class="ta-answer-row ${ans ? (ans.isCorrect ? 'correct' : 'wrong') : ''}">
                  <span class="ta-ans-num">${idx + 1}</span>
                  <div class="ta-ans-q">
                    <strong>${q.pertanyaan}</strong>
                    <small style="display:block;color:var(--text-muted)">
                      ${isEsai
                        ? `Jawaban Kelompok: ${ans?.essayText || '(Belum dijawab)'} • Kunci Esai: <strong>${q.kunciEsai || q.penjelasan || '-'}</strong>`
                        : `Jawaban Kelompok: ${ans && ans.selected >= 0 ? `${'ABCD'[ans.selected]}. ${q.pilihan[ans.selected]}` : '(Belum dijawab)'} • Kunci: <strong>${'ABCD'[q.jawaban]}. ${q.pilihan[q.jawaban]}</strong>`}
                    </small>
                  </div>
                  <div class="ta-ans-result">
                    ${ans ? (ans.isCorrect ? `✅ +${ans.points} Poin` : '❌ 0 Poin') : '⏳ Belum'}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <div class="kuis-result-actions">
          <button class="btn-secondary" onclick="Pos3View._renderGroupKuisQuestion(DB.getGroupById('${groupObj.id}'), false)">← Kembali ke Soal Kelompok</button>
          <button class="btn-primary" onclick="Pos3View.render()">🏠 Menu Utama Pos 3</button>
        </div>
      </div>
    `;
  },

  // ══════════════════════════════════════════════════════════
  // 2. TANTANGAN AKHIR (INDIVIDU — PILIHAN GANDA & ESAI)
  // ══════════════════════════════════════════════════════════
  startTantangan() {
    this._clearAllTimers();
    this._mode = 'tantangan';
    document.getElementById('pos3-menu').style.display = 'none';
    const area = document.getElementById('pos3-tantangan-area');
    area.style.display = 'block';

    const questions = DB.getTantanganAkhir();
    const pgQ = questions.filter(q => (q.type || 'pg') === 'pg');
    const esaiQ = questions.filter(q => q.type === 'esai');
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
