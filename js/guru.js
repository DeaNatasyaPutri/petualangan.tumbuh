// ============================================================
// GURU.JS — Teacher Dashboard (Sinkronisasi Materi Pos 1,
//           Kustomisasi Kasus Pos 2, & Editor Kuis PG/Esai Pos 3)
// ============================================================

const GuruView = {
  _activeKuisSubtab: 'individu', // 'kelompok' | 'individu'
  _newQType: 'pg',               // 'pg' | 'esai'
  _currentTab: 'overview',
  _syncBound: false,

  render(tab = 'overview') {
    if (!this._syncBound && typeof RealtimeSync !== 'undefined') {
      this._syncBound = true;
      RealtimeSync.subscribe((msg) => {
        const viewEl = document.getElementById('view-guru');
        if (viewEl && viewEl.classList.contains('active') && this._currentTab === 'kelompok') {
          if (['GROUPS_UPDATED', 'POS2_CASE_ASSIGNED', 'POS2_LKK_TYPING', 'POS2_LKK_SUBMITTED', 'POS3_OPTION_SELECTED', 'POS3_ANSWER_SUBMITTED'].includes(msg.event)) {
            this._renderTab('kelompok');
          }
        }
      });
    }
    const el = document.getElementById('view-guru');
    el.innerHTML = `
      <div class="dashboard-layout">
        ${App.buildSidebar('guru', tab)}
        <main class="dashboard-main" id="guru-main">
          <div class="loading-spinner-center"><div class="spinner lg"></div></div>
        </main>
      </div>`;
    this._renderTab(tab);
  },

  _renderTab(tab) {
    this._currentTab = tab;
    const main = document.getElementById('guru-main');
    if (!main) return;
    switch (tab) {
      case 'overview': main.innerHTML = this._tabOverview(); break;
      case 'kelompok': main.innerHTML = this._tabKelompok(); break;
      case 'kelas':    main.innerHTML = this._tabKelas(); break;
      case 'materi':   main.innerHTML = this._tabMateri(); break;
      case 'kasus':    main.innerHTML = this._tabKasus(); break;
      case 'kuis':     main.innerHTML = this._tabKuis(); break;
      case 'hasil':    main.innerHTML = this._tabHasil(); break;
      default:         main.innerHTML = this._tabOverview(); break;
    }
  },

  // ══════════════════════════════════════════════════════════
  // 1. OVERVIEW TAB
  // ══════════════════════════════════════════════════════════
  _tabOverview() {
    const user = Auth.getCurrentUser();
    const kelas = DB.getKelas();
    const ownKelas = kelas.filter(k => k.guruId === user.id);
    const myKelas = (Auth.isAdmin() || ownKelas.length === 0) ? kelas : ownKelas;
    const myMurid = DB.getUsers().filter(u => u.role === 'murid' && (myKelas.some(k => k.muridIds?.includes(u.id)) || ownKelas.length === 0));
    const topics = DB.getTopics();
    const cases = DB.getCases();
    const totalSoal = DB.getKuisKejutan().length + DB.getTantanganAkhir().length;

    return `
      <div class="main-header">
        <div>
          <h1 class="main-title">🏠 Dasbor Guru</h1>
          <p class="main-subtitle">Halo, ${user.name}! Kelas ${user.kelas || '-'} — Pantang Menyerah, Terus Melangkah 🌟</p>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card stat-blue">
          <div class="stat-icon">🏫</div>
          <div class="stat-value">${myKelas.length}</div>
          <div class="stat-label">Kelas Diampu</div>
        </div>
        <div class="stat-card stat-green">
          <div class="stat-icon">🌱</div>
          <div class="stat-value">${myMurid.length}</div>
          <div class="stat-label">Total Murid</div>
        </div>
        <div class="stat-card stat-yellow">
          <div class="stat-icon">🔭</div>
          <div class="stat-value">${topics.length}</div>
          <div class="stat-label">Topik Materi Pos 1</div>
        </div>
        <div class="stat-card stat-purple">
          <div class="stat-icon">🏆</div>
          <div class="stat-value">${totalSoal}</div>
          <div class="stat-label">Total Soal Pos 3</div>
        </div>
      </div>

      <div class="guru-quick-actions">
        <h3>⚡ Menu Cepat Pengelolaan Pembelajaran & Sinkronisasi Real-Time</h3>
        <div class="quick-actions-grid">
          <button class="quick-action-btn green" onclick="GuruView.render('kelompok')">
            <span class="qa-icon">👥</span>
            <span>Manajemen Kelompok Belajar</span>
          </button>
          <button class="quick-action-btn blue" onclick="App.navigate('pos2')">
            <span class="qa-icon">🎡</span>
            <span>Kendali Roda Undian Kasus (Pos 2)</span>
          </button>
          <button class="quick-action-btn purple" onclick="GuruView.render('kasus')">
            <span class="qa-icon">🎴</span>
            <span>Edit Kasus & Gambar (Pos 2)</span>
          </button>
          <button class="quick-action-btn orange" onclick="GuruView.render('kuis')">
            <span class="qa-icon">🏆</span>
            <span>Susun Kuis PG & Esai (Pos 3)</span>
          </button>
        </div>
      </div>

      <div class="section-title">📚 Status Materi Pos 1 (Tersinkronisasi ke Murid)</div>
      <div class="materials-list">
        ${topics.map(t => `
          <div class="material-card">
            <div class="material-icon">${t.emoji || '📘'}</div>
            <div class="material-info">
              <strong>${t.title} <span class="badge-kelas">${t.level}</span></strong>
              <small>
                ${t.videoMediaId ? `🎬 Video Lokal (${t.videoFileName || 'Tersedia'})` : t.videoUrl ? '🎬 Video Terhubung' : '⚠️ Belum ada video'}
                •
                ${t.pdfMediaId ? `📄 Dokumen PDF (${t.pdfFileName || 'Tersedia'})` : '📄 Belum ada PDF'}
              </small>
            </div>
            <button class="btn-secondary sm" onclick="App.navigate('pos1')">👁️ Lihat di Pos 1</button>
          </div>`).join('')}
      </div>`;
  },

  // ══════════════════════════════════════════════════════════
  // 1B. MANAJEMEN KELOMPOK BELAJAR TAB (Manual Member Assignment + Live Status)
  // ══════════════════════════════════════════════════════════
  _tabKelompok() {
    const groups = DB.getGroups();
    const allMurid = DB.getUsers().filter(u => u.role === 'murid');
    const pos2State = DB.getPos2State();
    const pos3State = DB.getPos3GroupState();
    const cases = DB.getCases();

    // Find students not yet assigned to any group
    const assignedIds = new Set(groups.flatMap(g => g.memberIds || []));
    const unassignedMurid = allMurid.filter(m => !assignedIds.has(m.id));

    return `
      <div class="main-header">
        <div>
          <h1 class="main-title">👥 Manajemen Kelompok Belajar</h1>
          <p class="main-subtitle">Buat kelompok belajar, pilih dan tentukan akun murid secara manual ke dalam masing-masing kelompok, serta pantau kolaborasi Pos 2 & Pos 3 secara real-time.</p>
        </div>
        <div style="display:flex;gap:10px">
          <button class="btn-secondary" onclick="App.navigate('pos2')">🎡 Kendali Undian Roda Kasus (Pos 2)</button>
          <button class="btn-primary" onclick="GuruView.openCreateGroupModal()">➕ Buat Kelompok Baru</button>
        </div>
      </div>

      <!-- Unassigned Students Alert / Quick Info -->
      <div class="group-sync-banner">
        <div style="display:flex;align-items:center;gap:12px">
          <span style="font-size:1.8rem">📡</span>
          <div>
            <strong>Sinkronisasi Kelompok Aktif (Real-Time)</strong>
            <p style="font-size:0.86rem;color:var(--text-muted);margin-top:2px">
              Setiap murid yang masuk ke dalam kelompok hanya akan melihat studi kasus Pos 2 dan lembar jawab Kuis Kelompok Pos 3 milik kelompoknya sendiri.
              ${unassignedMurid.length > 0
                ? `<span style="color:#E65100;font-weight:800"> Terdapat ${unassignedMurid.length} akun murid yang belum masuk kelompok (${unassignedMurid.map(m => m.name).join(', ')}).</span>`
                : `<span style="color:#2E7D32;font-weight:800"> Semua akun murid (${allMurid.length} murid) sudah memiliki kelompok!</span>`}
            </p>
          </div>
        </div>
      </div>

      <!-- Groups Grid -->
      <div class="group-mgmt-grid">
        ${groups.map((g, idx) => {
          const members = allMurid.filter(m => (g.memberIds || []).includes(m.id));
          const assign = pos2State.assignments?.[g.id];
          const assignedCase = assign ? cases.find(c => c.id === assign.caseId) : null;
          const lkk = pos2State.lkk?.[g.id];
          const filledCount = lkk ? (lkk.answers || []).filter(a => a && a.trim().length > 0).length : 0;
          const gPos3 = pos3State[g.id] || { totalScore: 0, answers: {} };
          const answeredPos3Count = Object.keys(gPos3.answers || {}).length;

          return `
            <div class="group-mgmt-card" style="border-top: 6px solid ${g.color || '#1E88E5'}">
              <div class="group-mgmt-header">
                <div style="display:flex;align-items:center;gap:12px">
                  <div class="group-emoji-Circle" style="background:${g.color || '#1E88E5'}18;color:${g.color || '#1E88E5'}">${g.emoji || '🌱'}</div>
                  <div>
                    <span class="badge-kelas">Kelompok #${idx + 1} • Kelas ${g.kelas || '5A'}</span>
                    <h3 style="margin-top:3px;font-size:1.15rem">${g.name}</h3>
                  </div>
                </div>
                <div style="display:flex;gap:6px">
                  <button class="btn-secondary sm" onclick="GuruView.openEditGroupModal('${g.id}')">👥 Pilih Murid / Edit</button>
                  <button class="btn-icon del" title="Hapus Kelompok" onclick="GuruView.deleteGroupConfirm('${g.id}', '${g.name.replace(/'/g, "\\'")}')">🗑️</button>
                </div>
              </div>

              <!-- Daftar Akun Murid di Kelompok Ini -->
              <div class="group-members-box">
                <div class="group-box-label">
                  <span>👦👧 Anggota Kelompok (${members.length} Akun Murid)</span>
                  <button class="btn-link-sm" onclick="GuruView.openEditGroupModal('${g.id}')">+ Atur Anggota</button>
                </div>
                <div class="murid-chips" style="margin-top:8px">
                  ${members.map(m => `
                    <div class="murid-chip">
                      <span>${m.avatar || '👦'}</span>
                      <span><strong>${m.name}</strong> <small style="color:var(--text-muted)">(@${m.username})</small></span>
                    </div>
                  `).join('')}
                  ${members.length === 0 ? `<p class="hint-text">Belum ada murid dipilih. Klik "Pilih Murid / Edit" untuk memasukkan akun murid.</p>` : ''}
                </div>
              </div>

              <!-- Status Real-Time Pos 2 & Pos 3 -->
              <div class="group-status-row">
                <div class="group-status-item">
                  <span class="status-label">🎡 Status Undian Kasus (Pos 2)</span>
                  ${assignedCase ? `
                    <div class="status-val done">${assignedCase.emoji} ${assignedCase.title}</div>
                    <small>LKK Terisi: <strong>${filledCount}/5</strong> pertanyaan ${lkk?.submitted ? '✅ (Terkirim)' : '✍️ (Kolaborasi Aktif)'}</small>
                    ${filledCount > 0 ? `<button class="btn-secondary sm" style="margin-top:6px;width:100%" onclick="GuruView.inspectGroupLKK('${g.id}')">👁️ Lihat Jawaban LKK Kelompok</button>` : ''}
                  ` : `
                    <div class="status-val pending">⏳ Belum Diundi Guru</div>
                    <small>Layar murid menunggu putaran roda Guru di Pos 2</small>
                  `}
                </div>

                <div class="group-status-item">
                  <span class="status-label">🏆 Kuis Kelompok (Pos 3)</span>
                  <div class="status-val score" style="color:${g.color || '#1E88E5'}">⭐ ${gPos3.totalScore || 0} Poin</div>
                  <small>Soal Terjawab: <strong>${answeredPos3Count}</strong> soal</small>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  openCreateGroupModal() {
    const allMurid = DB.getUsers().filter(u => u.role === 'murid');
    const groups = DB.getGroups();

    App.showModal(`
      <div class="modal-form">
        <h3>➕ Buat Kelompok Belajar Baru</h3>
        <div class="ai-config-row">
          <div class="form-group">
            <label class="form-label">Nama Kelompok</label>
            <input class="form-input" id="grp-name" placeholder="Contoh: Kelompok 4 (Bunga Matahari)">
          </div>
          <div class="form-group">
            <label class="form-label">Ikon Emoji & Warna Identitas</label>
            <div style="display:flex;gap:10px">
              <input class="form-input" id="grp-emoji" value="🌻" style="width:80px;text-align:center">
              <select class="form-input" id="grp-color">
                <option value="#43A047">🟢 Hijau Tumbuh</option>
                <option value="#1E88E5">🔵 Biru Samudra</option>
                <option value="#FB8C00">🟠 Oranye Semangat</option>
                <option value="#8E24AA">🟣 Ungu Kreatif</option>
                <option value="#E53935">🔴 Merah Berani</option>
                <option value="#00897B">🩵 Toska Harmoni</option>
              </select>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Pilih Manual Akun Murid untuk Masuk ke Kelompok Ini:</label>
          <p class="form-hint" style="margin-bottom:8px">Centang akun murid yang ingin dimasukkan ke kelompok ini (jika murid sudah ada di kelompok lain, otomatis dipindahkan ke kelompok ini):</p>
          <div class="murid-select-list">
            ${allMurid.map(m => {
              const currGrp = groups.find(g => (g.memberIds || []).includes(m.id));
              return `
                <label class="murid-select-item">
                  <input type="checkbox" class="grp-member-cb" value="${m.id}">
                  <span>${m.avatar || '👦'} <strong>${m.name}</strong> <small>(@${m.username} • Kelas ${m.kelas})</small></span>
                  <span style="margin-left:auto;font-size:0.78rem;padding:3px 8px;border-radius:8px;background:${currGrp ? '#E3F2FD' : '#FFF8E1'};color:${currGrp ? '#1565C0' : '#E65100'};font-weight:800">
                    ${currGrp ? `Saat ini: ${currGrp.name}` : 'Belum punya kelompok'}
                  </span>
                </label>
              `;
            }).join('')}
          </div>
        </div>

        <div class="modal-actions">
          <button class="btn-secondary" onclick="App.closeModal()">Batal</button>
          <button class="btn-primary" onclick="GuruView.saveGroupModal(null)">💾 Buat Kelompok & Simpan Anggota</button>
        </div>
      </div>
    `, 'lg');
  },

  openEditGroupModal(groupId) {
    const grp = DB.getGroupById(groupId);
    if (!grp) return;
    const allMurid = DB.getUsers().filter(u => u.role === 'murid');
    const groups = DB.getGroups();

    App.showModal(`
      <div class="modal-form">
        <h3>👥 Kelola Kelompok & Pilih Anggota Murid: ${grp.name}</h3>
        <div class="ai-config-row">
          <div class="form-group">
            <label class="form-label">Nama Kelompok</label>
            <input class="form-input" id="grp-name" value="${grp.name}">
          </div>
          <div class="form-group">
            <label class="form-label">Ikon Emoji & Warna Identitas</label>
            <div style="display:flex;gap:10px">
              <input class="form-input" id="grp-emoji" value="${grp.emoji || '🌱'}" style="width:80px;text-align:center">
              <select class="form-input" id="grp-color">
                <option value="#43A047" ${grp.color === '#43A047' ? 'selected' : ''}>🟢 Hijau Tumbuh</option>
                <option value="#1E88E5" ${grp.color === '#1E88E5' ? 'selected' : ''}>🔵 Biru Samudra</option>
                <option value="#FB8C00" ${grp.color === '#FB8C00' ? 'selected' : ''}>🟠 Oranye Semangat</option>
                <option value="#8E24AA" ${grp.color === '#8E24AA' ? 'selected' : ''}>🟣 Ungu Kreatif</option>
                <option value="#E53935" ${grp.color === '#E53935' ? 'selected' : ''}>🔴 Merah Berani</option>
                <option value="#00897B" ${grp.color === '#00897B' ? 'selected' : ''}>🩵 Toska Harmoni</option>
              </select>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Pilih Akun Murid yang Masuk ke Kelompok "${grp.name}":</label>
          <p class="form-hint" style="margin-bottom:8px">Centang atau hapus centang untuk mengatur anggota kelompok secara manual:</p>
          <div class="murid-select-list">
            ${allMurid.map(m => {
              const isMember = (grp.memberIds || []).includes(m.id);
              const otherGrp = groups.find(g => g.id !== grp.id && (g.memberIds || []).includes(m.id));
              return `
                <label class="murid-select-item">
                  <input type="checkbox" class="grp-member-cb" value="${m.id}" ${isMember ? 'checked' : ''}>
                  <span>${m.avatar || '👦'} <strong>${m.name}</strong> <small>(@${m.username} • Kelas ${m.kelas})</small></span>
                  <span style="margin-left:auto;font-size:0.78rem;padding:3px 8px;border-radius:8px;background:${isMember ? '#E8F5E9' : otherGrp ? '#ECEFF1' : '#FFF8E1'};color:${isMember ? '#2E7D32' : otherGrp ? '#546E7A' : '#E65100'};font-weight:800">
                    ${isMember ? '✅ Anggota Kelompok Ini' : otherGrp ? `Di ${otherGrp.name}` : 'Belum punya kelompok'}
                  </span>
                </label>
              `;
            }).join('')}
          </div>
        </div>

        <div class="modal-actions">
          <button class="btn-secondary" onclick="App.closeModal()">Batal</button>
          <button class="btn-primary" onclick="GuruView.saveGroupModal('${grp.id}')">💾 Simpan Perubahan Kelompok</button>
        </div>
      </div>
    `, 'lg');
  },

  saveGroupModal(groupId) {
    const name = document.getElementById('grp-name')?.value.trim();
    const emoji = document.getElementById('grp-emoji')?.value.trim() || '🌱';
    const color = document.getElementById('grp-color')?.value || '#43A047';
    const selectedMemberIds = [...document.querySelectorAll('.grp-member-cb:checked')].map(cb => cb.value);

    if (!name) {
      App.showToast('Nama kelompok wajib diisi!', 'error');
      return;
    }

    if (groupId) {
      DB.updateGroup(groupId, { name, emoji, color, memberIds: selectedMemberIds });
      App.showToast(`Kelompok "${name}" (${selectedMemberIds.length} murid) berhasil diperbarui!`, 'success');
    } else {
      DB.addGroup({ name, emoji, color, kelas: '5A', memberIds: selectedMemberIds });
      App.showToast(`Kelompok baru "${name}" berhasil dibuat!`, 'success');
    }

    App.closeModal();
    this.render('kelompok');
  },

  deleteGroupConfirm(groupId, groupName) {
    App.showModal(`
      <div class="modal-confirm">
        <div class="confirm-icon">🗑️</div>
        <h3>Hapus Kelompok "${groupName}"?</h3>
        <p>Apakah Anda yakin ingin menghapus kelompok ini? Akun murid di dalamnya tidak akan terhapus.</p>
        <div class="confirm-actions">
          <button class="btn-secondary" onclick="App.closeModal()">Batal</button>
          <button class="btn-danger" onclick="GuruView.doDeleteGroup('${groupId}')">Ya, Hapus Kelompok</button>
        </div>
      </div>
    `);
  },

  doDeleteGroup(groupId) {
    DB.deleteGroup(groupId);
    App.closeModal();
    App.showToast('Kelompok berhasil dihapus!', 'success');
    this.render('kelompok');
  },

  inspectGroupLKK(groupId) {
    const grp = DB.getGroupById(groupId);
    const pos2State = DB.getPos2State();
    const assign = pos2State.assignments?.[groupId];
    const caseObj = assign ? DB.getCases().find(c => c.id === assign.caseId) : null;
    const lkk = pos2State.lkk?.[groupId] || { answers: ['', '', '', '', ''] };

    if (!grp || !caseObj) return;

    App.showModal(`
      <div class="modal-form">
        <h3>📋 Hasil Lembar Kerja Kelompok (LKK) — ${grp.emoji} ${grp.name}</h3>
        <p style="color:var(--text-muted);font-size:0.9rem">
          Studi Kasus: <strong>${caseObj.emoji} ${caseObj.title}</strong> •
          Status: <strong>${lkk.submitted ? `✅ Sudah Dikirim (oleh ${lkk.submittedBy})` : `✍️ Sedang Dikerjakan (Terakhir diketik oleh ${lkk.lastTypedBy || '-'})`}</strong>
        </p>
        <div style="display:flex;flex-direction:column;gap:12px;max-height:55vh;overflow-y:auto;padding-right:6px">
          ${(caseObj.pertanyaanPanduan || []).map((q, i) => `
            <div style="background:#F8FAFC;border-left:4px solid ${grp.color || '#1E88E5'};padding:12px 16px;border-radius:10px">
              <div style="font-size:0.8rem;font-weight:800;color:${grp.color || '#1E88E5'}">Pertanyaan ${i + 1}</div>
              <div style="font-weight:800;margin:2px 0 6px">${q}</div>
              <div style="background:#fff;padding:10px 12px;border-radius:8px;border:1px solid #E2E8F0;white-space:pre-wrap;font-size:0.92rem">
                ${lkk.answers?.[i] ? lkk.answers[i] : '<em style="color:#94A3B8">(Belum diisi)</em>'}
              </div>
            </div>
          `).join('')}
        </div>
        <div class="modal-actions">
          <button class="btn-primary" onclick="App.closeModal()">Tutup</button>
        </div>
      </div>
    `, 'lg');
  },

  // ══════════════════════════════════════════════════════════
  // 2. KELOLA KELAS TAB
  // ══════════════════════════════════════════════════════════
  _tabKelas() {
    const user = Auth.getCurrentUser();
    const allKelas = DB.getKelas();
    const ownKelas = allKelas.filter(k => k.guruId === user.id);
    const myKelas = (Auth.isAdmin() || ownKelas.length === 0) ? allKelas : ownKelas;
    const allUsers = DB.getUsers();

    return `
      <div class="main-header">
        <div>
          <h1 class="main-title">🏫 Kelola Kelas</h1>
          <p class="main-subtitle">Atur daftar murid di setiap kelas pembelajaran.</p>
        </div>
      </div>
      ${myKelas.map(k => {
        const muridInKelas = allUsers.filter(u => u.role === 'murid' && k.muridIds?.includes(u.id));
        return `
        <div class="kelas-card">
          <div class="kelas-card-header">
            <h3>🏫 ${k.name}</h3>
            <span class="badge-murid">${muridInKelas.length} Murid</span>
          </div>
          <div class="murid-chips">
            ${muridInKelas.map(m => `
              <div class="murid-chip">
                <span>${m.avatar}</span>
                <span>${m.name}</span>
                <small class="chip-poin">${m.poin || 0} ⭐</small>
              </div>`).join('')}
            ${muridInKelas.length === 0 ? '<p class="hint-text">Belum ada murid terdaftar</p>' : ''}
          </div>
          <button class="btn-secondary sm" onclick="GuruView.addMuridToKelas('${k.id}')">➕ Kelola Anggota Kelas</button>
        </div>`;
      }).join('')}`;
  },

  // ══════════════════════════════════════════════════════════
  // 3. MATERI POS 1 TAB (Sinkronisasi File Lokal Video, PDF, Link, & Gambar)
  // ══════════════════════════════════════════════════════════
  _tabMateri() {
    const topics = DB.getTopics();
    const materials = DB.getMaterials();

    return `
      <div class="main-header">
        <div>
          <h1 class="main-title">📤 Manajemen & Riwayat Materi (Video, PDF, Gambar, & Link)</h1>
          <p class="main-subtitle">Unggah file Video (MP4/WebM), Dokumen PDF, Gambar Kasus JPG/PNG, atau Tautan Video Web. Semua unggahan langsung tersimpan, terlihat di riwayat, dan tersinkronisasi real-time ke seluruh perangkat!</p>
        </div>
        <div style="display:flex;gap:10px">
          <button class="btn-secondary" onclick="App.navigate('pos1')">🔭 Pratinjau Pos 1 Murid</button>
          <button class="btn-secondary" onclick="App.navigate('pos2')">🎡 Pratinjau Pos 2 Murid</button>
        </div>
      </div>

      <!-- Formulir Unggah Materi Baru -->
      <div class="materi-upload-card">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <h3 style="margin:0">📤 Unggah & Lampirkan Materi Baru</h3>
          <span class="badge-done" style="background:#E8F5E9;color:#2E7D32;font-size:0.8rem">⚡ Sinkronisasi Instan Aktif</span>
        </div>

        <div class="ai-config-row">
          <div class="form-group">
            <label class="form-label">Target Sinkronisasi Pembelajaran</label>
            <select class="form-input" id="sync-target-mode" onchange="GuruView.toggleSyncTargetMode()">
              <option value="existing">🔗 Perbarui / Lampirkan ke Topik Pos 1 yang Ada</option>
              <option value="new">➕ Buat sebagai Kartu Topik Baru di Pos 1</option>
            </select>
          </div>
          <div class="form-group" id="sync-existing-topic-wrap">
            <label class="form-label">Pilih Topik Pos 1</label>
            <select class="form-input" id="sync-topic-id" onchange="GuruView.fillTopicPreview()">
              ${topics.map(t => `<option value="${t.id}">${t.emoji} ${t.title} (${t.level})</option>`).join('')}
            </select>
          </div>
        </div>

        <div id="sync-new-topic-fields" style="display:none" class="new-topic-box">
          <div class="ai-config-row">
            <div class="form-group">
              <label class="form-label">Judul Topik Baru</label>
              <input class="form-input" id="new-topic-title" placeholder="Contoh: Daur Hidup Hewan & Metamorfosis">
            </div>
            <div class="form-group">
              <label class="form-label">Ikon Emoji & Level</label>
              <div style="display:flex;gap:10px">
                <input class="form-input" id="new-topic-emoji" value="🦋" style="width:90px;text-align:center">
                <select class="form-input" id="new-topic-level">
                  <option value="Dasar">Dasar</option>
                  <option value="Menengah">Menengah</option>
                  <option value="Lanjutan">Lanjutan</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Deskripsi / Keterangan Materi</label>
          <textarea class="form-input" id="sync-topic-desc" rows="2" placeholder="Ringkasan materi pembelajaran untuk murid...">${topics[0]?.description || ''}</textarea>
        </div>

        <div class="upload-dual-grid">
          <!-- Upload Video Lokal / URL Link -->
          <div class="upload-box">
            <div class="upload-box-header">
              <span class="upload-box-icon">🎬</span>
              <div>
                <h4>File Video Lokal atau Tautan Web</h4>
                <small>Pilih file video (.mp4 / .webm) atau tempel tautan video YouTube</small>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Unggah File Video Lokal (MP4 / WebM)</label>
              <input type="file" class="form-input file-input" id="sync-video-file" accept="video/mp4,video/webm,video/ogg,video/*">
            </div>
            <div class="form-group">
              <label class="form-label">Atau Masukkan URL / Tautan Video YouTube</label>
              <input type="text" class="form-input" id="sync-video-url" value="${DB.toWatchUrl(topics[0]?.videoUrl) || ''}" placeholder="https://www.youtube.com/watch?v=...">
            </div>
          </div>

          <!-- Upload PDF Lokal -->
          <div class="upload-box">
            <div class="upload-box-header">
              <span class="upload-box-icon">📄</span>
              <div>
                <h4>File Dokumen Modul (PDF)</h4>
                <small>Pilih file dokumen (.pdf) dari perangkat Anda</small>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Unggah File Dokumen PDF Lokal (.pdf)</label>
              <input type="file" class="form-input file-input" id="sync-pdf-file" accept="application/pdf,.pdf">
            </div>
            <div class="form-hint" style="margin-top:8px">
              💡 File PDF otomatis dapat dibaca langsung oleh Murid di Pos 1 melalui Viewer PDF internal.
            </div>
          </div>
        </div>

        <div class="modal-actions" style="justify-content:flex-start;margin-top:8px">
          <button class="btn-primary lg" id="btn-save-sync-materi" onclick="GuruView.saveSyncedMateri()">
            💾 Unggah & Sinkronkan Sekarang
          </button>
        </div>
      </div>

      <!-- Riwayat Unggahan Materi (PDF, Video, Link, & Gambar) -->
      ${this._renderRiwayatUnggahan(materials)}

      <!-- Daftar Topik & Materi Aktif di Pos 1 -->
      <div class="section-title">📚 Daftar Topik & Materi Aktif di Pos 1 (${topics.length} Topik)</div>
      <div class="materials-list">
        ${topics.map(t => `
          <div class="material-card">
            <div class="material-icon">${t.emoji}</div>
            <div class="material-info">
              <strong>${t.title} <span class="badge-kelas">${t.level}</span></strong>
              <p style="font-size:0.86rem;color:var(--text-muted);margin:2px 0">${t.description}</p>
              <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:4px">
                ${t.videoUrl ? `<span class="badge-done" style="background:#E8F5E9;color:#2E7D32">🎬 Tautan Video: Tersedia</span>` : ''}
                ${t.videoMediaId ? `<span class="badge-done" style="background:#FFF3E0;color:#E65100">📁 Video File: ${t.videoFileName || 'Tersedia'}</span>` : ''}
                ${!t.videoUrl && !t.videoMediaId ? `<span class="badge-pending">🎬 Belum ada video</span>` : ''}
                ${t.pdfMediaId
                  ? `<span class="badge-done" style="background:#E3F2FD;color:#1565C0">📄 PDF: ${t.pdfFileName || 'Tersedia'}</span>`
                  : `<span class="badge-pending">📄 Belum ada PDF</span>`}
              </div>
            </div>
            <div class="gen-quiz-actions">
              <button class="btn-secondary sm" onclick="Pos1View.openMediaModal('${t.id}', 'video')">▶️ Cek Video</button>
              ${t.videoUrl ? `<a href="${DB.toWatchUrl(t.videoUrl)}" target="_blank" rel="noopener noreferrer" class="btn-secondary sm" style="text-decoration:none;display:inline-flex;align-items:center;gap:4px">↗ YouTube</a>` : ''}
              ${t.pdfMediaId ? `<button class="btn-secondary sm" onclick="Pos1View.openMediaModal('${t.id}', 'pdf')">📄 Cek PDF</button>` : ''}
              <button class="btn-icon del" title="Hapus Topik" onclick="GuruView.deleteTopicPos1('${t.id}', '${t.title.replace(/'/g, "\\'")}')">🗑️</button>
            </div>
          </div>`).join('')}
      </div>`;
  },

  _renderRiwayatUnggahan(materials) {
    const filter = this._materialFilter || 'all';
    const search = (this._materialSearch || '').toLowerCase();

    const filtered = materials.filter(m => {
      const type = m.type || (m.pdfMediaId ? 'pdf' : (m.videoMediaId ? 'video' : (m.url ? 'link' : 'image')));
      if (filter === 'pdf' && type !== 'pdf') return false;
      if (filter === 'video' && type !== 'video') return false;
      if (filter === 'link' && type !== 'link') return false;
      if (filter === 'image' && type !== 'image') return false;

      if (search) {
        const text = `${m.title || ''} ${m.fileName || ''} ${m.topicTitle || ''} ${m.url || ''}`.toLowerCase();
        if (!text.includes(search)) return false;
      }
      return true;
    });

    const pdfCount = materials.filter(m => (m.type === 'pdf' || m.pdfMediaId)).length;
    const videoCount = materials.filter(m => (m.type === 'video' || m.videoMediaId)).length;
    const linkCount = materials.filter(m => (m.type === 'link' || (m.url && !m.videoMediaId))).length;
    const imageCount = materials.filter(m => (m.type === 'image' || m.imageData)).length;

    return `
      <div class="materi-history-card" style="background:var(--white);border-radius:20px;padding:24px;box-shadow:var(--shadow);margin-bottom:28px">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:12px">
          <div>
            <h3 style="margin:0;display:flex;align-items:center;gap:10px">
              <span>🕒 Riwayat Unggahan Materi & Dokumen</span>
              <span class="badge-done" style="font-size:0.8rem">${materials.length} Item Tersimpan</span>
            </h3>
            <p class="form-hint" style="margin-top:4px">
              Seluruh riwayat berkas PDF, Video, Gambar, atau Tautan yang pernah Anda unggah tetap tersimpan permanen di sini dan tersinkronisasi real-time.
            </p>
          </div>
        </div>

        <!-- Filter & Search Toolbar -->
        <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;margin:16px 0">
          <div class="filter-pills" style="display:flex;gap:8px;flex-wrap:wrap">
            <button class="filter-pill ${filter === 'all' ? 'active' : ''}" onclick="GuruView.setMaterialFilter('all')">
              Semua (${materials.length})
            </button>
            <button class="filter-pill ${filter === 'pdf' ? 'active' : ''}" onclick="GuruView.setMaterialFilter('pdf')">
              📄 Dokumen PDF (${pdfCount})
            </button>
            <button class="filter-pill ${filter === 'video' ? 'active' : ''}" onclick="GuruView.setMaterialFilter('video')">
              🎬 Video Lokal (${videoCount})
            </button>
            <button class="filter-pill ${filter === 'link' ? 'active' : ''}" onclick="GuruView.setMaterialFilter('link')">
              🔗 Tautan Video (${linkCount})
            </button>
            <button class="filter-pill ${filter === 'image' ? 'active' : ''}" onclick="GuruView.setMaterialFilter('image')">
              🖼️ Gambar (${imageCount})
            </button>
          </div>

          <div style="flex:1;min-width:240px">
            <input type="text" class="form-input" id="history-search-input" value="${this._materialSearch || ''}" placeholder="🔍 Cari nama file, judul materi, atau topik..." oninput="GuruView.setMaterialSearch(this.value)">
          </div>
        </div>

        <!-- Materials List -->
        <div class="materials-list" id="history-materials-list">
          ${filtered.length > 0 ? filtered.map((m, idx) => {
            const type = m.type || (m.pdfMediaId ? 'pdf' : (m.videoMediaId ? 'video' : (m.url ? 'link' : 'image')));
            const iconMap = { pdf: '📄', video: '🎬', link: '🔗', image: '🖼️' };
            const typeLabelMap = { pdf: 'Dokumen PDF', video: 'Video Lokal', link: 'Tautan Video', image: 'Lampiran Gambar' };
            const badgeBg = { pdf: '#E3F2FD', video: '#E8F5E9', link: '#FFF3E0', image: '#F3E5F5' };
            const badgeColor = { pdf: '#1565C0', video: '#2E7D32', link: '#E65100', image: '#7B1FA2' };

            return `
              <div class="material-card" style="border-left: 5px solid ${badgeColor[type] || '#1565C0'}">
                <div class="material-icon">${iconMap[type] || '📁'}</div>
                <div class="material-info">
                  <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
                    <span class="badge-done" style="background:${badgeBg[type]};color:${badgeColor[type]};font-weight:800;font-size:0.78rem">
                      ${iconMap[type]} ${typeLabelMap[type]}
                    </span>
                    <strong>${m.title}</strong>
                    <span class="badge-done" style="background:#E8F5E9;color:#2E7D32;font-size:0.75rem">⚡ Tersinkron</span>
                  </div>
                  <div style="font-size:0.86rem;color:var(--text-muted);display:flex;gap:14px;flex-wrap:wrap;margin-top:4px">
                    ${m.topicTitle ? `<span>📌 Terhubung: <strong>${m.topicTitle}</strong></span>` : ''}
                    ${m.fileName ? `<span>📁 File: <code>${m.fileName}</code></span>` : ''}
                    ${m.fileSize ? `<span>⚖️ Ukuran: ${m.fileSize}</span>` : ''}
                    <span>⏱️ ${App.formatDate(m.createdAt)} (${App.timeAgo(m.createdAt)})</span>
                    <span>👤 Pengunggah: ${m.uploaderName || 'Guru'}</span>
                  </div>
                </div>
                <div class="gen-quiz-actions">
                  <button class="btn-primary sm" onclick="GuruView.previewMaterial('${m.id}')">
                    👁️ Pratinjau
                  </button>
                  ${(m.url || m.watchUrl) ? `
                    <a href="${DB.toWatchUrl(m.watchUrl || m.url)}" target="_blank" rel="noopener noreferrer" class="btn-secondary sm" style="text-decoration:none;display:inline-flex;align-items:center;gap:4px">
                      ↗ YouTube
                    </a>
                  ` : ''}
                  <button class="btn-icon del" title="Hapus dari Riwayat" onclick="GuruView.deleteMaterialPrompt('${m.id}')">
                    🗑️
                  </button>
                </div>
              </div>
            `;
          }).join('') : `
            <div class="empty-state" style="padding:28px 20px">
              <span style="font-size:2.5rem">📂</span>
              <p style="margin-top:6px;font-weight:700">Belum ada riwayat unggahan yang cocok.</p>
              <small style="color:var(--text-muted)">File PDF, Video, Link, atau Gambar yang Anda unggah akan otomatis tercatat dan tersimpan rapi di sini.</small>
            </div>
          `}
        </div>
      </div>
    `;
  },

  setMaterialFilter(filter) {
    this._materialFilter = filter;
    this.render('materi');
  },

  setMaterialSearch(query) {
    this._materialSearch = query;
    const q = (query || '').toLowerCase();
    const cards = document.querySelectorAll('#history-materials-list .material-card');
    cards.forEach(c => {
      const text = c.textContent.toLowerCase();
      c.style.display = (!q || text.includes(q)) ? 'flex' : 'none';
    });
  },

  _formatFileSize(bytes) {
    if (!bytes || isNaN(bytes)) return '-';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  },

  async previewMaterial(mId) {
    const materials = DB.getMaterials();
    const m = materials.find(x => x.id === mId);
    if (!m) return;

    if (m.pdfMediaId || m.type === 'pdf') {
      const mediaId = m.pdfMediaId;
      let pdfObj = mediaId ? await MediaDB.getFileUrl(mediaId) : null;
      if (pdfObj && pdfObj.url) {
        App.showModal(`
          <div class="video-modal">
            <div class="video-modal-header" style="background:linear-gradient(135deg,#1565C0,#0D47A1)">
              <span class="video-modal-emoji">📄</span>
              <div style="flex:1">
                <h2>${m.title}</h2>
                <p>Dokumen PDF Modul Pembelajaran • File: ${pdfObj.name || m.fileName || 'materi.pdf'}</p>
              </div>
            </div>
            <div class="internal-pdf-stage">
              <embed src="${pdfObj.url}#toolbar=1&navpanes=1&scrollbar=1" type="application/pdf" class="internal-pdf-viewer" />
            </div>
            <div class="video-modal-footer">
              <span class="tag">📄 ${pdfObj.name || 'Dokumen PDF'}</span>
              <div style="display:flex;gap:10px">
                <a href="${pdfObj.url}" download="${pdfObj.name || 'materi.pdf'}" class="btn-secondary sm" style="text-decoration:none">⬇️ Unduh PDF</a>
                <button class="btn-primary" onclick="App.closeModal()">Tutup</button>
              </div>
            </div>
          </div>`, 'xl');
        return;
      }
    }

    if (m.videoMediaId || (m.type === 'video' && m.videoMediaId)) {
      const videoObj = await MediaDB.getFileUrl(m.videoMediaId);
      if (videoObj && videoObj.url) {
        if (typeof SoundManager !== 'undefined') SoundManager.pauseBGMForMedia(true);
        App.showModal(`
          <div class="video-modal">
            <div class="video-modal-header" style="background:linear-gradient(135deg,#2E7D32,#1B5E20)">
              <span class="video-modal-emoji">🎬</span>
              <div style="flex:1">
                <h2>${m.title}</h2>
                <p>Video Pembelajaran Internal • File: ${videoObj.name || m.fileName || 'video.mp4'}</p>
              </div>
            </div>
            <div class="internal-media-stage">
              <video controls autoplay class="internal-video-player" src="${videoObj.url}">Browser Anda tidak mendukung video HTML5.</video>
            </div>
            <div class="video-modal-footer">
              <span class="tag">🎬 ${videoObj.name || 'Video'}</span>
              <div style="display:flex;gap:10px">
                <a href="${videoObj.url}" download="${videoObj.name || 'video.mp4'}" class="btn-secondary sm" style="text-decoration:none">⬇️ Unduh Video</a>
                <button class="btn-primary" onclick="App.closeModal()">Tutup</button>
              </div>
            </div>
          </div>`, 'xl');
        return;
      }
    }

    if (m.url || m.type === 'link') {
      const embedUrl = DB.getVideoPlayerSrc(m.url || m.watchUrl, true);
      const watchUrl = DB.toWatchUrl(m.watchUrl || m.url);
      const isFileProtocol = (typeof window !== 'undefined' && window.location && window.location.protocol === 'file:');
      App.showModal(`
        <div class="video-modal">
          <div class="video-modal-header" style="background:linear-gradient(135deg,#E65100,#BF360C)">
            <span class="video-modal-emoji">🎬</span>
            <div style="flex:1">
              <h2>${m.title}</h2>
              <p>Pratinjau Video YouTube Pembelajaran</p>
            </div>
          </div>
          <div class="video-player-stage" style="padding:16px">
            <div class="video-wrapper" style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;background:#000;box-shadow:0 8px 24px rgba(0,0,0,0.18)">
              <iframe
                src="${embedUrl}"
                frameborder="0"
                allowfullscreen
                referrerpolicy="strict-origin-when-cross-origin"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;">
              </iframe>
            </div>
            <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-top:12px;padding:10px 14px;background:#FFF3E0;border:1px solid #FFE0B2;border-radius:10px;">
              <div style="display:flex;align-items:center;gap:8px">
                <span style="font-size:1.2rem">📺</span>
                <div>
                  <strong style="font-size:0.88rem;color:#E65100;display:block">Tautan: ${watchUrl}</strong>
                  <small style="color:#666">Video berputar langsung. Jika ada batasan browser, gunakan tombol di samping.</small>
                </div>
              </div>
              <div style="display:flex;gap:8px;flex-wrap:wrap">
                ${isFileProtocol ? `
                  <a href="http://127.0.0.1:8765/index.html#guru" target="_blank" class="btn-primary sm" style="background:#2E7D32;border-color:#2E7D32;text-decoration:none;display:inline-flex;align-items:center;gap:6px;font-weight:700">
                    🌐 Buka Server Lokal ↗
                  </a>
                ` : ''}
                <a href="${watchUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary sm" style="background:#CC0000;border-color:#CC0000;text-decoration:none;display:inline-flex;align-items:center;gap:6px;font-weight:700">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  Buka di YouTube ↗
                </a>
              </div>
            </div>
          </div>
          <div class="video-modal-footer">
            <span class="tag">🎬 Video YouTube</span>
            <button class="btn-primary" onclick="App.closeModal()">Tutup</button>
          </div>
        </div>`, 'xl');
      return;
    }

    if (m.imageData || m.type === 'image') {
      App.showModal(`
        <div class="modal-box" style="text-align:center">
          <h3>🖼️ ${m.title}</h3>
          <div style="margin:16px 0">
            <img src="${m.imageData}" alt="Preview" style="max-width:100%;max-height:60vh;border-radius:12px;box-shadow:var(--shadow)">
          </div>
          <button class="btn-primary" onclick="App.closeModal()">Tutup</button>
        </div>`, 'md');
      return;
    }

    App.showToast('Pratinjau berkas materi tidak tersedia.', 'warning');
  },

  deleteMaterialPrompt(mId) {
    const materials = DB.getMaterials();
    const m = materials.find(x => x.id === mId);
    if (!m) return;

    App.showModal(`
      <div class="modal-confirm">
        <div class="confirm-icon">🗑️</div>
        <h3>Hapus dari Riwayat Unggahan?</h3>
        <p>Apakah Anda yakin ingin menghapus <strong>${m.title}</strong> dari riwayat unggahan ini?</p>
        <div class="confirm-actions">
          <button class="btn-secondary" onclick="App.closeModal()">Batal</button>
          <button class="btn-danger" onclick="GuruView.doDeleteMaterial('${m.id}')">Ya, Hapus</button>
        </div>
      </div>`);
  },

  doDeleteMaterial(mId) {
    DB.deleteMaterial(mId);
    App.closeModal();
    App.showToast('Materi berhasil dihapus dari riwayat unggahan!', 'success');
    this.render('materi');
  },

  toggleSyncTargetMode() {
    const mode = document.getElementById('sync-target-mode').value;
    document.getElementById('sync-existing-topic-wrap').style.display = mode === 'existing' ? 'flex' : 'none';
    document.getElementById('sync-new-topic-fields').style.display = mode === 'new' ? 'block' : 'none';
    if (mode === 'existing') {
      this.fillTopicPreview();
    } else {
      document.getElementById('sync-topic-desc').value = '';
      document.getElementById('sync-video-url').value = '';
    }
  },

  fillTopicPreview() {
    const id = document.getElementById('sync-topic-id')?.value;
    const topic = DB.getTopics().find(t => t.id === id);
    if (!topic) return;
    const descEl = document.getElementById('sync-topic-desc');
    const urlEl = document.getElementById('sync-video-url');
    if (descEl) descEl.value = topic.description || '';
    if (urlEl) urlEl.value = DB.toWatchUrl(topic.videoUrl) || '';
  },

  async saveSyncedMateri() {
    const user = Auth.getCurrentUser();
    const mode = document.getElementById('sync-target-mode').value;
    const desc = document.getElementById('sync-topic-desc')?.value.trim() || '';
    const videoFileInput = document.getElementById('sync-video-file');
    const pdfFileInput = document.getElementById('sync-pdf-file');
    const videoFile = videoFileInput?.files?.[0];
    const pdfFile = pdfFileInput?.files?.[0];
    const videoUrlInput = document.getElementById('sync-video-url')?.value.trim() || '';

    const btn = document.getElementById('btn-save-sync-materi');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> Menyimpan & Menyinkronkan...';

    try {
      // Parallel fast local saves (each takes <10ms)
      const [savedVideoMeta, savedPdfMeta] = await Promise.all([
        videoFile ? MediaDB.saveFile(videoFile) : Promise.resolve(null),
        pdfFile ? MediaDB.saveFile(pdfFile) : Promise.resolve(null)
      ]);

      if (mode === 'existing') {
        const topicId = document.getElementById('sync-topic-id').value;
        const topic = DB.getTopics().find(t => t.id === topicId);
        if (!topic) throw new Error('Topik tidak ditemukan');

        const updates = {
          description: desc || topic.description,
        };
        if (savedVideoMeta) {
          updates.videoMediaId = savedVideoMeta.id;
          updates.videoFileName = savedVideoMeta.name;
        } else if (videoUrlInput) {
          // If teacher explicitly provided a video URL and no new video file was uploaded,
          // clear previous videoMediaId so the new video URL is 100% active and played for students!
          updates.videoMediaId = null;
          updates.videoFileName = null;
        }

        if (videoUrlInput) {
          updates.videoUrl = DB.toEmbedUrl(videoUrlInput);
        }
        if (savedPdfMeta) {
          updates.pdfMediaId = savedPdfMeta.id;
          updates.pdfFileName = savedPdfMeta.name;
        }

        DB.updateTopic(topicId, updates);

        // Record history for whatever was uploaded/linked
        if (savedPdfMeta) {
          DB.addMaterial({
            title: `${topic.title} — ${savedPdfMeta.name}`,
            type: 'pdf',
            topicId: topic.id,
            topicTitle: topic.title,
            pdfMediaId: savedPdfMeta.id,
            fileName: savedPdfMeta.name,
            fileSize: this._formatFileSize(savedPdfMeta.size),
            guruId: user?.id || 'u2',
            uploaderName: user?.name || 'Guru'
          });
        }
        if (savedVideoMeta) {
          DB.addMaterial({
            title: `${topic.title} — ${savedVideoMeta.name}`,
            type: 'video',
            topicId: topic.id,
            topicTitle: topic.title,
            videoMediaId: savedVideoMeta.id,
            fileName: savedVideoMeta.name,
            fileSize: this._formatFileSize(savedVideoMeta.size),
            guruId: user?.id || 'u2',
            uploaderName: user?.name || 'Guru'
          });
        }
        if (videoUrlInput && !savedVideoMeta) {
          DB.addMaterial({
            title: `${topic.title} (Tautan Video YouTube)`,
            type: 'link',
            topicId: topic.id,
            topicTitle: topic.title,
            url: DB.toEmbedUrl(videoUrlInput),
            watchUrl: DB.toWatchUrl(videoUrlInput),
            fileName: DB.toWatchUrl(videoUrlInput),
            fileSize: 'Tautan YouTube',
            guruId: user?.id || 'u2',
            uploaderName: user?.name || 'Guru'
          });
        }

        App.showToast(`Materi pada topik "${topic.title}" berhasil diunggah & tersinkron real-time!`, 'success');
      } else {
        const title = document.getElementById('new-topic-title').value.trim();
        const emoji = document.getElementById('new-topic-emoji').value.trim() || '📘';
        const level = document.getElementById('new-topic-level').value;

        if (!title) {
          App.showToast('Judul topik baru wajib diisi!', 'error');
          btn.disabled = false;
          btn.innerHTML = '💾 Unggah & Sinkronkan Sekarang';
          return;
        }
        if (!savedVideoMeta && !videoUrlInput && !savedPdfMeta) {
          App.showToast('Unggah minimal 1 file Video, Dokumen PDF, atau masukkan URL Video!', 'error');
          btn.disabled = false;
          btn.innerHTML = '💾 Unggah & Sinkronkan Sekarang';
          return;
        }

        const palette = [
          { color: '#2E7D32', bg: 'linear-gradient(135deg, #43A047, #1B5E20)' },
          { color: '#1565C0', bg: 'linear-gradient(135deg, #29B6F6, #01579B)' },
          { color: '#E65100', bg: 'linear-gradient(135deg, #FF7043, #BF360C)' },
          { color: '#6A1B9A', bg: 'linear-gradient(135deg, #AB47BC, #4A148C)' },
        ];
        const pick = palette[Math.floor(Math.random() * palette.length)];

        const newTopic = DB.addTopic({
          title,
          description: desc || `Materi pembelajaran ${title}`,
          emoji,
          color: pick.color,
          bgGradient: pick.bg,
          videoUrl: videoUrlInput ? this._toEmbedUrl(videoUrlInput) : '',
          videoMediaId: savedVideoMeta ? savedVideoMeta.id : null,
          videoFileName: savedVideoMeta ? savedVideoMeta.name : null,
          pdfMediaId: savedPdfMeta ? savedPdfMeta.id : null,
          pdfFileName: savedPdfMeta ? savedPdfMeta.name : null,
          tags: [title, 'IPA', 'Kelas 5'],
          level
        });

        if (savedPdfMeta) {
          DB.addMaterial({
            title: `${title} — ${savedPdfMeta.name}`,
            type: 'pdf',
            topicId: newTopic.id,
            topicTitle: title,
            pdfMediaId: savedPdfMeta.id,
            fileName: savedPdfMeta.name,
            fileSize: this._formatFileSize(savedPdfMeta.size),
            guruId: user?.id || 'u2',
            uploaderName: user?.name || 'Guru'
          });
        }
        if (savedVideoMeta) {
          DB.addMaterial({
            title: `${title} — ${savedVideoMeta.name}`,
            type: 'video',
            topicId: newTopic.id,
            topicTitle: title,
            videoMediaId: savedVideoMeta.id,
            fileName: savedVideoMeta.name,
            fileSize: this._formatFileSize(savedVideoMeta.size),
            guruId: user?.id || 'u2',
            uploaderName: user?.name || 'Guru'
          });
        }
        if (videoUrlInput && !savedVideoMeta) {
          DB.addMaterial({
            title: `${title} (Tautan Video YouTube)`,
            type: 'link',
            topicId: newTopic.id,
            topicTitle: title,
            url: DB.toEmbedUrl(videoUrlInput),
            watchUrl: DB.toWatchUrl(videoUrlInput),
            fileName: DB.toWatchUrl(videoUrlInput),
            fileSize: 'Tautan YouTube',
            guruId: user?.id || 'u2',
            uploaderName: user?.name || 'Guru'
          });
        }

        App.showToast(`Topik baru "${title}" berhasil dibuat & langsung tayang di Pos 1!`, 'success');
      }

      // Reset form inputs
      if (videoFileInput) videoFileInput.value = '';
      if (pdfFileInput) pdfFileInput.value = '';
      const urlInput = document.getElementById('sync-video-url');
      if (urlInput) urlInput.value = '';

      this.render('materi');
    } catch (err) {
      console.error(err);
      App.showToast('Gagal menyimpan file: ' + err.message, 'error');
      btn.disabled = false;
      btn.innerHTML = '💾 Unggah & Sinkronkan Sekarang';
    }
  },

  deleteTopicPos1(id, title) {
    App.showModal(`
      <div class="modal-confirm">
        <div class="confirm-icon">🗑️</div>
        <h3>Hapus Topik dari Pos 1?</h3>
        <p>Apakah Anda yakin ingin menghapus topik <strong>${title}</strong> dari Pos 1 Murid?</p>
        <div class="confirm-actions">
          <button class="btn-secondary" onclick="App.closeModal()">Batal</button>
          <button class="btn-danger" onclick="GuruView.doDeleteTopicPos1('${id}')">Ya, Hapus</button>
        </div>
      </div>`);
  },

  doDeleteTopicPos1(id) {
    DB.deleteTopic(id);
    App.closeModal();
    App.showToast('Topik berhasil dihapus dari Pos 1!', 'success');
    this.render('materi');
  },

  _toEmbedUrl(url) {
    return DB.toEmbedUrl(url);
  },

  // ══════════════════════════════════════════════════════════
  // 4. KUSTOMISASI KASUS POS 2 TAB (Teks Kasus & Gambar JPG/PNG)
  // ══════════════════════════════════════════════════════════
  _tabKasus() {
    const cases = DB.getCases();

    return `
      <div class="main-header">
        <div>
          <h1 class="main-title">🎡 Kustomisasi Kartu Kasus Pos 2</h1>
          <p class="main-subtitle">Sesuaikan teks redaksi studi kasus, lampiran gambar lokal (JPG/PNG), dan 5 pertanyaan panduan analisis untuk Pos 2.</p>
        </div>
        <button class="btn-secondary" onclick="App.navigate('pos2')">🎡 Pratinjau Pos 2 Murid</button>
      </div>

      <div class="cases-editor-grid">
        ${cases.map((c, idx) => `
          <div class="case-editor-card" style="border-top: 5px solid ${c.color}">
            <div class="case-editor-header">
              <div style="display:flex;align-items:center;gap:12px">
                <span class="case-editor-emoji">${c.emoji}</span>
                <div>
                  <span class="badge-kelas">Kartu Kasus #${idx + 1}</span>
                  <h3 style="margin-top:4px">${c.title}</h3>
                </div>
              </div>
              <button class="btn-primary sm" onclick="GuruView.openEditCaseModal('${c.id}')">✏️ Edit Kasus & Gambar</button>
            </div>

            <div class="case-editor-body">
              ${c.imageData ? `
                <div class="case-editor-img-preview">
                  <img src="${c.imageData}" alt="${c.title}">
                  <span class="img-badge">🖼️ Lampiran Gambar Aktif</span>
                </div>
              ` : `
                <div class="case-editor-no-img">
                  <span>🖼️ Belum ada lampiran gambar JPG/PNG (Menggunakan ikon default ${c.emoji})</span>
                </div>
              `}
              <p class="case-editor-desc">${c.deskripsi}</p>
              <div class="case-editor-questions">
                <strong>5 Pertanyaan Panduan Kelompok:</strong>
                <ol>
                  ${(c.pertanyaanPanduan || []).map(q => `<li>${q}</li>`).join('')}
                </ol>
              </div>
            </div>
          </div>
        `).join('')}
      </div>`;
  },

  openEditCaseModal(caseId) {
    const c = DB.getCases().find(x => x.id === caseId);
    if (!c) return;

    App.showModal(`
      <div class="modal-form">
        <h3>✏️ Edit Kartu Kasus Pos 2: ${c.title}</h3>
        <div class="ai-config-row">
          <div class="form-group">
            <label class="form-label">Judul Kasus Permasalahan</label>
            <input class="form-input" id="ec-title" value="${c.title}">
          </div>
          <div class="form-group">
            <label class="form-label">Ikon Emoji</label>
            <input class="form-input" id="ec-emoji" value="${c.emoji}" style="width:100px;text-align:center">
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Teks Redaksi Studi Kasus</label>
          <textarea class="form-input" id="ec-desc" rows="5" placeholder="Tulis cerita/redaksi studi kasus permasalahan di sini...">${c.deskripsi}</textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Unggah Lampiran Gambar Studi Kasus (Format JPG / PNG)</label>
          <input type="file" class="form-input file-input" id="ec-image-file" accept="image/jpeg,image/png,.jpg,.jpeg,.png" onchange="GuruView.previewCaseImage(this)">
          <div id="ec-image-preview-wrap" style="margin-top:8px;${c.imageData ? 'display:flex' : 'display:none'};align-items:center;gap:14px">
            <img id="ec-image-preview" src="${c.imageData || ''}" alt="Preview" style="height:90px;border-radius:10px;border:2px solid #ddd;object-fit:cover">
            <button type="button" class="btn-danger sm" onclick="GuruView.clearCaseImage()">🗑️ Hapus Gambar</button>
          </div>
          <input type="hidden" id="ec-image-data" value="${c.imageData || ''}">
        </div>

        <div class="form-group">
          <label class="form-label">5 Pertanyaan Panduan Analisis Kelompok</label>
          ${[0,1,2,3,4].map(i => `
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
              <span class="badge-kelas" style="min-width:28px;text-align:center">${i + 1}</span>
              <input class="form-input" id="ec-q-${i}" value="${c.pertanyaanPanduan?.[i] || ''}" placeholder="Pertanyaan panduan ${i + 1}...">
            </div>
          `).join('')}
        </div>

        <div class="modal-actions">
          <button class="btn-secondary" onclick="App.closeModal()">Batal</button>
          <button class="btn-primary" onclick="GuruView.saveEditedCase('${c.id}')">💾 Simpan Perubahan Kasus</button>
        </div>
      </div>
    `, 'lg');
  },

  previewCaseImage(input) {
    const file = input.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      App.showToast('Format gambar harus JPG atau PNG!', 'error');
      input.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      document.getElementById('ec-image-data').value = dataUrl;
      const preview = document.getElementById('ec-image-preview');
      const wrap = document.getElementById('ec-image-preview-wrap');
      if (preview) preview.src = dataUrl;
      if (wrap) wrap.style.display = 'flex';
    };
    reader.readAsDataURL(file);
  },

  clearCaseImage() {
    document.getElementById('ec-image-data').value = '';
    const fileInp = document.getElementById('ec-image-file');
    if (fileInp) fileInp.value = '';
    const wrap = document.getElementById('ec-image-preview-wrap');
    if (wrap) wrap.style.display = 'none';
  },

  saveEditedCase(caseId) {
    const title = document.getElementById('ec-title').value.trim();
    const emoji = document.getElementById('ec-emoji').value.trim() || '🎴';
    const deskripsi = document.getElementById('ec-desc').value.trim();
    const imageData = document.getElementById('ec-image-data').value || null;
    const pertanyaanPanduan = [0,1,2,3,4].map(i => document.getElementById(`ec-q-${i}`).value.trim()).filter(Boolean);

    if (!title || !deskripsi) {
      App.showToast('Judul dan teks redaksi kasus wajib diisi!', 'error');
      return;
    }
    if (pertanyaanPanduan.length < 5) {
      App.showToast('Mohon lengkapi kelima pertanyaan panduan!', 'warning');
      return;
    }

    DB.updateCase(caseId, { title, emoji, deskripsi, imageData, pertanyaanPanduan });
    App.closeModal();
    App.showToast(`Kartu kasus "${title}" berhasil diperbarui!`, 'success');
    this.render('kasus');
  },

  // ══════════════════════════════════════════════════════════
  // 5. KELOLA KUIS POS 3 TAB (Pilihan Ganda & Esai)
  // ══════════════════════════════════════════════════════════
  _tabKuis() {
    const kuisKelompok = DB.getKuisKejutan();
    const kuisIndividu = DB.getTantanganAkhir();
    const pgCount = kuisIndividu.filter(q => (q.type || 'pg') === 'pg').length;
    const esaiCount = kuisIndividu.filter(q => q.type === 'esai').length;

    return `
      <div class="main-header">
        <div>
          <h1 class="main-title">🏆 Penyusunan Kuis Pos 3 (Pilihan Ganda & Esai)</h1>
          <p class="main-subtitle">Kelola soal Kuis Kelompok (dengan jeda 15 detik sebelum opsi muncul) dan Kuis Individu (Pilihan Ganda & Esai).</p>
        </div>
        <button class="btn-secondary" onclick="App.navigate('pos3')">🏆 Pratinjau Pos 3 Murid</button>
      </div>

      <div class="materi-type-tabs" style="margin-bottom:22px">
        <button class="materi-type-btn ${this._activeKuisSubtab === 'individu' ? 'active' : ''}" onclick="GuruView.switchKuisSubtab('individu')">
          👤 Kuis Individu — Pilihan Ganda & Esai (${kuisIndividu.length} Soal: ${pgCount} PG, ${esaiCount} Esai)
        </button>
        <button class="materi-type-btn ${this._activeKuisSubtab === 'kelompok' ? 'active' : ''}" onclick="GuruView.switchKuisSubtab('kelompok')">
          👥 Kuis Kelompok — Kuis Kejutan (${kuisKelompok.length} Soal)
        </button>
      </div>

      ${this._activeKuisSubtab === 'individu' ? this._renderKuisIndividuManager(kuisIndividu) : this._renderKuisKelompokManager(kuisKelompok)}
    `;
  },

  switchKuisSubtab(subtab) {
    this._activeKuisSubtab = subtab;
    this.render('kuis');
  },

  _renderKuisIndividuManager(questions) {
    return `
      <div class="materi-upload-card">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <h3>➕ Tambah Soal Baru — Kuis Individu (Tantangan Akhir)</h3>
          <div class="materi-type-tabs" style="margin-bottom:0">
            <button class="ai-src-btn ${this._newQType === 'pg' ? 'active' : ''}" onclick="GuruView.setNewQType('pg')">🔘 Soal Pilihan Ganda</button>
            <button class="ai-src-btn ${this._newQType === 'esai' ? 'active' : ''}" onclick="GuruView.setNewQType('esai')">✍️ Soal Esai / Uraian</button>
          </div>
        </div>

        <div class="ai-config-row">
          <div class="form-group">
            <label class="form-label">Pertanyaan Soal (${this._newQType === 'pg' ? 'Pilihan Ganda' : 'Esai'})</label>
            <textarea class="form-input" id="ta-new-q" rows="3" placeholder="Tulis pertanyaan soal di sini..."></textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Durasi Timer Soal (Detik)</label>
            <input type="number" class="form-input" id="ta-new-time" value="${this._newQType === 'pg' ? 30 : 90}" min="10" max="300">
            <small class="form-hint">Soal otomatis berpindah saat waktu habis.</small>
          </div>
        </div>

        ${this._newQType === 'pg' ? `
          <div class="ai-config-row">
            <div class="form-group">
              <label class="form-label">Pilihan A</label>
              <input class="form-input" id="ta-opt-0" placeholder="Teks pilihan A...">
            </div>
            <div class="form-group">
              <label class="form-label">Pilihan B</label>
              <input class="form-input" id="ta-opt-1" placeholder="Teks pilihan B...">
            </div>
            <div class="form-group">
              <label class="form-label">Pilihan C</label>
              <input class="form-input" id="ta-opt-2" placeholder="Teks pilihan C...">
            </div>
            <div class="form-group">
              <label class="form-label">Pilihan D</label>
              <input class="form-input" id="ta-opt-3" placeholder="Teks pilihan D...">
            </div>
          </div>
          <div class="form-group" style="max-width:260px">
            <label class="form-label">Kunci Jawaban Benar</label>
            <select class="form-input" id="ta-new-ans">
              <option value="0">A</option>
              <option value="1">B</option>
              <option value="2">C</option>
              <option value="3">D</option>
            </select>
          </div>
        ` : `
          <div class="form-group">
            <label class="form-label">Pedoman / Kunci Jawaban Esai</label>
            <textarea class="form-input" id="ta-new-kunci-esai" rows="3" placeholder="Tuliskan referensi jawaban benar untuk soal esai ini..."></textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Kata Kunci Penilaian Otomatis (pisahkan dengan koma)</label>
            <input class="form-input" id="ta-new-katakunci" placeholder="Contoh: produsen, fotosintesis, matahari, oksigen">
            <small class="form-hint">Digunakan untuk membantu penyekoran otomatis serta pedoman koreksi Guru.</small>
          </div>
        `}

        <div>
          <button class="btn-primary" onclick="GuruView.addTantanganQuestion()">💾 Tambahkan ke Kuis Individu</button>
        </div>
      </div>

      <div class="section-title">📋 Daftar Soal Kuis Individu (${questions.length} Soal)</div>
      <div class="materials-list">
        ${questions.map((q, idx) => `
          <div class="material-card">
            <div class="ai-q-num" style="background:${q.type === 'esai' ? '#8E24AA' : '#1565C0'}">${idx + 1}</div>
            <div class="material-info">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
                <span class="q-babak ${q.type === 'esai' ? 'badge-penentuan' : 'badge-utama'}">
                  ${q.type === 'esai' ? '✍️ SOAL ESAI' : '🔘 PILIHAN GANDA'}
                </span>
                <span class="badge-pending">⏱️ ${q.waktu || 30} detik</span>
              </div>
              <strong>${q.pertanyaan}</strong>
              ${q.type === 'esai' ? `
                <small style="color:#2E7D32">🔑 Referensi Jawaban: ${q.kunciEsai || '-'}</small>
              ` : `
                <small>Pilihan: ${(q.pilihan || []).map((p, pi) => `${'ABCD'[pi]}. ${p}${pi === q.jawaban ? ' ✅' : ''}`).join(' | ')}</small>
              `}
            </div>
            <div class="gen-quiz-actions">
              <button class="btn-icon del" onclick="GuruView.deleteTantanganQuestion('${q.id}')">🗑️</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  setNewQType(type) {
    this._newQType = type;
    this.render('kuis');
  },

  addTantanganQuestion() {
    const pertanyaan = document.getElementById('ta-new-q').value.trim();
    const waktu = parseInt(document.getElementById('ta-new-time').value) || 30;
    if (!pertanyaan) { App.showToast('Pertanyaan soal wajib diisi!', 'error'); return; }

    const list = DB.getTantanganAkhir();
    if (this._newQType === 'pg') {
      const pilihan = [0,1,2,3].map(i => document.getElementById(`ta-opt-${i}`).value.trim());
      if (pilihan.some(p => !p)) { App.showToast('Semua pilihan A, B, C, D wajib diisi!', 'error'); return; }
      const jawaban = parseInt(document.getElementById('ta-new-ans').value) || 0;
      list.push({
        id: 'ta_' + Date.now(),
        no: list.length + 1,
        type: 'pg',
        pertanyaan,
        pilihan,
        jawaban,
        waktu
      });
    } else {
      const kunciEsai = document.getElementById('ta-new-kunci-esai').value.trim();
      const rawKata = document.getElementById('ta-new-katakunci').value.trim();
      if (!kunciEsai) { App.showToast('Pedoman jawaban esai wajib diisi!', 'error'); return; }
      const kataKunci = rawKata ? rawKata.split(',').map(s => s.trim().toLowerCase()).filter(Boolean) : [];
      list.push({
        id: 'ta_' + Date.now(),
        no: list.length + 1,
        type: 'esai',
        pertanyaan,
        kunciEsai,
        kataKunci,
        waktu
      });
    }

    DB.saveTantanganAkhir(list);
    App.showToast('Soal berhasil ditambahkan ke Kuis Individu!', 'success');
    this.render('kuis');
  },

  deleteTantanganQuestion(id) {
    const list = DB.getTantanganAkhir().filter(q => q.id !== id);
    DB.saveTantanganAkhir(list);
    App.showToast('Soal dihapus!', 'success');
    this.render('kuis');
  },

  _renderKuisKelompokManager(questions) {
    const kkQType = this._newKKQType || 'pg';
    return `
      <div class="materi-upload-card">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
          <h3>➕ Tambah Soal Baru — Kuis Kelompok (Kuis Kejutan)</h3>
          <div class="materi-type-tabs" style="margin-bottom:0">
            <button class="ai-src-btn ${kkQType === 'pg' ? 'active' : ''}" onclick="GuruView.setNewKKQType('pg')">🔘 Soal Pilihan Ganda</button>
            <button class="ai-src-btn ${kkQType === 'esai' ? 'active' : ''}" onclick="GuruView.setNewKKQType('esai')">✍️ Soal Esai</button>
          </div>
        </div>
        <p class="form-hint">💡 Pada Kuis Kelompok, setiap soal menampilkan hitung mundur visual 15 detik di bagian atas layar.</p>

        <div class="ai-config-row">
          <div class="form-group">
            <label class="form-label">Pertanyaan Kompetisi Kelompok (${kkQType === 'pg' ? 'Pilihan Ganda' : 'Esai'})</label>
            <textarea class="form-input" id="kk-new-q" rows="2" placeholder="Tulis pertanyaan kuis kelompok..."></textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Babak Kompetisi ${kkQType === 'pg' ? '& Kunci Jawaban' : ''}</label>
            <div style="display:flex;gap:10px">
              <select class="form-input" id="kk-new-babak">
                <option value="utama" ${kkQType === 'pg' ? 'selected' : ''}>🔵 Babak Utama</option>
                <option value="penentuan" ${kkQType === 'esai' ? 'selected' : ''}>🔴 Babak Penentuan</option>
              </select>
              ${kkQType === 'pg' ? `
                <select class="form-input" id="kk-new-ans">
                  <option value="0">Kunci: A</option>
                  <option value="1">Kunci: B</option>
                  <option value="2">Kunci: C</option>
                  <option value="3">Kunci: D</option>
                </select>
              ` : ''}
            </div>
          </div>
        </div>

        ${kkQType === 'pg' ? `
          <div class="ai-config-row">
            <div class="form-group"><label class="form-label">Pilihan A</label><input class="form-input" id="kk-opt-0"></div>
            <div class="form-group"><label class="form-label">Pilihan B</label><input class="form-input" id="kk-opt-1"></div>
            <div class="form-group"><label class="form-label">Pilihan C</label><input class="form-input" id="kk-opt-2"></div>
            <div class="form-group"><label class="form-label">Pilihan D</label><input class="form-input" id="kk-opt-3"></div>
          </div>

          <div class="form-group">
            <label class="form-label">Penjelasan Jawaban Benar</label>
            <input class="form-input" id="kk-new-exp" placeholder="Penjelasan singkat yang muncul setelah soal dijawab...">
          </div>
        ` : `
          <div class="form-group">
            <label class="form-label">Kunci Jawaban Esai</label>
            <textarea class="form-input" id="kk-new-kunci-esai" rows="2" placeholder="Tulis kunci jawaban esai kelompok..."></textarea>
          </div>
        `}

        <div>
          <button class="btn-primary" onclick="GuruView.addKuisKelompokQuestion()">💾 Tambahkan ke Kuis Kelompok</button>
        </div>
      </div>

      <div class="section-title">📋 Daftar Soal Kuis Kelompok (${questions.length} Soal)</div>
      <div class="materials-list">
        ${questions.map((q, idx) => `
          <div class="material-card">
            <div class="ai-q-num" style="background:${q.type === 'esai' ? '#8E24AA' : '#1565C0'}">${idx + 1}</div>
            <div class="material-info">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
                <span class="q-babak badge-${q.babak}">${q.babak === 'utama' ? '🔵 Babak Utama' : '🔴 Babak Penentuan'}</span>
                <span class="badge-pending">${q.type === 'esai' ? '✍️ Soal Esai' : '🔘 Pilihan Ganda'}</span>
              </div>
              <strong style="white-space:pre-line">${q.pertanyaan}</strong>
              ${q.type === 'esai'
                ? `<small style="color:#2E7D32">🔑 Kunci Jawaban: ${q.kunciEsai || q.penjelasan || '-'}</small>`
                : `<small>Pilihan: ${(q.pilihan || []).map((p, pi) => `${'ABCD'[pi]}. ${p}${pi === q.jawaban ? ' ✅' : ''}`).join(' | ')}</small>`}
            </div>
            <button class="btn-icon del" onclick="GuruView.deleteKuisKelompokQuestion('${q.id}')">🗑️</button>
          </div>
        `).join('')}
      </div>
    `;
  },

  setNewKKQType(type) {
    this._newKKQType = type;
    this.render('kuis');
  },

  addKuisKelompokQuestion() {
    const kkQType = this._newKKQType || 'pg';
    const pertanyaan = document.getElementById('kk-new-q').value.trim();
    const babak = document.getElementById('kk-new-babak').value;
    if (!pertanyaan) {
      App.showToast('Pertanyaan soal wajib diisi!', 'error');
      return;
    }

    const list = DB.getKuisKejutan();
    if (kkQType === 'esai') {
      const kunciEsai = document.getElementById('kk-new-kunci-esai')?.value.trim() || '';
      if (!kunciEsai) {
        App.showToast('Kunci jawaban esai wajib diisi!', 'error');
        return;
      }
      list.push({
        id: 'kk_' + Date.now(),
        no: list.length + 1,
        babak,
        type: 'esai',
        pertanyaan,
        kunciEsai,
        penjelasan: kunciEsai,
        kataKunci: kunciEsai.toLowerCase().split(/[\s,.;]+/).filter(w => w.length >= 4)
      });
    } else {
      const jawaban = parseInt(document.getElementById('kk-new-ans').value) || 0;
      const penjelasan = document.getElementById('kk-new-exp').value.trim();
      const pilihan = [0,1,2,3].map(i => document.getElementById(`kk-opt-${i}`).value.trim());

      if (pilihan.some(p => !p)) {
        App.showToast('Pertanyaan dan keempat pilihan jawaban wajib diisi!', 'error');
        return;
      }

      list.push({
        id: 'kk_' + Date.now(),
        no: list.length + 1,
        babak,
        type: 'pg',
        pertanyaan,
        pilihan,
        jawaban,
        penjelasan
      });
    }

    DB.saveKuisKejutan(list);
    App.showToast('Soal Kuis Kelompok berhasil ditambahkan!', 'success');
    this.render('kuis');
  },

  deleteKuisKelompokQuestion(id) {
    const list = DB.getKuisKejutan().filter(q => q.id !== id);
    DB.saveKuisKejutan(list);
    App.showToast('Soal Kuis Kelompok dihapus!', 'success');
    this.render('kuis');
  },

  // ══════════════════════════════════════════════════════════
  // 6. HASIL MURID TAB
  // ══════════════════════════════════════════════════════════
  _tabHasil() {
    const user = Auth.getCurrentUser();
    const kelas = DB.getKelas();
    const ownKelas = kelas.filter(k => k.guruId === user.id);
    const myKelas = (Auth.isAdmin() || ownKelas.length === 0) ? kelas : ownKelas;
    const allUsers = DB.getUsers();
    const scores = DB.getScores();

    const myMurid = allUsers.filter(u =>
      u.role === 'murid' && (myKelas.some(k => k.muridIds?.includes(u.id)) || ownKelas.length === 0)
    );
    const allMurid = Auth.isAdmin() ? allUsers.filter(u => u.role === 'murid') : myMurid;

    return `
      <div class="main-header">
        <div>
          <h1 class="main-title">📊 Rekapitulasi Hasil & Jawaban Murid</h1>
          <p class="main-subtitle">Pantau penyelesaian tiap pos, nilai kuis pilihan ganda & esai, serta refleksi murid.</p>
        </div>
      </div>
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Murid</th>
              <th>Kelompok</th>
              <th>Kelas</th>
              <th>🔭 Pos 1</th>
              <th>🎡 Pos 2</th>
              <th>🏆 Kuis Kelompok</th>
              <th>⏱️ Kuis Individu (PG & Esai)</th>
              <th>🌱 Pos 4</th>
              <th>⭐ Poin</th>
            </tr>
          </thead>
          <tbody>
            ${allMurid.map((u, i) => {
              const s = scores[u.id] || {};
              const grp = DB.getGroupByUserId(u.id);
              const gPos3 = grp ? DB.getPos3ForGroup(grp.id) : null;
              return `
              <tr>
                <td>${i+1}</td>
                <td>${u.avatar} <strong>${u.name}</strong></td>
                <td>${grp ? `<span class="badge-kelas" style="background:${grp.color || '#1E88E5'}18;color:${grp.color || '#1E88E5'}">${grp.emoji || '👥'} ${grp.name}</span>` : '<span class="badge-pending">Belum</span>'}</td>
                <td><span class="badge-kelas">${u.kelas}</span></td>
                <td>${s.pos1?.completed ? '<span class="badge-done">✅ Selesai</span>' : '<span class="badge-pending">⬜ Belum</span>'}</td>
                <td>${s.pos2?.completed ? `<span class="badge-done">✅ Selesai</span>` : '<span class="badge-pending">⬜ Belum</span>'}</td>
                <td>${gPos3 ? `<strong>${gPos3.totalScore}</strong> poin` : (s.pos3?.kuis !== undefined ? `<strong>${s.pos3.kuis}</strong> poin` : '-')}</td>
                <td>${s.pos3?.tantangan !== undefined ? `<strong>${s.pos3.tantangan}%</strong>` : '-'}</td>
                <td>${s.pos4?.completed ? '<span class="badge-done">✅ Selesai</span>' : '<span class="badge-pending">⬜ Belum</span>'}</td>
                <td><strong class="poin-val">${u.poin || 0} ⭐</strong></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>`;
  },

  addMuridToKelas(kelasId) {
    const allMurid = DB.getUsers().filter(u => u.role === 'murid');
    const kelas = DB.getKelas().find(k => k.id === kelasId);
    App.showModal(`
      <div class="modal-form">
        <h3>➕ Kelola Anggota ${kelas?.name}</h3>
        <div class="murid-select-list">
          ${allMurid.map(m => `
            <label class="murid-select-item">
              <input type="checkbox" value="${m.id}" ${kelas?.muridIds?.includes(m.id) ? 'checked' : ''}>
              <span>${m.avatar} ${m.name} (${m.kelas})</span>
            </label>`).join('')}
        </div>
        <div class="modal-actions">
          <button class="btn-secondary" onclick="App.closeModal()">Batal</button>
          <button class="btn-primary" onclick="GuruView.saveKelasMembers('${kelasId}')">💾 Simpan</button>
        </div>
      </div>`);
  },

  saveKelasMembers(kelasId) {
    const checked = [...document.querySelectorAll('.murid-select-item input:checked')].map(c => c.value);
    const kelas = DB.getKelas().map(k => k.id === kelasId ? { ...k, muridIds: checked } : k);
    DB.saveKelas(kelas);
    App.closeModal();
    App.showToast('Daftar murid berhasil diperbarui!', 'success');
    this.render('kelas');
  },
};
