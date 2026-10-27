// ============================================================
// POS2.JS — Pos 2: Pecahkan Tantangan
//           (Roda 1: Undian Urutan Kelompok & Roda 2: Kartu Kasus
//            + Teks Redaksi Studi Kasus & Lampiran Gambar JPG/PNG)
// ============================================================

const Pos2View = {
  // Roda 1 (Undian Kelompok)
  _groups: ['Kelompok 1 (Tunas)', 'Kelompok 2 (Akar)', 'Kelompok 3 (Dahan)', 'Kelompok 4 (Daun)', 'Kelompok 5 (Bunga)'],
  _remainingGroups: [],
  _turnOrder: [],
  _spinningGroup: false,
  _groupAngle: 0,
  _kelompokName: '',

  // Roda 2 (Undian Kasus)
  _spinning: false,
  _currentAngle: 0,
  _selectedCase: null,

  render() {
    const user = Auth.getCurrentUser();
    const backTarget = (user?.role === 'guru' || user?.role === 'admin') ? 'dashboard' : 'murid';

    if (this._remainingGroups.length === 0 && this._turnOrder.length === 0) {
      this._remainingGroups = [...this._groups];
    }

    const el = document.getElementById('view-pos2');
    el.innerHTML = `
      <div class="pos-layout">
        <!-- Header -->
        <div class="pos-header" style="background:linear-gradient(135deg,#1565C0,#0D47A1)">
          <button class="pos-back-btn" onclick="App.navigate('${backTarget}')">← Kembali</button>
          <div class="pos-header-content">
            <div class="pos-header-num">POS 2</div>
            <h1 class="pos-header-title">🎡 Pecahkan Tantangan</h1>
            <p class="pos-header-desc">Langkah 1: Putar Roda Undian Urutan Kelompok → Langkah 2: Putar Roda Kasus & Analisis Studi Kasus!</p>
          </div>
          ${(Auth.isGuru() || Auth.isAdmin()) ? `
            <button class="pos-back-btn" onclick="App.navigate('guru',{tab:'kasus'})">✏️ Kustomisasi Kasus & Gambar</button>
          ` : ''}
        </div>

        <div class="pos-content pos2-content">
          <!-- TAHAP 1: RODA PUTAR UNDIAN URUTAN MAJU KELOMPOK -->
          <div class="pos2-stage-card">
            <div class="pos2-stage-badge">TAHAP 1 — UNDIAN URUTAN MAJU KELOMPOK</div>
            <div class="pos2-group-wheel-grid">
              <!-- Roda 1 Canvas -->
              <div class="wheel-section">
                <h3 class="wheel-section-title">🎡 Roda 1: Undian Giliran Kelompok</h3>
                <div class="wheel-container">
                  <div class="wheel-pointer">▼</div>
                  <canvas id="wheel-group-canvas" width="340" height="340"></canvas>
                </div>
                <button class="btn-spin" id="btn-spin-group" onclick="Pos2View.spinGroupWheel()">
                  🎡 PUTAR UNDIAN KELOMPOK!
                </button>
                <p class="wheel-hint" id="group-wheel-hint">
                  Putar roda pertama ini untuk mengundi urutan maju kelompok!
                </p>
              </div>

              <!-- Panel Daftar Kelompok & Hasil Urutan Maju -->
              <div class="group-order-panel">
                <div class="group-manage-box">
                  <h4>👥 Daftar Kelompok Kelas</h4>
                  <p class="form-hint" style="margin-bottom:10px">Tambahkan atau sesuaikan nama kelompok sebelum memutar roda undian:</p>
                  <div class="kelompok-add-row">
                    <input type="text" id="new-group-input" class="form-input" placeholder="Ketik nama kelompok baru...">
                    <button class="btn-primary sm" onclick="Pos2View.addGroupToWheel()">➕ Tambah</button>
                    <button class="btn-secondary sm" onclick="Pos2View.resetGroupWheel()">🔄 Reset Undian</button>
                  </div>
                  <div class="murid-chips" id="remaining-groups-chips" style="margin-top:12px">
                    ${this._renderRemainingGroupChips()}
                  </div>
                </div>

                <div class="group-turn-result-box">
                  <h4>📋 Hasil Urutan Maju Kelompok</h4>
                  <div id="turn-order-list" class="turn-order-list">
                    ${this._renderTurnOrderList()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- TAHAP 2: RODA KASUS & STUDI KASUS -->
          <div class="pos2-main-area" id="pos2-main" style="${this._kelompokName ? 'display:block' : 'display:none'}">
            <div class="pos2-kelompok-display" id="kelompok-display">
              <div style="display:flex;align-items:center;gap:12px">
                <span class="pos2-stage-badge" style="margin:0;background:#43A047">TAHAP 2 — RODA KASUS</span>
                <span>👥 Giliran Kelompok Maju: <strong id="kelompok-label" style="color:#1565C0;font-size:1.1rem">${this._kelompokName}</strong></span>
              </div>
              <span class="badge-done">✅ Siap Memutar Roda Kasus</span>
            </div>

            <div class="pos2-split">
              <!-- Spinning Wheel 2 (Roda Kasus) -->
              <div class="wheel-section">
                <h3 class="wheel-section-title">🎡 Roda 2: Roda Kartu Kasus</h3>
                <div class="wheel-container">
                  <div class="wheel-pointer">▼</div>
                  <canvas id="wheel-canvas" width="360" height="360"></canvas>
                </div>
                <button class="btn-spin" id="btn-spin" onclick="Pos2View.spin()">
                  🎡 PUTAR RODA KASUS!
                </button>
                <p class="wheel-hint" id="wheel-hint">Klik tombol untuk mengacak 5 kartu kasus permasalahan!</p>
              </div>

              <!-- Case Display (Teks Redaksi + Lampiran Gambar JPG/PNG) -->
              <div class="case-section" id="case-section">
                <div class="case-empty" id="case-empty" style="${this._selectedCase ? 'display:none' : 'display:flex'}">
                  <div class="case-empty-icon">🎴</div>
                  <h3>Menunggu Putaran Roda Kasus</h3>
                  <p>Putar <strong>Roda 2: Roda Kartu Kasus</strong> di sebelah kiri untuk menampilkan studi kasus dan lampiran gambar!</p>
                </div>
                <div class="case-card-display" id="case-card-display" style="${this._selectedCase ? 'display:block' : 'display:none'}"></div>
              </div>
            </div>

            <!-- Lembar Jawaban 5 Pertanyaan Panduan Kelompok -->
            <div class="jawaban-section" id="jawaban-section" style="${this._selectedCase ? 'display:block' : 'display:none'}">
              <h3 class="jawaban-title">✍️ Lembar Analisis Kelompok — 5 Pertanyaan Panduan</h3>
              <div class="pertanyaan-list" id="pertanyaan-list"></div>
              <div class="jawaban-actions">
                <button class="btn-primary lg" onclick="Pos2View.submitJawaban()">✅ Simpan & Kirim Hasil Analisis Kelompok</button>
              </div>
            </div>
          </div>
        </div>
      </div>`;

    this._drawGroupWheel();
    this._drawWheel();
    if (this._selectedCase) {
      this._showCase(this._selectedCase, false);
    }
  },

  // ══════════════════════════════════════════════════════════
  // RODA 1: UNDIAN URUTAN KELOMPOK
  // ══════════════════════════════════════════════════════════
  _renderRemainingGroupChips() {
    if (this._remainingGroups.length === 0) {
      return `<span class="hint-text">Semua kelompok telah mendapat urutan maju! Klik "Reset Undian" untuk mengulang.</span>`;
    }
    return this._remainingGroups.map((g, i) => `
      <div class="murid-chip">
        <span>👥 ${g}</span>
        <button onclick="Pos2View.removeGroupFromWheel(${i})" style="border:none;background:none;color:#E53935;cursor:pointer;font-weight:900">✕</button>
      </div>
    `).join('');
  },

  _renderTurnOrderList() {
    if (this._turnOrder.length === 0) {
      return `<div class="empty-turn-state">Belum ada kelompok yang diundi. Putar Roda 1 untuk menentukan giliran maju!</div>`;
    }
    return this._turnOrder.map((g, idx) => `
      <div class="turn-order-item ${this._kelompokName === g ? 'active-turn' : ''}" onclick="Pos2View.selectGroupTurn('${g.replace(/'/g, "\\'")}')">
        <span class="turn-badge">Urutan ${idx + 1}</span>
        <strong style="flex:1">👥 ${g}</strong>
        <span class="turn-action">${this._kelompokName === g ? '🎯 Sedang Maju' : 'Pilih Maju →'}</span>
      </div>
    `).join('');
  },

  addGroupToWheel() {
    const inp = document.getElementById('new-group-input');
    const name = inp?.value.trim();
    if (!name) { App.showToast('Masukkan nama kelompok!', 'warning'); return; }
    this._groups.push(name);
    this._remainingGroups.push(name);
    inp.value = '';
    this.render();
  },

  removeGroupFromWheel(idx) {
    if (this._remainingGroups.length <= 1) {
      App.showToast('Minimal harus ada 1 kelompok di roda undian!', 'warning');
      return;
    }
    this._remainingGroups.splice(idx, 1);
    this.render();
  },

  resetGroupWheel() {
    this._remainingGroups = [...this._groups];
    this._turnOrder = [];
    this._kelompokName = '';
    this._selectedCase = null;
    this.render();
    App.showToast('Roda undian urutan kelompok telah direset!', 'info');
  },

  selectGroupTurn(name) {
    this._kelompokName = name;
    const mainArea = document.getElementById('pos2-main');
    const label = document.getElementById('kelompok-label');
    if (mainArea) mainArea.style.display = 'block';
    if (label) label.textContent = name;
    document.getElementById('turn-order-list').innerHTML = this._renderTurnOrderList();
    this._drawWheel();
    mainArea?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  },

  _drawGroupWheel(highlightIdx = -1) {
    const canvas = document.getElementById('wheel-group-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const list = this._remainingGroups.length > 0 ? this._remainingGroups : ['Semua Selesai'];
    const n = list.length;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const r = cx - 10;
    const sliceAngle = (2 * Math.PI) / n;

    const colors = ['#1E88E5', '#43A047', '#FB8C00', '#8E24AA', '#E53935', '#00897B', '#3949AB', '#F4511E'];

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    list.forEach((groupName, i) => {
      const startAngle = this._groupAngle + i * sliceAngle - Math.PI / 2;
      const endAngle = startAngle + sliceAngle;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = i === highlightIdx ? '#FFD600' : colors[i % colors.length];
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
      const shortName = groupName.length > 18 ? groupName.substring(0, 17) + '…' : groupName;
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
    if (this._remainingGroups.length === 0) {
      App.showToast('Semua kelompok sudah mendapat urutan! Klik Reset Undian untuk mengulang.', 'info');
      return;
    }

    this._spinningGroup = true;
    const btn = document.getElementById('btn-spin-group');
    if (btn) {
      btn.disabled = true;
      btn.textContent = '⏳ Mengundi Kelompok...';
    }

    const list = this._remainingGroups;
    const targetIdx = Math.floor(Math.random() * list.length);
    const sliceAngle = (2 * Math.PI) / list.length;
    const fullSpins = (5 + Math.floor(Math.random() * 4)) * 2 * Math.PI;
    const targetAngle = -(targetIdx * sliceAngle);
    const totalRotation = fullSpins + targetAngle;

    const duration = 3400;
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
      this._drawGroupWheel();

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        this._groupAngle = targetAngle;
        this._drawGroupWheel(targetIdx);
        this._spinningGroup = false;

        const chosenGroup = list[targetIdx];
        this._turnOrder.push(chosenGroup);
        this._remainingGroups.splice(targetIdx, 1);
        this._kelompokName = chosenGroup;

        if (btn) {
          btn.disabled = false;
          btn.textContent = this._remainingGroups.length > 0 ? '🎡 Undi Kelompok Berikutnya' : '✅ Semua Kelompok Terundi';
        }

        const hint = document.getElementById('group-wheel-hint');
        if (hint) {
          hint.innerHTML = `🎉 Giliran Maju Urutan #${this._turnOrder.length}: <strong>${chosenGroup}</strong>! Sekarang putar Roda Kasus di bawah!`;
        }

        document.getElementById('remaining-groups-chips').innerHTML = this._renderRemainingGroupChips();
        document.getElementById('turn-order-list').innerHTML = this._renderTurnOrderList();

        // Show Stage 2 (Roda Kasus)
        const mainArea = document.getElementById('pos2-main');
        const label = document.getElementById('kelompok-label');
        if (mainArea) mainArea.style.display = 'block';
        if (label) label.textContent = chosenGroup;
        this._drawWheel();

        App.showConfetti(35);
        App.showToast(`🎉 Urutan #${this._turnOrder.length}: ${chosenGroup}! Silakan putar Roda Kasus!`, 'success');

        setTimeout(() => {
          mainArea?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 400);
      }
    };

    requestAnimationFrame(animate);
  },

  // ══════════════════════════════════════════════════════════
  // RODA 2: RODA KARTU KASUS PERMASALAHAN
  // ══════════════════════════════════════════════════════════
  _drawWheel(highlightIdx = -1) {
    const canvas = document.getElementById('wheel-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const cases = DB.getCases();
    const n = cases.length;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const r = cx - 10;
    const sliceAngle = (2 * Math.PI) / n;

    const colors = ['#E53935', '#1E88E5', '#43A047', '#FB8C00', '#8E24AA', '#00ACC1', '#F4511E', '#6D4C41'];

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    cases.forEach((c, i) => {
      const startAngle = this._currentAngle + i * sliceAngle - Math.PI / 2;
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

  spin() {
    if (this._spinning) return;
    if (!this._kelompokName) {
      App.showToast('Putar Roda 1 (Undian Kelompok) terlebih dahulu!', 'warning');
      return;
    }

    this._spinning = true;
    const btn = document.getElementById('btn-spin');
    btn.disabled = true;
    btn.textContent = '⏳ Mengacak Kartu Kasus...';

    document.getElementById('case-empty').style.display = 'flex';
    document.getElementById('case-card-display').style.display = 'none';
    document.getElementById('jawaban-section').style.display = 'none';

    const cases = DB.getCases();
    const targetIdx = Math.floor(Math.random() * cases.length);
    const sliceAngle = (2 * Math.PI) / cases.length;

    const fullSpins = (5 + Math.floor(Math.random() * 5)) * 2 * Math.PI;
    const targetAngle = -(targetIdx * sliceAngle);
    const totalRotation = fullSpins + targetAngle;

    const duration = 3800;
    const startTime = performance.now();
    const startAngle = this._currentAngle;
    let lastTickSlice = -1;

    const animate = (now) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);

      this._currentAngle = startAngle + totalRotation * eased;
      const currentSlice = Math.floor(Math.abs(this._currentAngle) / (sliceAngle / 2));
      if (currentSlice !== lastTickSlice && typeof SoundManager !== 'undefined') {
        lastTickSlice = currentSlice;
        SoundManager.playSFX('tick');
      }
      this._drawWheel();

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        this._currentAngle = targetAngle;
        this._drawWheel(targetIdx);
        this._spinning = false;
        this._selectedCase = cases[targetIdx];
        this._showCase(cases[targetIdx], true);

        btn.disabled = false;
        btn.textContent = '🎡 Putar Ulang Roda Kasus';
        document.getElementById('wheel-hint').textContent = `🎉 Kartu Kasus Terpilih: "${cases[targetIdx].title}"!`;
      }
    };

    requestAnimationFrame(animate);
  },

  _showCase(caseObj, notify = true) {
    const empty = document.getElementById('case-empty');
    const display = document.getElementById('case-card-display');
    const jawaban = document.getElementById('jawaban-section');
    const pertanyaanList = document.getElementById('pertanyaan-list');

    if (empty) empty.style.display = 'none';
    if (display) display.style.display = 'block';
    if (jawaban) jawaban.style.display = 'block';

    if (display) {
      display.innerHTML = `
        <div class="case-card-result" style="border-top:5px solid ${caseObj.color}">
          <div class="case-card-top" style="background:${caseObj.bgGradient}">
            <div class="case-result-emoji">${caseObj.emoji}</div>
            <div class="case-result-badge">🎴 STUDI KASUS — ${this._kelompokName}</div>
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
        </div>`;
    }

    if (pertanyaanList) {
      pertanyaanList.innerHTML = (caseObj.pertanyaanPanduan || []).map((q, i) => `
        <div class="pertanyaan-item">
          <div class="pertanyaan-num">Pertanyaan Panduan ${i + 1}</div>
          <div class="pertanyaan-text">${q}</div>
          <textarea class="form-input jawaban-textarea" id="jawaban-${i}"
            placeholder="Tuliskan hasil diskusi kelompok kalian untuk pertanyaan ${i + 1} di sini..."></textarea>
        </div>`).join('');
    }

    if (notify) {
      App.showToast(`🎴 Kelompok "${this._kelompokName}" mendapat kasus: "${caseObj.title}"!`, 'success');
    }
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

  submitJawaban() {
    const user = Auth.getCurrentUser();
    if (!this._selectedCase) return;

    const answers = this._selectedCase.pertanyaanPanduan.map((_, i) =>
      document.getElementById(`jawaban-${i}`)?.value.trim() || ''
    );

    const empty = answers.filter(a => !a).length;
    if (empty > 2) {
      App.showToast('Mohon isi setidaknya 3 pertanyaan panduan!', 'warning');
      return;
    }

    if (user?.role === 'murid') {
      const scores = DB.getScoreByUser(user.id);
      const casesPlayed = scores.pos2?.casesPlayed || [];
      if (!casesPlayed.includes(this._selectedCase.id)) casesPlayed.push(this._selectedCase.id);

      DB.saveScore(user.id, 'pos2', {
        casesPlayed,
        completed: true,
        lastCase: this._selectedCase.id,
        jawaban: answers,
        kelompok: this._kelompokName,
      });

      MuridView.addPoin(user.id, 20);
      MuridView.awardBadge(user.id, 'pos2_done');
    }

    App.showConfetti(60);
    App.showModal(`
      <div class="success-modal">
        <div class="success-icon">🎉</div>
        <h2>Jawaban Kelompok Tersimpan!</h2>
        <p>Kerja hebat, <strong>${this._kelompokName}</strong>!</p>
        <p>Kalian telah menyelesaikan analisis kasus <strong>"${this._selectedCase.title}"</strong>! (+20 Poin)</p>
        <div class="success-actions">
          <button class="btn-primary" onclick="App.closeModal(); Pos2View.spinGroupWheel()">🎡 Undi Kelompok Berikutnya</button>
          <button class="btn-secondary" onclick="App.closeModal(); App.navigate('pos3')">Lanjut ke Pos 3 →</button>
        </div>
      </div>`);
  },
};
