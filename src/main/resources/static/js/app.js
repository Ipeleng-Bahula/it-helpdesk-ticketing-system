const API = 'http://localhost:8080/api';

// ── Auth helpers ─────────────────────────────────────────
function getToken()    { return localStorage.getItem('token'); }
function getUser()     { return JSON.parse(localStorage.getItem('user') || '{}'); }
function isLoggedIn()  { return !!getToken(); }

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
  };
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login.html';
}

function requireAuth() {
  if (!isLoggedIn()) window.location.href = '/login.html';
}

// ── API calls ────────────────────────────────────────────
async function apiPost(endpoint, data, auth = false) {
  const headers = auth ? authHeaders() : { 'Content-Type': 'application/json' };
  const res = await fetch(API + endpoint, {
    method: 'POST', headers, body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || 'Request failed');
  }
  return res.json();
}

async function apiGet(endpoint) {
  const res = await fetch(API + endpoint, { headers: authHeaders() });
  if (res.status === 401) { logout(); return; }
  if (!res.ok) throw new Error('Request failed');
  return res.json();
}

async function apiPatch(endpoint, data) {
  const res = await fetch(API + endpoint, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Request failed');
  return res.json();
}

async function apiDelete(endpoint) {
  const res = await fetch(API + endpoint, { method: 'DELETE', headers: authHeaders() });
  if (!res.ok) throw new Error('Request failed');
}

// ── UI helpers ───────────────────────────────────────────
function showAlert(id, message, type = 'error') {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = message;
  el.className = `alert alert-${type}`;
  el.style.display = 'block';
  setTimeout(() => el.style.display = 'none', 4000);
}

function statusBadge(status) {
  return `<span class="badge badge-${status.toLowerCase()}">${status.replace('_', ' ')}</span>`;
}

function priorityBadge(priority) {
  return `<span class="badge badge-${priority.toLowerCase()}">${priority}</span>`;
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-ZA', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
}

// ── Navbar ───────────────────────────────────────────────
function renderNavbar(activePage) {
  const user = getUser();
  const isAdmin = user.role === 'ADMIN' || user.role === 'TECHNICIAN';
  document.getElementById('navbar-username').textContent = user.username || '';
  if (isAdmin && document.getElementById('admin-link')) {
    document.getElementById('admin-link').style.display = 'inline';
  }
}