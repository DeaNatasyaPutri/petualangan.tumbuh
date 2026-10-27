// ============================================================
// AUTH.JS — Authentication & Session Management
// ============================================================

const Auth = {
  _sessionKey: 'tumbuh_session',

  // Login - returns user or null
  login(username, password) {
    const users = DB.getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      const session = { userId: user.id, role: user.role, loginAt: new Date().toISOString() };
      localStorage.setItem(this._sessionKey, JSON.stringify(session));
    }
    return user || null;
  },

  // Logout
  logout() {
    localStorage.removeItem(this._sessionKey);
    App.navigate('login');
  },

  // Get current session
  getSession() {
    try {
      const raw = localStorage.getItem(this._sessionKey);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  },

  // Get current user
  getCurrentUser() {
    const session = this.getSession();
    if (!session) return null;
    return DB.getUserById(session.userId);
  },

  // Check if logged in
  isLoggedIn() {
    return !!this.getSession();
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
