// ============================================================
// APP.JS — SPA Router, Global Utilities, Main Controller
// ============================================================

const App = {
  currentView: null,

  // ── Init ──────────────────────────────────────────────────
  init() {
    DB.init();
    if (typeof SoundManager !== 'undefined') SoundManager.init();
    this._setupGlobalEvents();

    // Always start at the login screen when first opening/entering the link
    Auth.clearSession();
    this.navigate('login');
  },

  // ── Router ────────────────────────────────────────────────
  navigate(view, params = {}) {
    // Hide all views
    document.querySelectorAll('.view').forEach(v => {
      v.classList.remove('active');
      v.style.display = 'none';
    });

    this.currentView = view;
    this.currentParams = params;
    if (typeof SoundManager !== 'undefined') SoundManager.onNavigate(view);

    switch (view) {
      case 'login':       this._showLogin(); break;
      case 'dashboard':   this._showDashboard(); break;
      case 'admin':       this._showAdmin(params); break;
      case 'guru':        this._showGuru(params); break;
      case 'murid':       this._showMurid(params); break;
      case 'pos1':        this._showPos(1, params); break;
      case 'pos2':        this._showPos(2, params); break;
      case 'pos3':        this._showPos(3, params); break;
      case 'pos4':        this._showPos(4, params); break;
      default:            this._showLogin();
    }
  },

  _showView(id) {
    const el = document.getElementById(id);
    if (el) {
      el.style.display = 'flex';
      el.classList.add('active');
    }
  },

  _showLogin() {
    this._showView('view-login');
    LoginView.render();
  },

  _showDashboard() {
    const user = Auth.getCurrentUser();
    if (!user) { this.navigate('login'); return; }
    switch (user.role) {
      case 'admin': this.navigate('admin'); break;
      case 'guru':  this.navigate('guru'); break;
      case 'murid': this.navigate('murid'); break;
    }
  },

  _showAdmin(params) {
    if (!Auth.requireAuth(['admin'])) return;
    this._showView('view-admin');
    AdminView.render(params.tab || 'overview');
  },

  _showGuru(params) {
    if (!Auth.requireAuth(['guru', 'admin'])) return;
    this._showView('view-guru');
    GuruView.render(params.tab || 'overview');
  },

  _showMurid(params) {
    if (!Auth.requireAuth(['murid', 'guru', 'admin'])) return;
    this._showView('view-murid');
    MuridView.render();
  },

  _showPos(num, params) {
    if (!Auth.isLoggedIn()) { this.navigate('login'); return; }
    const settings = DB.getSettings();
    if (!settings[`pos${num}Active`] && !Auth.isAdmin() && !Auth.isGuru()) {
      this.showToast('Pos ini belum aktif. Tanyakan kepada guru kamu!', 'warning');
      return;
    }
    const viewId = `view-pos${num}`;
    this._showView(viewId);
    const posViews = [null, Pos1View, Pos2View, Pos3View, Pos4View];
    if (posViews[num]) posViews[num].render(params);
  },

  // ── Global Events ─────────────────────────────────────────
  _setupGlobalEvents() {
    // Back button (browser)
    window.addEventListener('popstate', () => {
      const hash = window.location.hash.replace('#', '') || 'login';
      this.navigate(hash);
    });

    // Close modals on backdrop click
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-backdrop')) {
        this.closeModal();
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeModal();
    });

    // Global cross-tab / cross-profile sync listener for non-active-input views
    if (typeof RealtimeSync !== 'undefined' && typeof RealtimeSync.subscribe === 'function') {
      RealtimeSync.subscribe((msg) => {
        const activeTag = document.activeElement?.tagName;
        const isTyping = activeTag === 'INPUT' || activeTag === 'TEXTAREA' || activeTag === 'SELECT';
        const hasModal = !!document.getElementById('modal-backdrop');
        if (isTyping || hasModal) return;

        const evt = msg.event || msg.type;
        if (['USERS_UPDATED', 'GROUPS_UPDATED', 'CONTENT_UPDATED', 'MATERIALS_UPDATED', 'SCORES_UPDATED', 'SETTINGS_UPDATED', 'STORAGE_UPDATED', 'DATA_UPDATED'].includes(evt)) {
          if (this.currentView === 'murid') MuridView.render();
          else if (this.currentView === 'pos1') Pos1View.render();
          else if (this.currentView === 'admin') AdminView.render(AdminView._currentTab || 'overview');
        }
      });
    }
  },

  // ── Modal System ──────────────────────────────────────────
  showModal(html, size = 'md') {
    this.closeModal();
    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.id = 'modal-backdrop';
    modal.innerHTML = `
      <div class="modal modal-${size}" id="modal-box">
        <button class="modal-close" onclick="App.closeModal()">✕</button>
        ${html}
      </div>`;
    document.body.appendChild(modal);
    requestAnimationFrame(() => modal.classList.add('visible'));
  },

  closeModal() {
    if (typeof SoundManager !== 'undefined') SoundManager.pauseBGMForMedia(false);
    const modal = document.getElementById('modal-backdrop');
    if (modal) {
      modal.classList.remove('visible');
      setTimeout(() => modal.remove(), 300);
    }
  },

  // ── Toast Notifications ───────────────────────────────────
  showToast(message, type = 'success', duration = 3500) {
    if (typeof SoundManager !== 'undefined') {
      if (type === 'success') SoundManager.playSFX('correct');
      else if (type === 'error') SoundManager.playSFX('wrong');
      else if (type === 'warning') SoundManager.playSFX('warning');
    }
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span class="toast-icon">${icons[type] || '💬'}</span><span>${message}</span>`;
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('visible'));
    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 400);
    }, duration);
  },

  // ── Confetti ──────────────────────────────────────────────
  showConfetti(count = 80) {
    if (typeof SoundManager !== 'undefined') SoundManager.playSFX('fanfare');
    const colors = ['#F9A825','#43A047','#1565C0','#E53935','#8E24AA','#00ACC1'];
    for (let i = 0; i < count; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.cssText = `
        left:${Math.random()*100}vw;
        background:${colors[Math.floor(Math.random()*colors.length)]};
        animation-duration:${0.8 + Math.random()*1.5}s;
        animation-delay:${Math.random()*0.5}s;
        width:${6+Math.random()*8}px;
        height:${6+Math.random()*8}px;
        border-radius:${Math.random()>0.5?'50%':'2px'};
      `;
      document.body.appendChild(piece);
      setTimeout(() => piece.remove(), 2500);
    }
  },

  // ── Automatic Group Point Feedback Popup ──────────────────
  showPointFeedback({ groupName, pointsEarned, totalScore, isCorrect = true, title = 'Jawaban Terkirim!', subtitle = '', detail = '' }) {
    const existing = document.getElementById('point-feedback-popup');
    if (existing) existing.remove();

    if (typeof SoundManager !== 'undefined') {
      SoundManager.playSFX(pointsEarned > 0 ? 'fanfare' : 'wrong');
    }
    if (pointsEarned > 0) {
      this.showConfetti(45);
    }

    const popup = document.createElement('div');
    popup.id = 'point-feedback-popup';
    popup.className = `point-feedback-overlay visible`;
    popup.innerHTML = `
      <div class="point-feedback-card ${pointsEarned > 0 ? 'earned' : 'zero'}">
        <div class="pf-badge-top">🏅 PAPAN SKOR KELOMPOK OTOMATIS</div>
        <div class="pf-emoji">${pointsEarned > 0 ? '🎉' : '💪'}</div>
        <h2 class="pf-title">${title}</h2>
        <div class="pf-group-name">👥 ${groupName || 'Kelompok Kamu'}</div>
        <div class="pf-points-box">
          <div class="pf-points-delta">${pointsEarned > 0 ? `+${pointsEarned}` : '+0'} Poin</div>
          <div class="pf-points-total">Total Skor Kelompok: <strong>${totalScore} Poin ⭐</strong></div>
        </div>
        ${subtitle ? `<p class="pf-subtitle">${subtitle}</p>` : ''}
        ${detail ? `<div class="pf-detail">${detail}</div>` : ''}
        <button class="btn-primary" onclick="document.getElementById('point-feedback-popup')?.remove()">
          👍 Lanjutkan!
        </button>
      </div>
    `;
    document.body.appendChild(popup);
  },

  // ── Utilities ─────────────────────────────────────────────
  formatDate(iso) {
    if (!iso) return '-';
    return new Date(iso).toLocaleDateString('id-ID', { day:'2-digit', month:'long', year:'numeric' });
  },

  shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },

  timeAgo(iso) {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return 'Baru saja';
    if (mins < 60) return `${mins} menit lalu`;
    if (hours < 24) return `${hours} jam lalu`;
    return `${days} hari lalu`;
  },

  // ── Sidebar Builder (for admin/guru views) ────────────────
  buildSidebar(role, activeTab) {
    const user = Auth.getCurrentUser();
    const settings = DB.getSettings();

    const adminNavs = [
      { tab: 'overview', icon: '🏠', label: 'Beranda' },
      { tab: 'users', icon: '👥', label: 'Kelola Pengguna' },
      { tab: 'content', icon: '📚', label: 'Kelola Konten' },
      { tab: 'stats', icon: '📊', label: 'Statistik' },
      { tab: 'settings', icon: '⚙️', label: 'Pengaturan' },
    ];

    const guruNavs = [
      { tab: 'overview', icon: '🏠', label: 'Beranda' },
      { tab: 'kelompok', icon: '👥', label: 'Manajemen Kelompok' },
      { tab: 'kelas', icon: '🏫', label: 'Kelola Kelas' },
      { tab: 'materi', icon: '📤', label: 'Materi Pos 1 (Video/PDF)' },
      { tab: 'kasus', icon: '🎡', label: 'Undian & Kasus Pos 2' },
      { tab: 'kuis', icon: '🏆', label: 'Kuis Pos 3 (PG & Esai)' },
      { tab: 'hasil', icon: '📊', label: 'Hasil Murid' },
    ];

    const navs = role === 'admin' ? adminNavs : guruNavs;
    const navHtml = navs.map(n => `
      <button class="sidebar-nav-btn ${activeTab === n.tab ? 'active' : ''}"
        onclick="${role === 'admin' ? 'AdminView' : 'GuruView'}.render('${n.tab}')">
        <span class="nav-icon">${n.icon}</span>
        <span class="nav-label">${n.label}</span>
      </button>`).join('');

    return `
      <aside class="sidebar">
        <div class="sidebar-logo">
          <div class="sidebar-mascot">🌱</div>
          <div class="sidebar-brand">
            <div class="sidebar-appname">${settings.appName}</div>
            <div class="sidebar-slogan">${settings.slogan}</div>
          </div>
        </div>
        <div class="sidebar-user">
          <div class="sidebar-avatar">${user?.avatar || '👤'}</div>
          <div class="sidebar-userinfo">
            <div class="sidebar-username">${user?.name || '-'}</div>
            <div class="sidebar-role role-${user?.role}">${this._roleLabel(user?.role)}</div>
          </div>
        </div>
        <nav class="sidebar-nav">${navHtml}</nav>
        <div class="sidebar-footer">
          ${(Auth.isAdmin() || Auth.isGuru()) ? `<button class="btn-sidebar-secondary" onclick="App.navigate('murid')">👨‍🎓 Lihat Murid</button>` : ''}
          <button class="btn-sidebar-logout" onclick="Auth.logout()">🚪 Keluar</button>
        </div>
      </aside>`;
  },

  _roleLabel(role) {
    return { admin: 'Administrator', guru: 'Guru', murid: 'Murid' }[role] || role;
  },

  // ── Stats Helper ──────────────────────────────────────────
  getGlobalStats() {
    const users = DB.getUsers();
    const scores = DB.getScores();
    const muridList = users.filter(u => u.role === 'murid');
    const guruList = users.filter(u => u.role === 'guru');

    let completedPos = { 1:0, 2:0, 3:0, 4:0 };
    let totalPoin = 0;

    muridList.forEach(m => {
      const s = scores[m.id] || {};
      if (s.pos1?.completed) completedPos[1]++;
      if (s.pos2?.completed) completedPos[2]++;
      if (s.pos3?.kuis !== undefined) completedPos[3]++;
      if (s.pos4?.completed) completedPos[4]++;
      totalPoin += (m.poin || 0);
    });

    return {
      totalMurid: muridList.length,
      totalGuru: guruList.length,
      totalMaterial: DB.getMaterials().length,
      completedPos,
      totalPoin,
      avgPoin: muridList.length ? Math.round(totalPoin / muridList.length) : 0,
    };
  },
};

// ── Login View ─────────────────────────────────────────────
const LoginView = {
  render() {
    const el = document.getElementById('view-login');
    el.innerHTML = `
      <div class="login-bg">
        <div class="login-particles" id="login-particles"></div>
        <div class="login-card">
          <div class="login-header">
            <div class="login-mascot-wrap">
              <div class="login-mascot">🌱</div>
              <div class="login-mascot-ring"></div>
            </div>
            <h1 class="login-title">Petualangan TUMBUH</h1>
            <p class="login-slogan">✨ Pantang Menyerah, Terus Melangkah ✨</p>
          </div>
          <div class="login-form-wrap">
            <h2 class="login-form-title">Masuk ke Platform</h2>
            <form class="login-form" onsubmit="LoginView.handleLogin(event)">
              <div class="form-group">
                <label class="form-label">👤 Nama Pengguna</label>
                <input type="text" id="login-username" class="form-input" placeholder="Masukkan username..." autocomplete="username" required>
              </div>
              <div class="form-group">
                <label class="form-label">🔒 Kata Sandi</label>
                <div class="input-wrap">
                  <input type="password" id="login-password" class="form-input" placeholder="Masukkan password..." autocomplete="current-password" required>
                  <button type="button" class="btn-eye" onclick="LoginView.togglePwd()">👁️</button>
                </div>
              </div>
              <button type="submit" class="btn-login" id="btn-login-submit">
                <span>🚀 Masuk Sekarang!</span>
              </button>
            </form>
          </div>
        </div>
      </div>`;
    this._spawnParticles();
  },

  filterRole(btn, role) {
    document.querySelectorAll('.role-pill').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const hints = document.querySelectorAll('.hint-card');
    hints.forEach(h => {
      h.style.display = (role === 'all' || h.querySelector('strong').textContent.toLowerCase().includes(role) || (role === 'guru' && h.querySelector('strong').textContent === 'Guru')) ? 'flex' : 'none';
    });
  },

  handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    const btn = document.getElementById('btn-login-submit');

    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> Memproses...';

    setTimeout(() => {
      const user = Auth.login(username, password);
      if (user) {
        App.showToast(`Selamat datang, ${user.name}! 🎉`, 'success');
        App.showConfetti(50);
        setTimeout(() => App.navigate('dashboard'), 800);
      } else {
        App.showToast('Username atau password salah! Coba lagi.', 'error');
        btn.disabled = false;
        btn.innerHTML = '<span>🚀 Masuk Sekarang!</span>';
        document.getElementById('login-password').value = '';
      }
    }, 800);
  },

  fillCreds(u, p) {
    document.getElementById('login-username').value = u;
    document.getElementById('login-password').value = p;
    App.showToast('Kredensial terisi otomatis! Klik Masuk.', 'info');
  },

  togglePwd() {
    const inp = document.getElementById('login-password');
    inp.type = inp.type === 'password' ? 'text' : 'password';
  },

  _spawnParticles() {
    const container = document.getElementById('login-particles');
    if (!container) return;
    const icons = ['🌿','🍃','🌸','⭐','💧','🌻','🦋','🌈','✨','🌱'];
    for (let i = 0; i < 18; i++) {
      const p = document.createElement('div');
      p.className = 'login-particle';
      p.textContent = icons[Math.floor(Math.random() * icons.length)];
      p.style.cssText = `
        left:${Math.random()*100}%;
        top:${Math.random()*100}%;
        font-size:${1.2+Math.random()*1.8}rem;
        animation-duration:${4+Math.random()*6}s;
        animation-delay:${Math.random()*5}s;
      `;
      container.appendChild(p);
    }
  }
};

// ── DOMContentLoaded ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => App.init());
