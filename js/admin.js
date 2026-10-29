// ============================================================
// ADMIN.JS — Admin Dashboard
// ============================================================

const AdminView = {
  _currentTab: 'overview',

  render(tab = 'overview') {
    this._currentTab = tab;
    const el = document.getElementById('view-admin');
    el.innerHTML = `
      <div class="dashboard-layout">
        ${App.buildSidebar('admin', tab)}
        <main class="dashboard-main" id="admin-main">
          <div class="loading-spinner-center"><div class="spinner lg"></div></div>
        </main>
      </div>`;
    this._renderTab(tab);
  },

  _renderTab(tab) {
    this._currentTab = tab;
    const main = document.getElementById('admin-main');
    if (!main) return;
    switch (tab) {
      case 'overview':  main.innerHTML = this._tabOverview(); break;
      case 'users':     main.innerHTML = this._tabUsers(); break;
      case 'content':   main.innerHTML = this._tabContent(); break;
      case 'stats':     main.innerHTML = this._tabStats(); break;
      case 'settings':  main.innerHTML = this._tabSettings(); break;
    }
  },

  // ── Overview ──────────────────────────────────────────────
  _tabOverview() {
    const stats = App.getGlobalStats();
    const settings = DB.getSettings();
    return `
      <div class="main-header">
        <div>
          <h1 class="main-title">🏠 Panel Admin</h1>
          <p class="main-subtitle">Selamat datang! Kelola seluruh sistem dari sini.</p>
        </div>
        <div class="main-header-actions">
          <button class="btn-reset-data" onclick="AdminView.confirmReset()">🔄 Reset Data</button>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card stat-blue">
          <div class="stat-icon">👥</div>
          <div class="stat-value">${stats.totalMurid}</div>
          <div class="stat-label">Total Murid</div>
        </div>
        <div class="stat-card stat-green">
          <div class="stat-icon">👩‍🏫</div>
          <div class="stat-value">${stats.totalGuru}</div>
          <div class="stat-label">Total Guru</div>
        </div>
        <div class="stat-card stat-yellow">
          <div class="stat-icon">📚</div>
          <div class="stat-value">${stats.totalMaterial}</div>
          <div class="stat-label">Materi Diunggah</div>
        </div>
        <div class="stat-card stat-purple">
          <div class="stat-icon">⭐</div>
          <div class="stat-value">${stats.avgPoin}</div>
          <div class="stat-label">Rata-rata Poin</div>
        </div>
      </div>

      <div class="section-title">🗺️ Status Pos Pembelajaran</div>
      <div class="pos-status-grid">
        ${[1,2,3,4].map(n => {
          const active = settings[`pos${n}Active`];
          const posNames = {1:'Jelajah Pengetahuan', 2:'Pecahkan Tantangan', 3:'Kuis & Tantangan', 4:'Jejak Tumbuhku'};
          const posEmojis = {1:'🔭', 2:'🎡', 3:'🏆', 4:'🌱'};
          return `
          <div class="pos-status-card ${active ? 'active' : 'inactive'}">
            <div class="pos-status-emoji">${posEmojis[n]}</div>
            <div class="pos-status-name">Pos ${n}<br><small>${posNames[n]}</small></div>
            <div class="pos-status-badge">${active ? '✅ Aktif' : '❌ Nonaktif'}</div>
            <button class="btn-toggle-pos" onclick="AdminView.togglePos(${n})">
              ${active ? 'Nonaktifkan' : 'Aktifkan'}
            </button>
          </div>`;
        }).join('')}
      </div>

      <div class="section-title">📈 Penyelesaian Per Pos</div>
      <div class="completion-bars">
        ${[1,2,3,4].map(n => {
          const pct = stats.totalMurid ? Math.round((stats.completedPos[n]/stats.totalMurid)*100) : 0;
          const posNames = {1:'Pos 1', 2:'Pos 2', 3:'Pos 3', 4:'Pos 4'};
          const colors = {1:'#43A047', 2:'#1565C0', 3:'#F9A825', 4:'#8E24AA'};
          return `
          <div class="completion-bar-row">
            <div class="completion-bar-label">${posNames[n]}</div>
            <div class="completion-bar-track">
              <div class="completion-bar-fill" style="width:${pct}%;background:${colors[n]}">${pct}%</div>
            </div>
            <div class="completion-bar-count">${stats.completedPos[n]}/${stats.totalMurid}</div>
          </div>`;
        }).join('')}
      </div>`;
  },

  // ── Users Tab ─────────────────────────────────────────────
  _tabUsers() {
    const users = DB.getUsers();
    const murid = users.filter(u => u.role === 'murid');
    const guru  = users.filter(u => u.role === 'guru');

    const renderTable = (list, title, icon, roleKey) => `
      <div class="users-section">
        <div class="users-section-header">
          <h3>${icon} ${title} (${list.length})</h3>
          <button class="btn-primary sm" onclick="AdminView.showAddUser('${roleKey}')">
            ➕ Tambah ${title}
          </button>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Avatar</th><th>Nama</th><th>Username</th><th>Kelas</th><th>Aksi</th></tr></thead>
            <tbody>
              ${list.length > 0 ? list.map(u => `
                <tr>
                  <td><span class="avatar-cell">${u.avatar || '👤'}</span></td>
                  <td><strong>${u.name}</strong></td>
                  <td><code>${u.username}</code></td>
                  <td>${u.kelas || '-'}</td>
                  <td>
                    <button class="btn-icon edit" title="Edit" onclick="AdminView.showEditUser('${u.id}')">✏️</button>
                    ${u.id !== 'u1' ? `<button class="btn-icon del" title="Hapus" onclick="AdminView.deleteUser('${u.id}','${u.name.replace(/'/g, "\\'")}')">🗑️</button>` : ''}
                  </td>
                </tr>`).join('') : `
                <tr>
                  <td colspan="5" style="text-align:center;color:var(--text-muted);padding:20px">
                    Belum ada data ${title.toLowerCase()}. Klik tombol <strong>"➕ Tambah ${title}"</strong> di atas untuk menambahkan.
                  </td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </div>`;

    return `
      <div class="main-header">
        <h1 class="main-title">👥 Kelola Pengguna</h1>
      </div>
      ${renderTable(guru, 'Guru', '👩‍🏫', 'guru')}
      ${renderTable(murid, 'Murid', '🌱', 'murid')}`;
  },

  // ── Content Tab ───────────────────────────────────────────
  _tabContent() {
    const topics = DB.getTopics();
    return `
      <div class="main-header">
        <h1 class="main-title">📚 Kelola Konten</h1>
      </div>

      <div class="content-sections">
        <div class="content-section-card">
          <div class="content-section-header">
            <h3>📹 Topik Materi (Pos 1)</h3>
            <button class="btn-primary sm" onclick="AdminView.showAddTopic()">➕ Tambah Topik</button>
          </div>
          <div class="topics-admin-grid">
            ${topics.map(t => `
              <div class="topic-admin-card" style="border-left:4px solid ${t.color}">
                <span class="topic-admin-emoji">${t.emoji}</span>
                <div class="topic-admin-info">
                  <strong>${t.title}</strong>
                  <small>${t.level}</small>
                </div>
                <div class="topic-admin-actions">
                  <button class="btn-icon del" onclick="AdminView.deleteTopic('${t.id}','${t.title}')">🗑️</button>
                </div>
              </div>`).join('')}
          </div>
        </div>

        <div class="content-section-card">
          <div class="content-section-header">
            <h3>🎡 Kartu Kasus (Pos 2)</h3>
            <button class="btn-primary sm" onclick="App.navigate('guru',{tab:'kasus'})">✏️ Edit Teks & Gambar Kasus</button>
          </div>
          <div class="cases-admin-list">
            ${DB.getCases().map((c,i) => `
              <div class="case-admin-item">
                <span class="case-num">${i+1}</span>
                <span>${c.emoji} <strong>${c.title}</strong> ${c.imageData ? '<span class="badge-done">🖼️ Gambar Terpasang</span>' : ''}</span>
              </div>`).join('')}
          </div>
        </div>

        <div class="content-section-card">
          <div class="content-section-header">
            <h3>❓ Soal Kuis Kelompok & Individu (Pos 3)</h3>
            <button class="btn-primary sm" onclick="App.navigate('guru',{tab:'kuis'})">✏️ Kelola Soal PG & Esai</button>
          </div>
          ${DB.getKuisKejutan().map((q,i) => `
            <div class="question-admin-item">
              <span class="q-num">Soal ${i+1}</span>
              <span class="q-babak badge-${q.babak}">${q.babak === 'utama' ? '🔵 Utama' : '🔴 Penentuan'}</span>
              <span class="q-text">${q.pertanyaan.substring(0,70)}...</span>
            </div>`).join('')}
        </div>
      </div>`;
  },

  // ── Stats Tab ─────────────────────────────────────────────
  _tabStats() {
    const users = DB.getUsers().filter(u => u.role === 'murid');
    const scores = DB.getScores();

    return `
      <div class="main-header">
        <h1 class="main-title">📊 Statistik Murid</h1>
      </div>
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Murid</th>
              <th>Kelas</th>
              <th>Pos 1</th>
              <th>Pos 2</th>
              <th>Kuis Kejutan</th>
              <th>Tantangan Akhir</th>
              <th>Pos 4</th>
              <th>Total Poin</th>
            </tr>
          </thead>
          <tbody>
            ${users.map(u => {
              const s = scores[u.id] || {};
              return `
              <tr>
                <td>${u.avatar} <strong>${u.name}</strong></td>
                <td>${u.kelas}</td>
                <td>${s.pos1?.completed ? '✅' : '⬜'}</td>
                <td>${s.pos2?.completed ? '✅' : '⬜'}</td>
                <td>${s.pos3?.kuis !== undefined ? s.pos3.kuis + ' poin' : '-'}</td>
                <td>${s.pos3?.tantangan !== undefined ? s.pos3.tantangan + '%' : '-'}</td>
                <td>${s.pos4?.completed ? '✅' : '⬜'}</td>
                <td><strong>${u.poin || 0} ⭐</strong></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>`;
  },

  // ── Settings Tab ──────────────────────────────────────────
  _tabSettings() {
    const s = DB.getSettings();
    return `
      <div class="main-header">
        <h1 class="main-title">⚙️ Pengaturan Sistem</h1>
      </div>
      <div class="settings-form-wrap">
        <div class="settings-card">
          <h3>🏷️ Informasi Aplikasi</h3>
          <div class="form-group">
            <label class="form-label">Nama Aplikasi</label>
            <input class="form-input" id="set-appname" value="${s.appName}">
          </div>
          <div class="form-group">
            <label class="form-label">Slogan</label>
            <input class="form-input" id="set-slogan" value="${s.slogan}">
          </div>
        </div>
        <div class="settings-card">
          <h3>⏱️ Pengaturan Kuis</h3>
          <div class="form-group">
            <label class="form-label">Waktu Per Soal (detik)</label>
            <input class="form-input" id="set-timer" type="number" value="${s.timerTantangan}" min="10" max="120">
          </div>
          <div class="form-group">
            <label class="form-label">Poin Jawaban Benar</label>
            <input class="form-input" id="set-points" type="number" value="${s.pointsBenar}" min="1">
          </div>
        </div>
        <div class="settings-actions">
          <button class="btn-primary" onclick="AdminView.saveSettings()">💾 Simpan Pengaturan</button>
          <button class="btn-danger" onclick="AdminView.confirmReset()">🗑️ Reset Semua Data</button>
        </div>
      </div>`;
  },

  // ── Actions ───────────────────────────────────────────────
  togglePos(n) {
    const s = DB.getSettings();
    s[`pos${n}Active`] = !s[`pos${n}Active`];
    DB.saveSettings(s);
    App.showToast(`Pos ${n} ${s[`pos${n}Active`] ? 'diaktifkan' : 'dinonaktifkan'}!`, 'success');
    this.render('overview');
  },

  saveSettings() {
    DB.saveSettings({
      appName: document.getElementById('set-appname').value,
      slogan: document.getElementById('set-slogan').value,
      timerTantangan: parseInt(document.getElementById('set-timer').value) || 30,
      pointsBenar: parseInt(document.getElementById('set-points').value) || 10,
    });
    App.showToast('Pengaturan berhasil disimpan!', 'success');
  },

  confirmReset() {
    App.showModal(`
      <div class="modal-confirm">
        <div class="confirm-icon">⚠️</div>
        <h3>Reset Semua Data?</h3>
        <p>Tindakan ini akan menghapus semua data (pengguna, skor, materi) dan mengembalikan ke data awal. <strong>Tidak bisa diurungkan!</strong></p>
        <div class="confirm-actions">
          <button class="btn-secondary" onclick="App.closeModal()">Batal</button>
          <button class="btn-danger" onclick="AdminView.doReset()">Ya, Reset!</button>
        </div>
      </div>`);
  },

  doReset() {
    DB.reset();
    App.closeModal();
    App.showToast('Data berhasil direset ke default!', 'success');
    Auth.logout();
  },

  showAddUser(role = 'murid') {
    const isGuru = role === 'guru';
    const defaultAvatar = isGuru ? '👩‍🏫' : '🌱';

    App.showModal(`
      <div class="modal-form">
        <h3>➕ Tambah ${isGuru ? 'Guru' : 'Murid'} Baru</h3>
        <input type="hidden" id="nu-role" value="${isGuru ? 'guru' : 'murid'}">
        <div class="form-group">
          <label class="form-label">Peran Akun (Role)</label>
          <input class="form-input" value="${isGuru ? '👩‍🏫 Guru (Pengajar)' : '🌱 Murid (Peserta Didik)'}" disabled style="background:#F1F5F9;font-weight:800">
        </div>
        <div class="form-group">
          <label class="form-label">Nama Lengkap ${isGuru ? 'Guru' : 'Murid'}</label>
          <input class="form-input" id="nu-name" placeholder="${isGuru ? 'Contoh: Pak Budi Santoso, S.Pd.' : 'Contoh: Andi Pratama'}">
        </div>
        <div class="form-group">
          <label class="form-label">Username Login</label>
          <input class="form-input" id="nu-username" placeholder="${isGuru ? 'Contoh: guru2' : 'Contoh: murid7'}">
        </div>
        <div class="form-group">
          <label class="form-label">Password</label>
          <input class="form-input" id="nu-password" type="password" placeholder="Masukkan password login...">
        </div>
        <div class="form-group">
          <label class="form-label">${isGuru ? 'Kelas yang Diampu' : 'Kelas'}</label>
          <input class="form-input" id="nu-kelas" placeholder="Contoh: 5A" value="5A">
        </div>
        <div class="form-group">
          <label class="form-label">Avatar Emoji</label>
          <input class="form-input" id="nu-avatar" placeholder="${defaultAvatar}" value="${defaultAvatar}">
        </div>
        <div class="modal-actions">
          <button class="btn-secondary" onclick="App.closeModal()">Batal</button>
          <button class="btn-primary" onclick="AdminView.doAddUser('${isGuru ? 'guru' : 'murid'}')">➕ Tambah ${isGuru ? 'Guru' : 'Murid'}</button>
        </div>
      </div>`);
  },

  doAddUser(roleParam) {
    const roleEl   = document.getElementById('nu-role');
    const role     = (roleParam === 'guru' || roleEl?.value === 'guru') ? 'guru' : 'murid';
    const name     = document.getElementById('nu-name').value.trim();
    const username = document.getElementById('nu-username').value.trim();
    const password = document.getElementById('nu-password').value;
    const kelas    = document.getElementById('nu-kelas').value.trim() || '5A';
    const avatar   = document.getElementById('nu-avatar').value.trim() || (role === 'guru' ? '👩‍🏫' : '🌱');

    if (!name || !username || !password) {
      App.showToast('Mohon isi Nama Lengkap, Username, dan Password!', 'error');
      return;
    }
    const users = DB.getUsers();
    if (users.find(u => u.username === username)) {
      App.showToast('Username sudah digunakan!', 'error');
      return;
    }

    const newUser = DB.addUser({
      username,
      password,
      role,
      name,
      avatar,
      kelas,
      poin: 0,
      badges: role === 'murid' ? ['first_login'] : []
    });

    // If adding a Murid, also register into matching kelas list
    if (role === 'murid' && kelas) {
      const allKelas = DB.getKelas();
      const targetKelas = allKelas.find(k => k.name.toLowerCase().includes(kelas.toLowerCase()));
      if (targetKelas && !targetKelas.muridIds.includes(newUser.id)) {
        targetKelas.muridIds.push(newUser.id);
        DB.saveKelas(allKelas);
      }
    }

    App.closeModal();
    App.showToast(`${role === 'guru' ? 'Guru' : 'Murid'} "${name}" berhasil ditambahkan ke daftar ${role === 'guru' ? 'Guru' : 'Murid'}!`, 'success');
    this.render('users');
  },

  deleteUser(id, name) {
    App.showModal(`
      <div class="modal-confirm">
        <div class="confirm-icon">🗑️</div>
        <h3>Hapus Pengguna?</h3>
        <p>Yakin ingin menghapus <strong>${name}</strong>? Data tidak bisa dikembalikan.</p>
        <div class="confirm-actions">
          <button class="btn-secondary" onclick="App.closeModal()">Batal</button>
          <button class="btn-danger" onclick="AdminView.doDeleteUser('${id}')">Hapus</button>
        </div>
      </div>`);
  },

  doDeleteUser(id) {
    DB.deleteUser(id);
    App.closeModal();
    App.showToast('Pengguna berhasil dihapus!', 'success');
    this.render('users');
  },

  showEditUser(id) {
    const u = DB.getUserById(id);
    if (!u) return;
    App.showModal(`
      <div class="modal-form">
        <h3>✏️ Edit Pengguna: ${u.name}</h3>
        <div class="form-group">
          <label class="form-label">Peran Akun (Role)</label>
          <select class="form-input" id="eu-role">
            <option value="guru" ${u.role === 'guru' ? 'selected' : ''}>👩‍🏫 Guru (Pengajar)</option>
            <option value="murid" ${u.role === 'murid' ? 'selected' : ''}>🌱 Murid (Peserta Didik)</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Nama Lengkap</label>
          <input class="form-input" id="eu-name" value="${u.name}">
        </div>
        <div class="form-group">
          <label class="form-label">Password Baru (kosongkan jika tidak diubah)</label>
          <input class="form-input" id="eu-password" type="password" placeholder="Password baru...">
        </div>
        <div class="form-group">
          <label class="form-label">Kelas</label>
          <input class="form-input" id="eu-kelas" value="${u.kelas || ''}">
        </div>
        <div class="form-group">
          <label class="form-label">Avatar</label>
          <input class="form-input" id="eu-avatar" value="${u.avatar || '👤'}">
        </div>
        <div class="modal-actions">
          <button class="btn-secondary" onclick="App.closeModal()">Batal</button>
          <button class="btn-primary" onclick="AdminView.doEditUser('${id}')">💾 Simpan</button>
        </div>
      </div>`);
  },

  doEditUser(id) {
    const data = {
      role:   document.getElementById('eu-role')?.value || 'murid',
      name:   document.getElementById('eu-name').value.trim(),
      kelas:  document.getElementById('eu-kelas').value.trim(),
      avatar: document.getElementById('eu-avatar').value.trim(),
    };
    const pwd = document.getElementById('eu-password').value;
    if (pwd) data.password = pwd;
    DB.updateUser(id, data);
    App.closeModal();
    App.showToast('Data pengguna diperbarui!', 'success');
    this.render('users');
  },

  showAddTopic() {
    App.showModal(`
      <div class="modal-form">
        <h3>➕ Tambah Topik Baru</h3>
        <div class="form-group">
          <label class="form-label">Judul Topik</label>
          <input class="form-input" id="nt-title" placeholder="Judul topik...">
        </div>
        <div class="form-group">
          <label class="form-label">Deskripsi</label>
          <textarea class="form-input" id="nt-desc" rows="3" placeholder="Deskripsi singkat..."></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">URL Video YouTube (embed)</label>
          <input class="form-input" id="nt-video" placeholder="https://www.youtube.com/embed/...">
        </div>
        <div class="form-group">
          <label class="form-label">Emoji</label>
          <input class="form-input" id="nt-emoji" placeholder="🌿" value="📚">
        </div>
        <div class="form-group">
          <label class="form-label">Level</label>
          <select class="form-input" id="nt-level">
            <option>Dasar</option>
            <option>Menengah</option>
            <option>Lanjutan</option>
          </select>
        </div>
        <div class="modal-actions">
          <button class="btn-secondary" onclick="App.closeModal()">Batal</button>
          <button class="btn-primary" onclick="AdminView.doAddTopic()">➕ Tambah</button>
        </div>
      </div>`);
  },

  doAddTopic() {
    const title = document.getElementById('nt-title').value.trim();
    const desc  = document.getElementById('nt-desc').value.trim();
    const video = document.getElementById('nt-video').value.trim();
    const emoji = document.getElementById('nt-emoji').value.trim() || '📚';
    const level = document.getElementById('nt-level').value;
    if (!title || !video) { App.showToast('Judul dan URL Video wajib diisi!', 'error'); return; }
    const colors = ['#2E7D32','#E65100','#0277BD','#6A1B9A','#C62828','#00838F'];
    const color = colors[Math.floor(Math.random()*colors.length)];
    DB.addTopic({ title, description: desc, videoUrl: video, emoji, level, color, bgGradient: `linear-gradient(135deg,${color},#1a1a2e)`, tags: [title,'IPA','Kelas 5'] });
    App.closeModal();
    App.showToast('Topik berhasil ditambahkan!', 'success');
    this.render('content');
  },

  deleteTopic(id, title) {
    App.showModal(`
      <div class="modal-confirm">
        <div class="confirm-icon">🗑️</div>
        <h3>Hapus Topik?</h3>
        <p>Yakin ingin menghapus topik <strong>${title}</strong>?</p>
        <div class="confirm-actions">
          <button class="btn-secondary" onclick="App.closeModal()">Batal</button>
          <button class="btn-danger" onclick="AdminView.doDeleteTopic('${id}')">Hapus</button>
        </div>
      </div>`);
  },

  doDeleteTopic(id) {
    DB.deleteTopic(id);
    App.closeModal();
    App.showToast('Topik dihapus!', 'success');
    this.render('content');
  },
};
