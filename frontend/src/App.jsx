import React, { useEffect, useState } from 'react';
import EmployeeList from './components/EmployeeList.jsx';
import EmployeeForm from './components/EmployeeForm.jsx';
import Login from './components/Login.jsx';

// A minimal inline Register form with cleaner styling
function Register({ onRegistered, onSwitch }) {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, active: true })
      });
      if (!res.ok) throw new Error('Registration failed');
      const user = await res.json();
      onRegistered(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-8">
      <h2 className="text-3xl font-bold text-slate-900 mb-6">
        Create Account
      </h2>
      {error && <p className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
          <input
            name="firstName"
            placeholder="Enter first name"
            value={form.firstName}
            onChange={onChange}
            required
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
          <input
            name="lastName"
            placeholder="Enter last name"
            value={form.lastName}
            onChange={onChange}
            required
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={onChange}
            required
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={form.password}
            onChange={onChange}
            required
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
          />
        </div>
        <div className="pt-2 flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
          <button
            type="button"
            onClick={onSwitch}
            className="flex-1 rounded-lg bg-slate-100 px-4 py-2.5 font-semibold text-slate-700 hover:bg-slate-200 transition"
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
}

export default function App() {
  const [selected, setSelected] = useState(null);
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('qf_user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const onLoggedIn = (u) => {
    setUser(u);
    localStorage.setItem('qf_user', JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('qf_user');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {!user ? (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            {!showRegister ? (
              <>
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                  <div className="text-center mb-8">
                    <h1 className="text-4xl font-black text-slate-900 mb-2">
                      QUEUEFREE
                    </h1>
                    <p className="text-slate-500">Employee Management System</p>
                  </div>
                  <Login onLoggedIn={onLoggedIn} />
                </div>
                <div className="text-center mt-6">
                  <p className="text-slate-600 mb-2">Don't have an account?</p>
                  <button
                    type="button"
                    onClick={() => setShowRegister(true)}
                    className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition"
                  >
                    Create an account
                  </button>
                </div>
              </>
            ) : (
              <Register onRegistered={onLoggedIn} onSwitch={() => setShowRegister(false)} />
            )}
          </div>
        </div>
      ) : (
        <div className="min-h-screen">
          <nav className="bg-white border-b border-slate-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-black text-slate-900">QUEUEFREE</h1>
                  <p className="text-sm text-slate-500">Employee Management</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                  <button
                    onClick={logout}
                    className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white shadow-lg shadow-red-500/20 hover:bg-red-700 active:bg-red-800 transition"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </nav>
          
          <div className="max-w-7xl mx-auto px-6 py-8">
            <EmployeeForm selected={selected} onSaved={() => setSelected(null)} />
            <EmployeeList onEdit={setSelected} />
          </div>
        </div>
      )}
    </div>
  );
}
