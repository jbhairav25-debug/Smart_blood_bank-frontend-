// ============================================================
//  public/js/api.js — Reusable API helper + auth utils
// ============================================================

const API_BASE = '/api';

// ── Token helpers ─────────────────────────────────────────
const Auth = {
  setToken:  (token) => localStorage.setItem('bb_token', token),
  getToken:  ()      => localStorage.getItem('bb_token'),
  setUser:   (user)  => localStorage.setItem('bb_user',  JSON.stringify(user)),
  getUser:   ()      => { try { return JSON.parse(localStorage.getItem('bb_user')); } catch { return null; } },
  logout:    ()      => { localStorage.removeItem('bb_token'); localStorage.removeItem('bb_user'); window.location.href = '/login'; },
  isLoggedIn:()      => !!localStorage.getItem('bb_token'),
  redirectIfNotLoggedIn: () => {
    if (!Auth.isLoggedIn()) { window.location.href = '/login'; return true; }
    return false;
  },
  redirectByRole: () => {
    const user = Auth.getUser();
    if (!user) { window.location.href = '/login'; return; }
    const routes = { admin: '/admin', donor: '/donor', hospital: '/hospital' };
    window.location.href = routes[user.role] || '/login';
  },
};

// ── Core fetch wrapper ────────────────────────────────────
async function apiFetch(endpoint, options = {}) {
  const token = Auth.getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  const data = await res.json();

  if (res.status === 401 || res.status === 403) {
    // Token expired or unauthorized
    Auth.logout();
    return;
  }

  return { ok: res.ok, status: res.status, data };
}

// ── Convenience methods ───────────────────────────────────
const api = {
  get:    (url)          => apiFetch(url),
  post:   (url, body)    => apiFetch(url, { method: 'POST',  body: JSON.stringify(body) }),
  put:    (url, body)    => apiFetch(url, { method: 'PUT',   body: JSON.stringify(body) }),
  patch:  (url, body)    => apiFetch(url, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (url)          => apiFetch(url, { method: 'DELETE' }),
};

// ── UI Helpers ────────────────────────────────────────────
function showAlert(id, message, type = 'error') {
  const el = document.getElementById(id);
  if (!el) return;
  el.className = `alert alert-${type} show`;
  el.textContent = message;
  setTimeout(() => { el.className = 'alert'; }, 5000);
}

function setLoading(btnId, loading) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.disabled = loading;
  btn.textContent = loading ? 'Please wait...' : btn.dataset.label;
}

function badgeHTML(status) {
  return `<span class="badge badge-${status}">${status}</span>`;
}

function urgencyBadge(urgency) {
  return `<span class="badge badge-${urgency}">${urgency}</span>`;
}

function roleBadge(role) {
  return `<span class="badge badge-${role}">${role}</span>`;
}

function bloodBadge(bg) {
  return `<span style="font-weight:700;color:var(--red-light)">${bg}</span>`;
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
}

function setNavUser() {
  const user = Auth.getUser();
  if (!user) return;
  const el = document.getElementById('nav-user');
  if (!el) return;
  el.innerHTML = `
    <div class="user-pill">
      <div class="avatar">${user.name[0].toUpperCase()}</div>
      <div>
        <div class="uname">${user.name}</div>
        <div class="urole">${user.role}</div>
      </div>
    </div>
  `;
}

function renderEmptyState(containerId, message = 'No records found') {
  const el = document.getElementById(containerId);
  if (el) el.innerHTML = `
    <div class="empty-state">
      <div class="icon">🩸</div>
      <p>${message}</p>
    </div>`;
}
