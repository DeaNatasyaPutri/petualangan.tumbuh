// ============================================================
// AUTH.JS — Authentication & Per-Tab Session Management
//           (Supports multiple simultaneous user sessions across
//            browser tabs/windows for Real-Time Collaboration)
// ============================================================

const Auth = {
  _sessionKey: 'tumbuh_session',

  // Login - returns user or null
  login(username, password) {
    const users = DB.getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      const group = user.role === 'murid' ? DB.getGroupByUserId(user.id) : null;
      const session = {
        userId: user.id,
        role: user.role,
        groupId: group ? group.id : (user.groupId || null),
        loginAt: new Date().toISOString()
      };
      sessionStorage.setItem(this._sessionKey, JSON.stringify(session));
      localStorage.setItem(this._sessionKey, JSON.stringify(session));
    }
    return user || null;
  },

  // Logout
  logout() {
    sessionStorage.removeItem(this._sessionKey);
    localStorage.removeItem(this._sessionKey);
    App.navigate('login');
  },

  // Get current session (prioritizes sessionStorage so multiple tabs can log in as different users)
  getSession() {
    try {
      const raw = sessionStorage.getItem(this._sessionKey) || localStorage.getItem(this._sessionKey);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  },

  // Get current user
  getCurrentUser() {
    const session = this.getSession();
    if (!session) return null;
    const u = DB.getUserById(session.userId);
    if (u && u.role === 'murid') {
      const g = DB.getGroupByUserId(u.id);
      u.groupId = g ? g.id : (u.groupId || null);
    }
    return u;
  },

  // Get current user's group object (for Murid)
  getCurrentGroup() {
    const u = this.getCurrentUser();
    if (!u || u.role !== 'murid') return null;
    return DB.getGroupByUserId(u.id);
  },

  // Check if logged in
  isLoggedIn() {
    return !!this.getCurrentUser();
  },

  // Guard: redirect to login if not authenticated
  requireAuth(allowedRoles = []) {
    const user = this.getCurrentUser();
    if (!user) {
      App.navigate('login');
      return false;
    }
    if (allowedRoles.length && !allowedRoles.includes(user.role)) {
      App.showToast('Akses ditolak! Kamu tidak punya izin untuk halaman ini.', 'error');
      App.navigate('dashboard');
      return false;
    }
    return true;
  },

  // Role checkers
  isAdmin()  { const u = this.getCurrentUser(); return u && u.role === 'admin'; },
  isGuru()   { const u = this.getCurrentUser(); return u && u.role === 'guru'; },
  isMurid()  { const u = this.getCurrentUser(); return u && u.role === 'murid'; },
};
