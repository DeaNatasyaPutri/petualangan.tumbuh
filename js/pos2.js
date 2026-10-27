// ============================================================
// POS2.JS — Pos 2: Pecahkan Tantangan
//           • Akses Guru: Kendali Penuh Roda Undian Urutan Kelompok
//             & Roda Kartu Kasus + Live Monitor LKK Seluruh Kelompok
//           • Akses Murid: Terisolasi per ID Kelompok, Layar Menunggu
//             sampai Guru Selesai Spin, & Real-Time Collaborative LKK Editor
//             + Feedback Poin Otomatis & Papan Skor Mini Kelompok
// ============================================================

const Pos2View = {
  // Teacher Wheel 1 (Undian Urutan Kelompok)
  _spinningGroup: false,
  _groupAngle: 0,

  // Teacher Wheel 2 (Undian Kasus)
  _spinningCase: false,
  _caseAngle: 0,
  _previewCaseId: null,

  // Real-time subscription flag
  _syncBound: false,
  _typingIndicatorTimer: null,

  _ensureSyncSubscribed() {
    if (this._syncBound || typeof RealtimeSync === 'undefined') return;
    this._syncBound = true;

    RealtimeSync.subscribe((msg) => {
      const viewEl = document.getElementById('view-pos2');
      if (!viewEl || !viewEl.classList.contains('active')) return;

      const user = Auth.getCurrentUser();
      if (!user) return;

      // ── 1. Handle Real-Time Typing on Collaborative LKK ──
      if (msg.event === 'POS2_LKK_TYPING') {
        const { groupId, fieldIndex, value, userName } = msg.payload || {};

        if (user.role === 'murid') {
          const myGroup = Auth.getCurrentGroup();
          if (myGroup && myGroup.id === groupId) {
            const ta = document.getElementById(`lkk-ans-${fieldIndex}`);
            if (ta && ta.value !== value) {
              const selStart = ta.selectionStart;
              const selEnd = ta.selectionEnd;
              ta.value = value;
              if (document.activeElement === ta) {
                try { ta.setSelectionRange(selStart, selEnd); } catch (_) {}
              }
            }
            this._showLiveTypingBadge(fieldIndex, userName);
            this._updateLKKProgressCounter(groupId);
          }
        } else {
          // Guru live monitor update
          const guruCell = document.getElementById(`guru-live-lkk-${groupId}-${fieldIndex}`);
          if (guruCell) {
            guruCell.textContent = value || '(Belum diisi)';
            guruCell.classList.toggle('empty', !value);
          }
          const guruBadge = document.getElementById(`guru-live-typing-${groupId}`);
          if (guruBadge) {
            guruBadge.innerHTML = `✍️ <strong>${userName}</strong> sedang mengetik Q${fieldIndex + 1}...`;
            guruBadge.style.display = 'inline-flex';
          }
        }
        return;
      }

      // ── 2. Handle Case Assigned by Teacher Spin ──
      if (msg.event === 'POS2_CASE_ASSIGNED') {
        const { groupId, caseId } = msg.payload || {};
        if (user.role === 'murid') {
          const myGroup = Auth.getCurrentGroup();
          if (myGroup && myGroup.id === groupId) {
            const c = DB.getCases().find(x => x.id === caseId);
            if (typeof SoundManager !== 'undefined') SoundManager.playSFX('reveal');
            App.showConfetti(45);
            App.showToast(`🎡 Guru telah mengundi kasus "${c?.title || ''}" untuk ${myGroup.name}!`, 'success');
            this.render();
          }
        } else {
          this.render();
        }
        return;
      }

      // ── 3. Handle LKK Submitted (Automatic Point Feedback for Group) ──
      if (msg.event === 'POS2_LKK_SUBMITTED') {
        const { groupId, submittedBy, pointsEarned, firstSubmit } = msg.payload || {};
        if (user.role === 'murid') {
          const myGroup = Auth.getCurrentGroup();
          if (myGroup && myGroup.id === groupId) {
            this.render();
            const totalGroupScore = this._calcGroupTotalPoints(groupId);
            App.showPointFeedback({
              groupName: `${myGroup.emoji || '👥'} ${myGroup.name}`,
              pointsEarned: firstSubmit ? pointsEarned : 20,
              totalScore: totalGroupScore,
              isCorrect: true,
              title: 'Lembar Kerja Kelompok Terkirim!',
              subtitle: `Dikirim oleh ${submittedBy} • Tersinkronisasi ke seluruh anggota ${myGroup.name}`,
              detail: 'Analisis 5 pertanyaan panduan studi kasus Pos 2 telah disimpan (+20 Poin Kelompok).'
            });
          }
        } else {
          this.render();
        }
        return;
      }

      // ── 4. Handle General Pos 2 / Group State Updates ──
      if (['POS2_STATE_UPDATED', 'POS2_RESET', 'GROUPS_UPDATED'].includes(msg.event)) {
        this.render();
      }
    });
  },

  _calcGroupTotalPoints(groupId) {
    const pos2State = DB.getPos2State();
    const lkk = pos2State.lkk?.[groupId];
    const pos2Pts = lkk?.pointsEarned || 0;
    const pos3G = DB.getPos3ForGroup(groupId);
    const pos3Pts = pos3G?.totalScore || 0;
    return pos2Pts + pos3Pts;
  },

  render() {
    this._ensureSyncSubscribed();
    const user = Auth.getCurrentUser();
    if (!user) return;

    if (user.role === 'guru' || user.role === 'admin') {
      this._renderGuruView(user);
    } else {
      this._renderMuridIsolatedView(user);
    }
  },

  // ══════════════════════════════════════════════════════════
  // A. TAMPILAN GURU / ADMIN — KENDALI PENUH RODA UNDIAN & MONITOR
  // ══════════════════════════════════════════════════════════
  _renderGuruView(user) {
    const groups = DB.getGroups();
    const cases = DB.getCases();
    const state = DB.getPos2State();
    const turnOrder = state.turnOrder || [];
    const remainingGroups = groups.filter(g => !turnOrder.includes(g.id));
    const activeGroup = groups.find(g => g.id === state.activeGroupId) || groups.find(g => turnOrder.includes(g.id)) || groups[0] || null;
    const activeAssign = activeGroup ? state.assignments?.[activeGroup.id] : null;
    const activeCase = activeAssign ? cases.find(c => c.id === activeAssign.caseId) : (this._previewCaseId ? cases.find(c => c.id === this._previewCaseId) : null);

    const el = document.getElementById('view-pos2');
    el.innerHTML = `
      <div class="pos-layout">
        <!-- Header -->
        <div class="pos-header" style="background:linear-gradient(135deg,#1565C0,#0D47A1)">
          <button class="pos-back-btn" onclick="App.navigate('dashboard')">← Dasbor Guru</button>
          <div class="pos-header-content">
            <div class="pos-header-num">POS 2 • KENDALI GURU (REAL-TIME SYNC)</div>
            <h1 class="pos-header-title">🎡 Pecahkan Tantangan — Pusat Undian & Kolaborasi Kelompok</h1>
            <p class="pos-header-desc">Layar murid terkunci pada mode tunggu sampai Anda memutar roda kasus dan menetapkan studi kasus untuk kelompok mereka.</p>
          </div>
          <div style="display:flex;gap:10px">
            <button class="pos-back-btn" onclick="App.navigate('guru',{tab:'kelompok'})">👥 Kelola Kelompok</button>
            <button class="pos-back-btn" onclick="App.navigate('guru',{tab:'kasus'})">✏️ Edit Kasus & Gambar</button>
          </div>
        </div>

        <div class="pos-content pos2-content">
          <!-- TAHAP 1: RODA PUTAR UNDIAN URUTAN MAJU KELOMPOK -->
          <div class="pos2-stage-card">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:16px">
              <div>
                <span class="pos2-stage-badge" style="margin-bottom:4px">TAHAP 1 — UNDIAN URUTAN MAJU KELOMPOK (DIKENDALIKAN GURU)</span>
                <h3 style="font-size:1.2rem">Putar Roda 1 untuk Mengundi Giliran Kelompok atau Pilih Kelompok Secara Langsung</h3>
              </div>
              <button class="btn-secondary sm" onclick="Pos2View.resetAllPos2Confirm()">🔄 Reset Seluruh Undian Pos 2</button>
            </div>

            <div class="pos2-group-wheel-grid">
              <!-- Roda 1 Canvas -->
              <div class="wheel-section">
                <h3 class="wheel-section-title">🎡 Roda 1: Undian Giliran Kelompok</h3>
                <div class="wheel-container">
                  <div class="wheel-pointer">▼</div>
                  <canvas id="wheel-group-canvas" width="330" height="330"></canvas>
                </div>
                <button class="btn-spin" id="btn-spin-group" onclick="Pos2View.spinGroupWheel()" ${remainingGroups.length === 0 ? 'disabled' : ''}>
                  ${remainingGroups.length > 0 ? '🎡 PUTAR UNDIAN KELOMPOK!' : '✅ Semua Kelompok Sudah Diundi'}
                </button>
                <p class="wheel-hint" id="group-wheel-hint">
                  ${remainingGroups.length > 0
                    ? `Tersisa <strong>${remainingGroups.length}</strong> kelompok yang belum diundi urutan majunya.`
                    : `Semua kelompok sudah mendapat giliran! Klik kelompok di sebelah kanan untuk mengundi kasusnya.`}
                </p>
              </div>

              <!-- Panel Daftar Kelompok & Hasil Urutan Maju -->
              <div class="group-order-panel">
                <div class="group-turn-result-box">
                  <div style="display:flex;justify-content:space-between;align-items:center">
                    <h4>📋 Daftar Kelompok & Status Undian Kasus (${groups.length} Kelompok)</h4>
                    <small style="color:var(--text-muted);font-weight:700">Klik kelompok untuk memilih giliran Roda 2</small>
                  </div>
                  <div class="turn-order-list" style="margin-top:12px">
                    ${groups.map((g, idx) => {
                      const turnIdx = turnOrder.indexOf(g.id);
                      const isSelected = activeGroup && activeGroup.id === g.id;
                      const assigned = state.assignments?.[g.id];
                      const assignedCaseObj = assigned ? cases.find(c => c.id === assigned.caseId) : null;
                      const memberCount = (g.memberIds || []).length;

                      return `
                        <div class="turn-order-item ${isSelected ? 'active-turn' : ''}" onclick="Pos2View.selectActiveGroupForWheel('${g.id}')">
                          <span class="turn-badge" style="background:${turnIdx >= 0 ? g.color || '#1565C0' : '#94A3B8'}">
                            ${turnIdx >= 0 ? `Urutan #${turnIdx + 1}` : `Kelompok ${idx + 1}`}
                          </span>
                          <div style="flex:1">
                            <strong>${g.emoji || '👥'} ${g.name}</strong>
                            <small style="display:block;color:var(--text-muted)">
                              ${memberCount} Murid •
                              ${assignedCaseObj
                                ? `<span style="color:#2E7D32;font-weight:800">✅ Kasus: ${assignedCaseObj.emoji} ${assignedCaseObj.title}</span>`
                                : `<span style="color:#E65100;font-weight:700">⏳ Belum dapat kasus (Layar murid menunggu)</span>`}
                            </small>
                          </div>
                          <span class="turn-action">
                            ${isSelected ? '🎯 Aktif di Roda 2' : 'Pilih Kelompok →'}
                          </span>
                        </div>
                      `;
                    }).join('')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- TAHAP 2: RODA KASUS UNTUK KELOMPOK AKTIF -->
          ${activeGroup ? `
            <div class="pos2-main-area" id="pos2-main">
              <div class="pos2-kelompok-display">
                <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
                  <span class="pos2-stage-badge" style="margin:0;background:#43A047">TAHAP 2 — UNDIAN RODA KASUS</span>
                  <span>Target Kelompok Saat Ini: <strong style="color:${activeGroup.color || '#1565C0'};font-size:1.15rem">${activeGroup.emoji || '👥'} ${activeGroup.name}</strong></span>
                </div>
                <div>
                  ${activeAssign ? `
                    <span class="badge-done">✅ Kasus Sudah Ditetapkan & Tayang di Layar ${activeGroup.name}</span>
                  ` : `
                    <span class="badge-pending">⏳ Layar ${activeGroup.name} Menunggu Putaran Roda 2</span>
                  `}
                </div>
              </div>

              <div class="pos2-split">
                <!-- Spinning Wheel 2 (Roda Kasus) -->
                <div class="wheel-section">
                  <h3 class="wheel-section-title">🎡 Roda 2: Undi Kasus untuk ${activeGroup.name}</h3>
                  <div class="wheel-container">
                    <div class="wheel-pointer">▼</div>
                    <canvas id="wheel-canvas" width="350" height="350"></canvas>
                  </div>
                  <button class="btn-spin" id="btn-spin" onclick="Pos2View.spinCaseWheelForGroup('${activeGroup.id}')">
                    🎡 PUTAR & TETAPKAN KASUS KE ${activeGroup.name.toUpperCase()}!
                  </button>
                  <p class="wheel-hint" id="wheel-hint">
                    Begitu roda berhenti, studi kasus otomatis dikirim & muncul secara real-time di layar semua anggota <strong>${activeGroup.name}</strong>!
                  </p>
                </div>

                <!-- Case Display Preview for Active Group -->
                <div class="case-section" id="case-section">
                  ${activeCase ? this._buildCaseCardHTML(activeCase, activeGroup.name) : `
                    <div class="case-empty" id="case-empty">
                      <div class="case-empty-icon">🎴</div>
                      <h3>Belum Ada Kasus untuk ${activeGroup.name}</h3>
                      <p>Klik tombol <strong>"PUTAR & TETAPKAN KASUS"</strong> di sebelah kiri untuk mengacak 5 kartu kasus dan menampilkannya ke layar anggota <strong>${activeGroup.name}</strong>!</p>
                    </div>
                  `}
                </div>
              </div>
            </div>
          ` : ''}

          <!-- TAHAP 3: LIVE MONITOR KOLABORASI LKK SELURUH KELOMPOK -->
          <div class="pos2-stage-card" style="margin-top:28px;border-top-color:#43A047">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
              <div>
                <span class="pos2-stage-badge" style="background:#43A047;margin-bottom:4px">📡 PEMANTAUAN KOLABORASI REAL-TIME</span>
                <h3 style="font-size:1.2rem">Pantauan Langsung Lembar Kerja Kelompok (LKK) Seluruh Kelompok</h3>
              </div>
              <span class="badge-done">🟢 Live Sync Aktif (Setiap ketikan murid muncul otomatis)</span>
            </div>

            <div class="guru-lkk-monitor-grid">
              ${groups.map(g => {
                const assign = state.assignments?.[g.id];
                const cObj = assign ? cases.find(c => c.id === assign.caseId) : null;
                const lkk = state.lkk?.[g.id] || { answers: ['', '', '', '', ''], submitted: false };
                return `
                  <div class="guru-lkk-monitor-card" style="border-top: 4px solid ${g.color || '#1565C0'}">
                    <div class="guru-lkk-monitor-head">
                      <div>
                        <h4>${g.emoji || '👥'} ${g.name}</h4>
                        <small style="color:var(--text-muted)">
                          ${cObj ? `🎴 Kasus: <strong>${cObj.title}</strong>` : '⏳ Belum diundi kasusnya'}
                        </small>
                      </div>
                      <span class="${lkk.submitted ? 'badge-done' : 'badge-pending'}">
                        ${lkk.submitted ? '✅ Terkirim (+20 Poin)' : '✍️ Sedang Diskusi'}
                      </span>
                    </div>

                    <div id="guru-live-typing-${g.id}" class="live-typing-badge" style="${lkk.lastTypedBy ? 'display:inline-flex' : 'display:none'};margin-bottom:10px">
                      ✍️ Terakhir diketik oleh <strong>${lkk.lastTypedBy || '-'}</strong>
                    </div>

                    ${cObj ? `
                      <div class="guru-lkk-Monitor-answers">
                        ${(cObj.pertanyaanPanduan || []).map((q, qi) => `
                          <div class="guru-lkk-ans-item">
                            <div class="guru-lkk-q-label">Q${qi + 1}: ${q}</div>
                            <div id="guru-live-lkk-${g.id}-${qi}" class="guru-lkk-ans-val ${lkk.answers?.[qi] ? '' : 'empty'}">${lkk.answers?.[qi] || '(Belum diisi)'}</div>
                          </div>
                        `).join('')}
                      </div>
                    ` : `
                      <div class="empty-turn-state" style="padding:16px">
                        Putar Roda 2 untuk kelompok ini agar lembar kerja terbuka di layar murid.
                      </div>
                    `}
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    this._drawGroupWheel(remainingGroups);
    this._drawCaseWheel();
  },

  // ══════════════════════════════════════════════════════════
  // B. TAMPILAN MURID — TERISOLASI PER ID KELOMPOK & REAL-TIME LKK
  // ══════════════════════════════════════════════════════════
  _renderMuridIsolatedView(user) {
    const myGroup = Auth.getCurrentGroup();
    const backTarget = 'murid';
    const el = document.getElementById('view-pos2');

    // If student has not been assigned to any group by Guru yet
    if (!myGroup) {
      el.innerHTML = `
        <div class="pos-layout">
          <div class="pos-header" style="background:linear-gradient(135deg,#1565C0,#0D47A1)">
            <button class="pos-back-btn" onclick="App.navigate('${backTarget}')">← Kembali</button>
            <div class="pos-header-content">
              <div class="pos-header-num">POS 2</div>
              <h1 class="pos-header-title">🎡 Pecahkan Tantangan</h1>
              <p class="pos-header-desc">Analisis Studi Kasus Kelompok secara Real-Time</p>
            </div>
          </div>
          <div class="pos-content">
            <div class="pos2-waiting-card">
              <div class="waiting-pulse-icon">👥</div>
              <h2>Akunmu Belum Masuk ke Kelompok Belajar</h2>
              <p>Mintalah Bapak/Ibu Guru untuk memasukkan akunmu (<strong>${user.name}</strong>) ke dalam kelompok melalui menu <strong>Manajemen Kelompok</strong> di Dasbor Guru.</p>
              <div class="waiting-status-pill">📡 Layar ini akan otomatis terbuka begitu Guru memasukkanmu ke kelompok!</div>
            </div>
          </div>
        </div>
      `;
      return;
    }

    const allUsers = DB.getUsers();
    const teammates = allUsers.filter(u => (myGroup.memberIds || []).includes(u.id));
    const state = DB.getPos2State();
    const myAssignment = state.assignments?.[myGroup.id] || null;
    const assignedCase = myAssignment ? DB.getCases().find(c => c.id === myAssignment.caseId) : null;
    const myLKK = state.lkk?.[myGroup.id] || { answers: ['', '', '', '', ''], submitted: false, pointsEarned: 0 };
    const totalGroupScore = this._calcGroupTotalPoints(myGroup.id);
    const turnIdx = (state.turnOrder || []).indexOf(myGroup.id);

    el.innerHTML = `
      <div class="pos-layout">
        <!-- Header Pos 2 dengan Mini Scoreboard Kelompok -->
        <div class="pos-header" style="background:linear-gradient(135deg,#1565C0,#0D47A1)">
          <button class="pos-back-btn" onclick="App.navigate('${backTarget}')">← Kembali</button>
          <div class="pos-header-content">
            <div class="pos-header-num">POS 2 • RUANG KERJA ${myGroup.name.toUpperCase()}</div>
            <h1 class="pos-header-title">🎡 Pecahkan Tantangan</h1>
            <p class="pos-header-desc">Diskusikan studi kasus kelompokmu dan ketik jawaban bersama-sama secara real-time!</p>
          </div>
          <!-- Mini Group Scoreboard -->
          <div class="mini-group-scoreboard">
            <div class="mgs-top">
              <span class="mgs-emoji">${myGroup.emoji || '👥'}</span>
              <div>
                <div class="mgs-name">${myGroup.name}</div>
                <div class="mgs-sub">🟢 Live Sync Kelompok</div>
              </div>
            </div>
            <div class="mgs-points">⭐ <strong id="pos2-mini-score-val">${totalGroupScore}</strong> Poin Kelompok</div>
          </div>
        </div>

        <div class="pos-content pos2-content">
          <!-- Bar Identitas Kelompok & Anggota Kolaborasi -->
          <div class="group-identity-bar" style="border-left: 6px solid #1565C0">
            <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap">
              <div class="group-emoji-Circle" style="background:${myGroup.color || '#1E88E5'}18;color:${myGroup.color || '#1E88E5'}">${myGroup.emoji || '👥'}</div>
              <div>
                <div style="display:flex;align-items:center;gap:8px">
                  <strong style="font-size:1.1rem">${myGroup.name}</strong>
                  ${turnIdx >= 0 ? `<span class="badge-kelas">Urutan Maju #${turnIdx + 1}</span>` : ''}
                  <span class="badge-done">📡 Terisolasi Khusus Kelompokmu</span>
                </div>
                <div class="murid-chips" style="margin-top:6px">
                  ${teammates.map(m => `
                    <div class="murid-chip ${m.id === user.id ? 'me' : ''}" style="${m.id === user.id ? 'border:2px solid #1E88E5;background:#E3F2FD' : ''}">
                      <span>${m.avatar || '👦'}</span>
                      <span>${m.name} ${m.id === user.id ? '<strong>(Kamu)</strong>' : ''}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
            <div style="text-align:right">
              <div style="font-size:0.8rem;font-weight:800;color:var(--text-muted)">STATUS LEMBAR KERJA (LKK)</div>
              <div id="lkk-progress-badge" style="margin-top:4px">
                ${myLKK.submitted
                  ? `<span class="badge-done" style="font-size:0.9rem;padding:6px 14px">✅ Sudah Dikirim (+${myLKK.pointsEarned || 20} Poin)</span>`
                  : `<span class="badge-pending" style="font-size:0.9rem;padding:6px 14px">✍️ Terisi ${(myLKK.answers || []).filter(a => a && a.trim()).length} / 5 Pertanyaan</span>`}
              </div>
            </div>
          </div>

          ${!assignedCase ? `
            <!-- LAYAR TUNGGU MURID SEBELUM GURU SELESAI SPIN & TETAPKAN KASUS -->
            <div class="pos2-waiting-card">
              <div class="waiting-pulse-icon">🎡</div>
              <h2>Menunggu Guru Memutar Roda Undian Kasus...</h2>
              <p>
                Saat ini studi kasus untuk <strong>${myGroup.emoji || '👥'} ${myGroup.name}</strong> belum diundi oleh Guru.<br>
                Perhatikan layar utama / Papan Interaktif di depan kelas saat Bapak/Ibu Guru memutar Roda Undian!
              </p>
              <div class="waiting-steps-row">
                <div class="waiting-step ${turnIdx >= 0 ? 'done' : 'active'}">
                  <span>${turnIdx >= 0 ? '✅' : '1️⃣'}</span>
                  <div>
                    <strong>Undian Giliran Kelompok</strong>
                    <small>${turnIdx >= 0 ? `${myGroup.name} mendapat Urutan Maju #${turnIdx + 1}` : 'Menunggu Guru memutar Roda 1...'}</small>
                  </div>
                </div>
                <div class="waiting-step ${turnIdx >= 0 ? 'active' : ''}">
                  <span>2️⃣</span>
                  <div>
                    <strong>Undian Kartu Kasus (Roda 2)</strong>
                    <small>Begitu roda berhenti, studi kasus langsung muncul otomatis di layarmu!</small>
                  </div>
                </div>
              </div>
              <div class="waiting-status-pill">📡 Terhubung secara real-time — Tidak perlu muat ulang halaman</div>
            </div>
          ` : `
            <!-- TAMPILAN STUDI KASUS & COLLABORATIVE LKK EDITOR KHUSUS KELOMPOK INI -->
            <div class="pos2-isolated-workspace">
              <!-- Kartu Studi Kasus Kelompok -->
              <div class="case-section" style="min-height:auto;margin-bottom:24px">
                ${this._buildCaseCardHTML(assignedCase, myGroup.name)}
              </div>

              <!-- Real-Time Collaborative Editor: 5 Pertanyaan Panduan LKK -->
              <div class="jawaban-section" id="jawaban-section" style="margin-top:0">
                <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:18px">
                  <div>
                    <h3 class="jawaban-title" style="margin-bottom:4px">
                      ✍️ Lembar Kerja Kelompok (LKK) Kolaboratif — ${myGroup.emoji || '👥'} ${myGroup.name}
                    </h3>
                    <p style="font-size:0.88rem;color:var(--text-muted)">
                      💡 <strong>Mode Kolaborasi Real-Time:</strong> Setiap huruf yang kamu ketik langsung muncul di layar teman satu kelompokmu pada saat yang bersamaan!
                    </p>
                  </div>
                  <div id="student-live-typing-indicator" class="live-typing-badge" style="display:none"></div>
                </div>

                <div class="pertanyaan-list" id="pertanyaan-list">
                  ${(assignedCase.pertanyaanPanduan || []).map((q, i) => `
                    <div class="pertanyaan-item" style="border-left-color:#1565C0">
                      <div style="display:flex;justify-content:space-between;align-items:center">
                        <div class="pertanyaan-num" style="color:#1565C0">Pertanyaan Panduan ${i + 1}</div>
                        <small id="field-typing-${i}" style="color:#2E7D32;font-weight:800;font-size:0.78rem"></small>
                      </div>
                      <div class="pertanyaan-text">${q}</div>
                      <textarea class="form-input jawaban-textarea" id="lkk-ans-${i}"
                        placeholder="Ketik hasil diskusi ${myGroup.name} untuk pertanyaan ${i + 1} di sini (tersinkronisasi otomatis ke anggota kelompok)..."
                        oninput="Pos2View.onStudentTypeLKK(${i}, this.value)">${(myLKK.answers && myLKK.answers[i]) ? myLKK.answers[i] : ''}</textarea>
                    </div>
                  `).join('')}
                </div>

                <div class="jawaban-actions" style="justify-content:space-between;align-items:center">
                  <div style="font-size:0.86rem;color:var(--text-muted)">
                    ${myLKK.submitted
                      ? `✅ Terakhir dikirim oleh <strong>${myLKK.submittedBy || 'Anggota Kelompok'}</strong>. Kalian masih bisa memperbarui dan mengirim ulang.`
                      : `🔒 Pastikan kelima pertanyaan panduan telah didiskusikan bersama kelompokmu sebelum menekan tombol kirim.`}
                  </div>
                  <button class="btn-primary lg" onclick="Pos2View.submitCollaborativeLKK()">
                    ✅ Simpan & Kirim Jawaban Kelompok (+20 Poin)
                  </button>
                </div>
              </div>
            </div>
          `}
        </div>
      </div>
    `;
  },

  _buildCaseCardHTML(caseObj, groupName) {
    return `
      <div class="case-card-result" style="border-top:5px solid ${caseObj.color}">
        <div class="case-card-top" style="background:${caseObj.bgGradient}">
          <div class="case-result-emoji">${caseObj.emoji}</div>
          <div class="case-result-badge">🎴 STUDI KASUS KHUSUS — ${groupName.toUpperCase()}</div>
        </div>

        <div class="case-card-inner">
          <h2 class="case-result-title">${caseObj.title}</h2>

          ${caseObj.imageData ? `
            <div class="case-attached-image-box">
              <img src="${caseObj.imageData}" alt="Lampiran Kasus ${caseObj.title}" class="case-attached-image" onclick="Pos2View.zoomCaseImage('${caseObj.id}')">
              <span class="case-image-caption">🖼️ Lampiran Gambar Studi Kasus (Klik gambar untuk memperbesar)</span>
            </div>
          ` : ''}

          <div class="case-redaksi-box">
            <div class="case-redaksi-label">📖 Redaksi Studi Kasus Permasalahan:</div>
            <div class="case-result-desc">${caseObj.deskripsi}</div>
          </div>
        </div>
      </div>
    `;
  },

  // ══════════════════════════════════════════════════════════
  // C. FUNGSI KOLABORASI REAL-TIME MURID (LKK)
  // ══════════════════════════════════════════════════════════
  onStudentTypeLKK(fieldIndex, value) {
    const user = Auth.getCurrentUser();
    const myGroup = Auth.getCurrentGroup();
    if (!user || !myGroup) return;

    DB.updatePos2LKKField(myGroup.id, fieldIndex, value, user.name);
    this._updateLKKProgressCounter(myGroup.id);
  },

  _showLiveTypingBadge(fieldIndex, userName) {
    const badge = document.getElementById('student-live-typing-indicator');
    const fieldHint = document.getElementById(`field-typing-${fieldIndex}`);
    if (badge) {
      badge.style.display = 'inline-flex';
      badge.innerHTML = `✍️ <strong>${userName}</strong> sedang mengetik di Pertanyaan #${fieldIndex + 1}...`;
    }
    if (fieldHint) {
      fieldHint.textContent = `✍️ ${userName} sedang mengetik...`;
    }

    if (this._typingIndicatorTimer) clearTimeout(this._typingIndicatorTimer);
    this._typingIndicatorTimer = setTimeout(() => {
      if (badge) badge.style.display = 'none';
      if (fieldHint) fieldHint.textContent = '';
    }, 2200);
  },

  _updateLKKProgressCounter(groupId) {
    const badge = document.getElementById('lkk-progress-badge');
    if (!badge) return;
    const state = DB.getPos2State();
    const lkk = state.lkk?.[groupId];
    if (!lkk || lkk.submitted) return;
    const count = (lkk.answers || []).filter(a => a && a.trim()).length;
    badge.innerHTML = `<span class="badge-pending" style="font-size:0.9rem;padding:6px 14px">✍️ Terisi ${count} / 5 Pertanyaan</span>`;
  },

  submitCollaborativeLKK() {
    const user = Auth.getCurrentUser();
    const myGroup = Auth.getCurrentGroup();
    if (!user || !myGroup) return;

    const state = DB.getPos2State();
    const assign = state.assignments?.[myGroup.id];
    const assignedCase = assign ? DB.getCases().find(c => c.id === assign.caseId) : null;
    if (!assignedCase) return;

    // Make sure current textarea values are synced
    for (let i = 0; i < 5; i++) {
      const el = document.getElementById(`lkk-ans-${i}`);
      if (el) {
        DB.updatePos2LKKField(myGroup.id, i, el.value, user.name);
      }
    }

    const latestState = DB.getPos2State();
    const answers = latestState.lkk?.[myGroup.id]?.answers || [];
    const filled = answers.filter(a => a && a.trim().length > 0).length;

    if (filled < 3) {
      App.showToast('Mohon diskusikan dan isi minimal 3 pertanyaan panduan sebelum mengirim!', 'warning');
      return;
    }

    const res = DB.submitPos2LKK(myGroup.id, user.name);
    this.render();

    const totalGroupScore = this._calcGroupTotalPoints(myGroup.id);
    App.showPointFeedback({
      groupName: `${myGroup.emoji || '👥'} ${myGroup.name}`,
      pointsEarned: res?.pointsEarned || 20,
      totalScore: totalGroupScore,
      isCorrect: true,
      title: 'Lembar Kerja Kelompok Berhasil Dikirim!',
      subtitle: `Dikirim oleh ${user.name} • Tersinkronisasi ke seluruh anggota ${myGroup.name}`,
      detail: `Analisis kasus "${assignedCase.title}" telah tersimpan dan menambah +20 Poin Kelompok!`
    });
  },

  // ══════════════════════════════════════════════════════════
  // D. FUNGSI KENDALI RODA GURU (RODA 1 & RODA 2)
  // ══════════════════════════════════════════════════════════
  selectActiveGroupForWheel(groupId) {
    const state = DB.getPos2State();
    state.activeGroupId = groupId;
    DB.savePos2State(state, 'POS2_STATE_UPDATED');
    this.render();
  },

  resetAllPos2Confirm() {
    App.showModal(`
      <div class="modal-confirm">
        <div class="confirm-icon">🔄</div>
        <h3>Reset Seluruh Undian & LKK Pos 2?</h3>
        <p>Semua urutan maju kelompok dan penugasan studi kasus akan direset. Layar murid di Pos 2 akan kembali ke mode menunggu putaran roda Guru.</p>
        <div class="confirm-actions">
          <button class="btn-secondary" onclick="App.closeModal()">Batal</button>
          <button class="btn-danger" onclick="Pos2View.doResetAllPos2()">Ya, Reset Pos 2</button>
        </div>
      </div>
    `);
  },

  doResetAllPos2() {
    DB.resetPos2State();
    this._previewCaseId = null;
    App.closeModal();
    App.showToast('Seluruh undian Pos 2 berhasil direset!', 'info');
    this.render();
  },

  _drawGroupWheel(remainingGroups, highlightIdx = -1) {
    const canvas = document.getElementById('wheel-group-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const groups = remainingGroups && remainingGroups.length > 0 ? remainingGroups : DB.getGroups();
    const list = groups.length > 0 ? groups : [{ name: 'Belum Ada Kelompok', color: '#1E88E5' }];
    const n = list.length;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const r = cx - 10;
    const sliceAngle = (2 * Math.PI) / n;
    const fallbackColors = ['#1E88E5', '#43A047', '#FB8C00', '#8E24AA', '#E53935', '#00897B'];

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    list.forEach((grp, i) => {
      const startAngle = this._groupAngle + i * sliceAngle - Math.PI / 2;
      const endAngle = startAngle + sliceAngle;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = i === highlightIdx ? '#FFD600' : (grp.color || fallbackColors[i % fallbackColors.length]);
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = i === highlightIdx ? '#1A1A2E' : '#FFFFFF';
      ctx.font = 'bold 13px Nunito, sans-serif';
      const label = `${grp.emoji || ''} ${grp.name}`.trim();
      const shortName = label.length > 18 ? label.substring(0, 17) + '…' : label;
      ctx.fillText(shortName, r - 18, 5);
      ctx.restore();
    });

    ctx.beginPath();
    ctx.arc(cx, cy, 28, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.strokeStyle = '#1565C0';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.font = '20px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('👥', cx, cy);
  },

  spinGroupWheel() {
    if (this._spinningGroup) return;
    const groups = DB.getGroups();
    const state = DB.getPos2State();
    const turnOrder = state.turnOrder || [];
    const remaining = groups.filter(g => !turnOrder.includes(g.id));

    if (remaining.length === 0) {
      App.showToast('Semua kelompok sudah mendapat giliran maju!', 'info');
      return;
    }

    this._spinningGroup = true;
    const btn = document.getElementById('btn-spin-group');
    if (btn) {
      btn.disabled = true;
      btn.textContent = '⏳ Mengundi Kelompok...';
    }

    const targetIdx = Math.floor(Math.random() * remaining.length);
    const sliceAngle = (2 * Math.PI) / remaining.length;
    const fullSpins = (5 + Math.floor(Math.random() * 4)) * 2 * Math.PI;
    const targetAngle = -(targetIdx * sliceAngle);
    const totalRotation = fullSpins + targetAngle;

    const duration = 3200;
    const startTime = performance.now();
    const startAngle = this._groupAngle;
    let lastTickSlice = -1;

    const animate = (now) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);

      this._groupAngle = startAngle + totalRotation * eased;
      const currentSlice = Math.floor(Math.abs(this._groupAngle) / (sliceAngle / 2));
      if (currentSlice !== lastTickSlice && typeof SoundManager !== 'undefined') {
        lastTickSlice = currentSlice;
        SoundManager.playSFX('tick');
      }
      this._drawGroupWheel(remaining);

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        this._groupAngle = targetAngle;
        this._drawGroupWheel(remaining, targetIdx);
        this._spinningGroup = false;

        const chosenGroup = remaining[targetIdx];
        const latest = DB.getPos2State();
        if (!latest.turnOrder) latest.turnOrder = [];
        latest.turnOrder.push(chosenGroup.id);
        latest.activeGroupId = chosenGroup.id;
        DB.savePos2State(latest, 'POS2_STATE_UPDATED');

        App.showConfetti(35);
        App.showToast(`🎉 Giliran Maju #${latest.turnOrder.length}: ${chosenGroup.name}! Sekarang putar Roda 2 untuk mengundi kasusnya!`, 'success');
        this.render();
      }
    };

    requestAnimationFrame(animate);
  },

  _drawCaseWheel(highlightIdx = -1) {
    const canvas = document.getElementById('wheel-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const cases = DB.getCases();
    const n = cases.length;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const r = cx - 10;
    const sliceAngle = (2 * Math.PI) / n;
    const colors = ['#E53935', '#1E88E5', '#43A047', '#FB8C00', '#8E24AA', '#00ACC1'];

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    cases.forEach((c, i) => {
      const startAngle = this._caseAngle + i * sliceAngle - Math.PI / 2;
      const endAngle = startAngle + sliceAngle;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = i === highlightIdx ? '#FFD700' : colors[i % colors.length];
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = i === highlightIdx ? '#1A1A2E' : '#fff';

      ctx.font = '22px serif';
      ctx.fillText(c.emoji, r - 14, 6);

      ctx.font = 'bold 11px Nunito, sans-serif';
      const words = c.title.split(' ');
      const short = words.slice(0, 2).join(' ');
      ctx.fillText(short, r - 44, 22);
      ctx.restore();
    });

    ctx.beginPath();
    ctx.arc(cx, cy, 28, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = 'bold 20px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🎴', cx, cy);
  },

  spinCaseWheelForGroup(groupId) {
    if (this._spinningCase) return;
    const grp = DB.getGroupById(groupId);
    if (!grp) {
      App.showToast('Pilih kelompok terlebih dahulu!', 'warning');
      return;
    }

    this._spinningCase = true;
    const btn = document.getElementById('btn-spin');
    if (btn) {
      btn.disabled = true;
      btn.textContent = `⏳ Mengacak Kasus untuk ${grp.name}...`;
    }

    const cases = DB.getCases();
    const targetIdx = Math.floor(Math.random() * cases.length);
    const sliceAngle = (2 * Math.PI) / cases.length;
    const fullSpins = (5 + Math.floor(Math.random() * 5)) * 2 * Math.PI;
    const targetAngle = -(targetIdx * sliceAngle);
    const totalRotation = fullSpins + targetAngle;

    const duration = 3600;
    const startTime = performance.now();
    const startAngle = this._caseAngle;
    let lastTickSlice = -1;

    const animate = (now) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);

      this._caseAngle = startAngle + totalRotation * eased;
      const currentSlice = Math.floor(Math.abs(this._caseAngle) / (sliceAngle / 2));
      if (currentSlice !== lastTickSlice && typeof SoundManager !== 'undefined') {
        lastTickSlice = currentSlice;
        SoundManager.playSFX('tick');
      }
      this._drawCaseWheel();

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        this._caseAngle = targetAngle;
        this._drawCaseWheel(targetIdx);
        this._spinningCase = false;

        const chosenCase = cases[targetIdx];
        const user = Auth.getCurrentUser();
        this._previewCaseId = chosenCase.id;

        // Assign case to group & broadcast real-time to students in that group!
        DB.assignCaseToGroup(grp.id, chosenCase.id, user?.name || 'Guru');

        if (typeof SoundManager !== 'undefined') SoundManager.playSFX('reveal');
        App.showConfetti(50);
        App.showToast(`🎴 Kasus "${chosenCase.title}" berhasil ditetapkan & dikirim ke layar ${grp.name}!`, 'success');
        this.render();
      }
    };

    requestAnimationFrame(animate);
  },

  zoomCaseImage(caseId) {
    const c = DB.getCases().find(x => x.id === caseId);
    if (!c || !c.imageData) return;
    App.showModal(`
      <div style="padding:24px;text-align:center">
        <h3 style="margin-bottom:14px">${c.emoji} ${c.title}</h3>
        <img src="${c.imageData}" alt="${c.title}" style="max-width:100%;max-height:72vh;border-radius:14px;object-fit:contain">
      </div>
    `, 'lg');
  },
};
