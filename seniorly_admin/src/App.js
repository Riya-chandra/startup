import React, { useEffect, useMemo, useState } from 'react';
import './App.css';

// Get API URL from env, warn if not set in production
const getAPIUrl = () => {
  const url = process.env.REACT_APP_API_URL;
  if (!url && process.env.NODE_ENV === 'production') {
    console.error('⚠️ REACT_APP_API_URL not set in production. Admin panel will not work.');
    return null;
  }
  return url || 'http://localhost:5000';
};
const API = getAPIUrl();

const sessionStatuses = ['upcoming', 'live', 'completed', 'cancelled'];
const webinarStatuses = ['draft', 'published', 'archived'];
const userRoles = ['student', 'instructor', 'admin'];

function getStoredAuth() {
  const token = localStorage.getItem('seniorly_token') || '';
  const userRaw = localStorage.getItem('seniorly_user');
  let user = null;
  try {
    user = userRaw ? JSON.parse(userRaw) : null;
  } catch (e) {
    user = null;
  }
  return { token, user };
}

export default function App() {
  const [token, setToken] = useState('');
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [webinars, setWebinars] = useState([]);
  const [users, setUsers] = useState([]);

  const [sessionForm, setSessionForm] = useState({
    title: '',
    level: 'Beginner',
    status: 'upcoming',
    price: 400,
    seatsLimit: 200,
    launchLabel: 'Launching Soon',
    launchDate: '',
    description: '',
  });

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  const isAdmin = useMemo(() => user?.role === 'admin', [user]);

  async function adminFetch(path, options = {}, overrideToken) {
    const authToken = overrideToken || token;
    const res = await fetch(`${API}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
        ...(options.headers || {}),
      },
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Request failed');
    }
    return data;
  }

  async function loadDashboard(currentToken = token) {
    setLoading(true);
    try {
      const [dash, sessionData, webinarData, userData] = await Promise.all([
        adminFetch('/api/admin/dashboard', {}, currentToken),
        adminFetch('/api/admin/sessions', {}, currentToken),
        adminFetch('/api/admin/webinars', {}, currentToken),
        adminFetch('/api/admin/users', {}, currentToken),
      ]);

      setStats(dash.data);
      setSessions(sessionData.data || []);
      setWebinars(webinarData.data || []);
      setUsers(userData.data || []);
      setAuthError('');
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const stored = getStoredAuth();
    setToken(stored.token);
    setUser(stored.user);

    if (stored.token && stored.user?.role === 'admin') {
      loadDashboard(stored.token);
    } else {
      setLoading(false);
    }
  }, []);

  async function handleAdminLogin(e) {
    e.preventDefault();
    setBusy(true);
    setAuthError('');
    setMessage('');

    try {
      const res = await fetch(`${API}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Login failed');
      }
      if (data.user?.role !== 'admin') {
        throw new Error('Only admin accounts can access this panel');
      }

      localStorage.setItem('seniorly_token', data.token);
      localStorage.setItem('seniorly_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      setMessage('Admin login successful');
      await loadDashboard(data.token);
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function createSession(e) {
    e.preventDefault();
    setBusy(true);
    setMessage('');

    try {
      await adminFetch('/api/admin/sessions', {
        method: 'POST',
        body: JSON.stringify({
          ...sessionForm,
          price: Number(sessionForm.price),
          seatsLimit: Number(sessionForm.seatsLimit),
          launchDate: sessionForm.launchDate || undefined,
        }),
      });

      setSessionForm({
        title: '',
        level: 'Beginner',
        status: 'upcoming',
        price: 400,
        seatsLimit: 200,
        launchLabel: 'Launching Soon',
        launchDate: '',
        description: '',
      });
      setMessage('Session created successfully');
      await loadDashboard();
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function updateSessionStatus(id, status) {
    try {
      await adminFetch(`/api/admin/sessions/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      await loadDashboard();
    } catch (err) {
      setAuthError(err.message);
    }
  }

  async function deleteSession(id) {
    const yes = window.confirm('Delete this session permanently?');
    if (!yes) return;
    try {
      await adminFetch(`/api/admin/sessions/${id}`, { method: 'DELETE' });
      await loadDashboard();
    } catch (err) {
      setAuthError(err.message);
    }
  }

  async function updateWebinarStatus(id, status) {
    try {
      await adminFetch(`/api/admin/webinars/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      await loadDashboard();
    } catch (err) {
      setAuthError(err.message);
    }
  }

  async function deleteWebinar(id) {
    const yes = window.confirm('Delete this webinar permanently?');
    if (!yes) return;
    try {
      await adminFetch(`/api/admin/webinars/${id}`, { method: 'DELETE' });
      await loadDashboard();
    } catch (err) {
      setAuthError(err.message);
    }
  }

  async function updateUserRole(id, role) {
    try {
      await adminFetch(`/api/admin/users/${id}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role }),
      });
      await loadDashboard();
    } catch (err) {
      setAuthError(err.message);
    }
  }

  async function updateUserStatus(id, isActive) {
    try {
      await adminFetch(`/api/admin/users/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive }),
      });
      await loadDashboard();
    } catch (err) {
      setAuthError(err.message);
    }
  }

  function logout() {
    localStorage.removeItem('seniorly_token');
    localStorage.removeItem('seniorly_user');
    setToken('');
    setUser(null);
    setStats(null);
    setSessions([]);
    setWebinars([]);
    setUsers([]);
  }

  if (!isAdmin) {
    return (
      <div className="admin-shell admin-auth-bg">
        <div className="admin-login-card">
          <h1>Seniorly Admin Panel</h1>
          <p>Admin account se login karo to sessions, webinars aur users manage kar sako.</p>

          <form onSubmit={handleAdminLogin} className="admin-form">
            <label>
              Email
              <input
                type="email"
                required
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                placeholder="admin@seniorly.com"
              />
            </label>

            <label>
              Password
              <input
                type="password"
                required
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                placeholder="Enter password"
              />
            </label>

            <button disabled={busy} type="submit">{busy ? 'Logging in...' : 'Login as Admin'}</button>
          </form>

          {authError && <div className="admin-alert error">{authError}</div>}
          {message && <div className="admin-alert ok">{message}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <div>
          <h1>Seniorly Control Room</h1>
          <p>Live sessions banao, status control karo, aur unwanted content delete karo.</p>
        </div>
        <div className="admin-header-actions">
          <button onClick={() => loadDashboard()}>Refresh</button>
          <button className="danger" onClick={logout}>Logout</button>
        </div>
      </header>

      {authError && <div className="admin-alert error">{authError}</div>}
      {message && <div className="admin-alert ok">{message}</div>}

      {loading ? (
        <div className="admin-card">Loading admin data...</div>
      ) : (
        <>
          <section className="admin-grid cards-4">
            <article className="admin-card stat-card">
              <h4>Total Users</h4>
              <strong>{stats?.totals?.users || 0}</strong>
            </article>
            <article className="admin-card stat-card">
              <h4>All Sessions</h4>
              <strong>{stats?.totals?.sessions || 0}</strong>
            </article>
            <article className="admin-card stat-card">
              <h4>Live Sessions</h4>
              <strong>{stats?.highlights?.liveSessions || 0}</strong>
            </article>
            <article className="admin-card stat-card">
              <h4>Published Webinars</h4>
              <strong>{stats?.highlights?.publishedWebinars || 0}</strong>
            </article>
          </section>

          <section className="admin-card">
            <h2>Create Session</h2>
            <form onSubmit={createSession} className="admin-grid form-grid">
              <label>
                Title
                <input
                  required
                  value={sessionForm.title}
                  onChange={(e) => setSessionForm({ ...sessionForm, title: e.target.value })}
                />
              </label>

              <label>
                Level
                <select
                  value={sessionForm.level}
                  onChange={(e) => setSessionForm({ ...sessionForm, level: e.target.value })}
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                  <option>Beginner to Advanced</option>
                </select>
              </label>

              <label>
                Status
                <select
                  value={sessionForm.status}
                  onChange={(e) => setSessionForm({ ...sessionForm, status: e.target.value })}
                >
                  {sessionStatuses.map((status) => <option key={status}>{status}</option>)}
                </select>
              </label>

              <label>
                Price
                <input
                  type="number"
                  min="0"
                  value={sessionForm.price}
                  onChange={(e) => setSessionForm({ ...sessionForm, price: e.target.value })}
                />
              </label>

              <label>
                Seats Limit
                <input
                  type="number"
                  min="1"
                  value={sessionForm.seatsLimit}
                  onChange={(e) => setSessionForm({ ...sessionForm, seatsLimit: e.target.value })}
                />
              </label>

              <label>
                Launch Label
                <input
                  value={sessionForm.launchLabel}
                  onChange={(e) => setSessionForm({ ...sessionForm, launchLabel: e.target.value })}
                />
              </label>

              <label>
                Launch Date
                <input
                  type="datetime-local"
                  value={sessionForm.launchDate}
                  onChange={(e) => setSessionForm({ ...sessionForm, launchDate: e.target.value })}
                />
              </label>

              <label className="wide">
                Description
                <textarea
                  rows="3"
                  value={sessionForm.description}
                  onChange={(e) => setSessionForm({ ...sessionForm, description: e.target.value })}
                />
              </label>

              <div>
                <button type="submit" disabled={busy}>{busy ? 'Saving...' : 'Create Session'}</button>
              </div>
            </form>
          </section>

          <section className="admin-card">
            <h2>Session Management</h2>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Level</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((s) => (
                    <tr key={s._id}>
                      <td>{s.title}</td>
                      <td>
                        <select value={s.status} onChange={(e) => updateSessionStatus(s._id, e.target.value)}>
                          {sessionStatuses.map((status) => <option key={status}>{status}</option>)}
                        </select>
                      </td>
                      <td>{s.level}</td>
                      <td>Rs {s.price || 0}</td>
                      <td>
                        <button className="danger" onClick={() => deleteSession(s._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="admin-card">
            <h2>Webinar Management</h2>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Level</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {webinars.map((w) => (
                    <tr key={w._id}>
                      <td>{w.title}</td>
                      <td>
                        <select value={w.status} onChange={(e) => updateWebinarStatus(w._id, e.target.value)}>
                          {webinarStatuses.map((status) => <option key={status}>{status}</option>)}
                        </select>
                      </td>
                      <td>{w.level}</td>
                      <td>
                        <button className="danger" onClick={() => deleteWebinar(w._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="admin-card">
            <h2>User Controls</h2>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td>{u.firstName} {u.lastName}</td>
                      <td>{u.email}</td>
                      <td>
                        <select value={u.role} onChange={(e) => updateUserRole(u._id, e.target.value)}>
                          {userRoles.map((role) => <option key={role}>{role}</option>)}
                        </select>
                      </td>
                      <td>
                        <button
                          className={u.isActive ? 'warning' : 'ok'}
                          onClick={() => updateUserStatus(u._id, !u.isActive)}
                        >
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
