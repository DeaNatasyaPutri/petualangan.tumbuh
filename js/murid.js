// ============================================================
// MURID.JS — Student Home / Map Dashboard
// ============================================================

const MuridView = {

  render() {
    const user = Auth.getCurrentUser();
    const scores = DB.getScoreByUser(user.id);
    const settings = DB.getSettings();

    const posInfo = [
      { id: 1, name: 'Jelajah Pengetahuan', emoji: '🔭', desc: 'Jelajahi topik materi melalui video edukatif seru!', color: '#43A047', gradient: 'linear-gradient(135deg,#43A047,#1B5E20)', nav: 'pos1' },
      { id: 2, name: 'Pecahkan Tantangan', emoji: '🎡', desc: 'Putar roda dan selesaikan kartu kasus seru bersama kelompok!', color: '#1565C0', gradient: 'linear-gradient(135deg,#1565C0,#0D47A1)', nav: 'pos2' },
      { id: 3, name: 'Kuis & Tantangan Akhir', emoji: '🏆', desc: 'Kompetisi kuis seru dan tes pengetahuanmu!', color: '#F9A825', gradient: 'linear-gradient(135deg,#F9A825,#E65100)', nav: 'pos3' },
      { id: 4, name: 'Jejak Tumbuhku', emoji: '🌱', desc: 'Refleksikan perjalanan belajarmu dan rencana ke depan!', color: '#8E24AA', gradient: 'linear-gradient(135deg,#8E24AA,#4A148C)', nav: 'pos4' },
    ];

    const el = document.getElementById('view-murid');
    el.innerHTML = `
      <div class="murid-layout">
        <!-- Sidebar kiri -->
        <aside class="murid-sidebar">
          <div class="murid-logo">
            <div class="murid-logo-mascot">🌱</div>
            <div>
              <div class="murid-logo-name">${settings.appName}</div>
              <div class="murid-logo-slogan">${settings.slogan}</div>
            </div>
          </div>

          <div class="murid-profile-card">
            <div class="profile-avatar-wrap">
              <div class="profile-avatar">${user.avatar || '🌱'}</div>
              <div class="profile-level-ring"></div>
            </div>
            <div class="profile-info">
              <div class="profile-name">${user.name}</div>
              <div class="profile-kelas">Kelas ${user.kelas || '5'}</div>
              <div class="profile-poin">⭐ ${user.poin || 0} Poin</div>
            </div>
          </div>

          <div class="progress-summary">
            <div class="progress-title">📊 Progress Petualangan</div>
            ${posInfo.map(p => {
              const done = this._isPosCompleted(scores, p.id);
              const pct  = this._getPosProgress(scores, p.id);
              return `
              <div class="progress-item">
                <span class="progress-item-label">${p.emoji} Pos ${p.id}</span>
                <div class="progress-bar-sm">
                  <div class="progress-bar-fill-sm" style="width:${pct}%;background:${p.color}"></div>
                </div>
                <span class="progress-item-status ${done ? 'done' : ''}">${done ? '✅' : pct > 0 ? '⏳' : '⬜'}</span>
              </div>`;
            }).join('')}
          </div>

          <div class="badges-section">
            <div class="badges-title">🏅 Badge Saya</div>
            <div class="badges-grid" id="badges-display">
              ${this._renderBadges(user)}
            </div>
          </div>

          <div class="murid-sidebar-footer">
            ${Auth.isAdmin() || Auth.isGuru() ? `<button class="btn-sidebar-secondary" onclick="App.navigate('dashboard')">🔙 Kembali ke Dasbor</button>` : ''}
            <button class="btn-sidebar-logout" onclick="Auth.logout()">🚪 Keluar</button>
          </div>
        </aside>

        <!-- Konten utama -->
        <main class="murid-main">
          <div class="murid-main-header">
            <div>
              <h1 class="murid-main-title">🗺️ Peta Petualangan Tumbuh</h1>
              <p class="murid-main-subtitle">Selamat datang, <strong>${user.name}</strong>! Pilih Pos Pembelajaran-mu hari ini! 🚀</p>
            </div>
            <div class="header-date">${new Date().toLocaleDateString('id-ID', {weekday:'long', day:'numeric', month:'long', year:'numeric'})}</div>
          </div>

          <!-- Peta Perjalanan -->
          <div class="adventure-map">
            <div class="map-path">
              <div class="map-path-line"></div>
              ${posInfo.map((p, idx) => {
                const done    = this._isPosCompleted(scores, p.id);
                const active  = settings[`pos${p.id}Active`];
                const pct     = this._getPosProgress(scores, p.id);
                return `
                <div class="map-pos-node ${done ? 'completed' : ''} ${!active ? 'locked' : ''}">
                  <div class="map-node-connector ${idx > 0 ? 'show' : ''}"></div>
                  <div class="pos-card ${done ? 'done' : ''} ${!active ? 'locked' : ''}" onclick="${active ? `App.navigate('${p.nav}')` : "App.showToast('Pos ini belum aktif!','warning')"}">
                    <div class="pos-card-header" style="background:${p.gradient}">
                      <div class="pos-number">POS ${p.id}</div>
                      <div class="pos-emoji">${p.emoji}</div>
                      ${done ? '<div class="pos-done-badge">✅ SELESAI</div>' : ''}
                      ${!active ? '<div class="pos-locked-badge">🔒 TERKUNCI</div>' : ''}
                    </div>
                    <div class="pos-card-body">
                      <h3 class="pos-name">${p.name}</h3>
                      <p class="pos-desc">${p.desc}</p>
                      <div class="pos-progress-bar">
                        <div class="pos-progress-fill" style="width:${pct}%;background:${p.color}"></div>
                      </div>
                      <div class="pos-progress-label">${pct}% selesai</div>
                      <button class="pos-btn-start ${!active ? 'disabled' : ''}" style="background:${active ? p.gradient : '#ccc'}">
                        ${!active ? '🔒 Terkunci' : done ? '🔄 Ulangi' : '🚀 Mulai!'}
                      </button>
                    </div>
                  </div>
                </div>`;
              }).join('')}
            </div>
          </div>

          <!-- Motivasi & Skor terbaru -->
          <div class="murid-bottom-row">
            <div class="motivation-card">
              <div class="motivation-icon">💪</div>
              <div class="motivation-text">
                <h3>${this._getMotivation(scores)}</h3>
                <p>Terus semangat belajar! Setiap langkah kecil membawa perubahan besar.</p>
              </div>
            </div>
            <div class="recent-scores-card">
              <h3>📊 Skor Terbaru</h3>
              ${scores.pos3?.kuis !== undefined ? `<div class="score-row"><span>🏆 Kuis Kejutan</span><strong>${scores.pos3.kuis} poin</strong></div>` : ''}
              ${scores.pos3?.tantangan !== undefined ? `<div class="score-row"><span>⏱️ Tantangan Akhir</span><strong>${scores.pos3.tantangan}%</strong></div>` : ''}
              ${!scores.pos3 ? '<p class="hint-text">Belum ada skor. Yuk mulai kuis!</p>' : ''}
            </div>
          </div>
        </main>
      </div>`;
  },

  _isPosCompleted(scores, posId) {
    if (posId === 3) return scores.pos3?.kuis !== undefined || scores.pos3?.tantangan !== undefined;
    return scores[`pos${posId}`]?.completed === true;
  },

  _getPosProgress(scores, posId) {
    const s = scores[`pos${posId}`];
    if (!s) return 0;
    if (posId === 1) {
      const total = DB.getTopics().length;
      return total ? Math.round(((s.topicsWatched?.length || 0) / total) * 100) : 0;
    }
    if (posId === 2) return s.completed ? 100 : (s.casesPlayed ? 50 : 0);
    if (posId === 3) return s.kuis !== undefined || s.tantangan !== undefined ? 100 : 0;
    if (posId === 4) return s.completed ? 100 : (s.currentScreen > 0 ? (s.currentScreen / 4) * 100 : 0);
    return 0;
  },

  _renderBadges(user) {
    const allBadges = [
      { id: 'first_login', emoji: '🌱', name: 'Penjelajah Baru' },
      { id: 'pos1_done',   emoji: '🔭', name: 'Penjelajah Ilmu' },
      { id: 'pos2_done',   emoji: '🎡', name: 'Pemecah Masalah' },
      { id: 'pos3_done',   emoji: '🏆', name: 'Juara Kuis' },
      { id: 'pos4_done',   emoji: '🌟', name: 'Sang Refleksi' },
      { id: 'all_done',    emoji: '🚀', name: 'Petualang Sejati' },
    ];
    const userBadges = user.badges || [];
    return allBadges.map(b => `
      <div class="badge-item ${userBadges.includes(b.id) ? 'earned' : 'locked'}" title="${b.name}">
        <span class="badge-emoji">${b.emoji}</span>
        <span class="badge-name">${b.name}</span>
      </div>`).join('');
  },

  _getMotivation(scores) {
    const total = [1,2,3,4].filter(n => this._isPosCompleted(scores, n)).length;
    if (total === 0) return '🌱 Mulai Petualangan Belajarmu!';
    if (total === 1) return '🌿 Langkah Pertamamu Hebat!';
    if (total === 2) return '🌳 Kamu Setengah Jalan, Terus!';
    if (total === 3) return '🌟 Hampir Sampai Tujuan!';
    return '🚀 Kamu Seorang Petualang Sejati!';
  },

  // Award badge to user
  awardBadge(userId, badgeId) {
    const users = DB.getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) return;
    if (!user.badges) user.badges = [];
    if (!user.badges.includes(badgeId)) {
      user.badges.push(badgeId);
      DB.saveUsers(users);
      App.showToast(`🏅 Badge baru: "${this._getBadgeName(badgeId)}" diraih!`, 'success');
    }
  },

  addPoin(userId, poin) {
    const users = DB.getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) return;
    user.poin = (user.poin || 0) + poin;
    DB.saveUsers(users);
  },

  _getBadgeName(id) {
    const names = { first_login:'Penjelajah Baru', pos1_done:'Penjelajah Ilmu', pos2_done:'Pemecah Masalah', pos3_done:'Juara Kuis', pos4_done:'Sang Refleksi', all_done:'Petualang Sejati' };
    return names[id] || id;
  },
};
