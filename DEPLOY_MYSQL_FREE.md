import { useEffect, useState, useRef } from "react";
import EmployeeForm from "./components/EmployeeForm.jsx";
import EmployeeList from "./components/EmployeeList.jsx";
import Login from "./components/Login.jsx";

// Use env API base (e.g. http://localhost:3000). Falls back to relative.
const API_BASE = (import.meta.env?.VITE_API_BASE_URL || "").replace(/\/$/, "");

// Format date as DD/MM/YYYY
const formatDateDDMMYYYY = (date) => {
const d = new Date(date);
const dd = String(d.getDate()).padStart(2, "0");
const mm = String(d.getMonth() + 1).padStart(2, "0");
const yyyy = d.getFullYear();
return `${dd}/${mm}/${yyyy}`;
};

// A minimal inline Register form with cleaner styling
function Register({ onRegistered, onSwitch }) {
const [form, setForm] = useState({
firstName: "",
lastName: "",
email: "",
password: "",
});
const [error, setError] = useState(null);
const [loading, setLoading] = useState(false);
const [showPassword, setShowPassword] = useState(false);

const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

const onSubmit = async (e) => {
e.preventDefault();
setError(null);

    // Enforce minimum password length
    if ((form.password || "").length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/employees`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, active: true }),
      });
      if (!res.ok) throw new Error("Registration failed");
      const user = await res.json();
      onRegistered(user);
    } catch (err) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }

};

return (
<div className="w-full max-w-md mx-auto p-8">
<h2 className="text-3xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 text-center">
Create Account
</h2>
{error && (
<p className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
{error}
</p>
)}
<form onSubmit={onSubmit} className="space-y-4">
<div>
<label className="block text-sm font-medium text-slate-700 mb-1">
First Name
</label>
<input
            name="firstName"
            placeholder="Enter your first name"
            value={form.firstName}
            onChange={onChange}
            required
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
          />
</div>
<div>
<label className="block text-sm font-medium text-slate-700 mb-1">
Last Name
</label>
<input
            name="lastName"
            placeholder="Enter your last name"
            value={form.lastName}
            onChange={onChange}
            required
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
          />
</div>
<div>
<label className="block text-sm font-medium text-slate-700 mb-1">
Email
</label>
<input
            type="email"
            name="email"
            placeholder="yourname@company.com"
            value={form.email}
            onChange={onChange}
            required
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
          />
</div>
<div>
<label className="block text-sm font-medium text-slate-700 mb-1">
Password
</label>
<div className="relative">
<input
type={showPassword ? "text" : "password"}
name="password"
placeholder="Enter your password"
value={form.password}
onChange={onChange}
required
minLength={4}
className="w-full rounded-lg border border-slate-300 px-4 py-2.5 pr-10 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
/>
<button
type="button"
onClick={() => setShowPassword(!showPassword)}
className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition" >
{showPassword ? (
<svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
<path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
</svg>
) : (
<svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
<path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
<path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
</svg>
)}
</button>
</div>
</div>
<div className="pt-2 flex items-center gap-3">
<button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-lg btn-gradient-orange px-4 py-2.5 font-semibold text-white shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed transition-shadow"
          >
{loading ? "Creating account..." : "Register"}
</button>
<button
            type="button"
            onClick={onSwitch}
            className="flex-1 rounded-lg btn-gradient-violet px-4 py-2.5 font-semibold text-white hover:shadow-lg transition-shadow"
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
const formRef = useRef(null);
const [refreshKey, setRefreshKey] = useState(0);

useEffect(() => {
const saved = localStorage.getItem("wh_user");
if (saved) setUser(JSON.parse(saved));
}, []);

const onLoggedIn = (u) => {
setUser(u);
localStorage.setItem("wh_user", JSON.stringify(u));
};

const logout = () => {
setUser(null);
localStorage.removeItem("wh_user");
};

const handleEdit = (employee) => {
setSelected(employee);
setTimeout(() => {
formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
}, 100);
};

const handleSaved = async () => {
setSelected(null);
// Refresh user data if editing own profile
if (selected?.id === user.id) {
// Fetch fresh user data from server
try {
const res = await fetch(`${API_BASE}/api/employees/${user.id}`);
if (res.ok) {
const updatedUser = await res.json();
setUser(updatedUser);
localStorage.setItem("wh_user", JSON.stringify(updatedUser));
}
} catch (e) {
console.error("Failed to refresh user data", e);
}
}
// Trigger list refresh
setRefreshKey((prev) => prev + 1);
};

return (
<div className="min-h-screen bg-slate-50">
{!user ? (
<div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 bg-[length:200%_200%] animate-bg-gradient relative overflow-hidden">
{/_ Animated background shapes _/}
<div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-blob"></div>
<div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
<div className="absolute bottom-0 left-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>

          {/* Main content area */}
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="w-full max-w-md relative z-10">
              {!showRegister ? (
                <>
                  <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
                    <div className="text-center mb-8">
                      <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                        WorkHub
                      </h1>
                      <p className="text-slate-500">
                        Employee Management System
                      </p>
                    </div>
                    <Login
                      onLoggedIn={onLoggedIn}
                      onSwitchToRegister={() => setShowRegister(true)}
                    />
                  </div>
                  <div className="text-center mt-6">
                    <p className="text-white mb-3 drop-shadow-lg font-medium">
                      Don't have an account?
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowRegister(true)}
                      className="text-white font-semibold px-6 py-2.5 rounded-lg btn-gradient-purple shadow-xl hover:shadow-2xl transition-all border border-white/30"
                    >
                      Create an account
                    </button>
                  </div>
                </>
              ) : (
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20">
                  <Register
                    onRegistered={onLoggedIn}
                    onSwitch={() => setShowRegister(false)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Footer at bottom */}
          <footer className="relative z-10 py-4 text-center">
            <div className="bg-white/10 backdrop-blur-md rounded-full inline-block px-8 py-3 border border-white/30 shadow-lg hover:bg-white/20 transition-all duration-300 animate-footerFadeIn">
              <p className="text-white text-sm font-medium drop-shadow-lg">
                © 2025 <span className="font-black">WorkHub</span>. Crafted with{" "}
                <span className="inline-block animate-heartbeat text-red-400">
                  ❤️
                </span>{" "}
                by{" "}
                <span className="font-bold text-blue-200 hover:text-blue-100 transition-colors cursor-default">
                  Parth Waghe
                </span>
                ,{" "}
                <span className="font-bold text-purple-200 hover:text-purple-100 transition-colors cursor-default">
                  Sameer Balgar
                </span>
                ,{" "}
                <span className="font-bold text-indigo-200 hover:text-indigo-100 transition-colors cursor-default">
                  Nidhish Vartak
                </span>{" "}
                &{" "}
                <span className="font-bold text-pink-200 hover:text-pink-100 transition-colors cursor-default">
                  Vedika Takke
                </span>
              </p>
            </div>
          </footer>

          <style>{`
            @keyframes bg-gradient {
              0%, 100% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
            }
            @keyframes blob {
              0%, 100% { transform: translate(0px, 0px) scale(1); }
              33% { transform: translate(30px, -50px) scale(1.1); }
              66% { transform: translate(-20px, 20px) scale(0.9); }
            }
            @keyframes heartbeat {
              0%, 100% { transform: scale(1); }
              10%, 30% { transform: scale(1.1); }
              20%, 40% { transform: scale(0.95); }
            }
            @keyframes footerFadeIn {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .animate-bg-gradient {
              animation: bg-gradient 15s ease infinite;
            }
            .animate-blob {
              animation: blob 7s infinite;
            }
            .animate-heartbeat {
              animation: heartbeat 1.5s ease-in-out infinite;
            }
            .animate-footerFadeIn {
              animation: footerFadeIn 0.8s ease-out;
            }
            .animation-delay-2000 {
              animation-delay: 2s;
            }
            .animation-delay-4000 {
              animation-delay: 4s;
            }
          `}</style>
        </div>
      ) : (
        <div className="min-h-screen flex flex-col">
          <nav className="bg-white backdrop-blur-md border-b border-slate-200 shadow-lg flex-shrink-0 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 py-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Animated logo */}
                  <div className="relative group cursor-pointer">
                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                    <div className="relative">
                      <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent hover:scale-110 transition-transform duration-300">
                        WorkHub
                      </h1>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <p className="text-sm text-slate-500">
                          Employee Management{" "}
                        </p>
                        {user.role === "ADMIN" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold shadow-md transition-shadow">
                            <svg
                              className="w-3 h-3"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Admin Dashboard
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* User info and actions */}
                <div className="flex items-center gap-6">
                  {/* Current time - always visible */}
                  <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-slate-100/80 rounded-lg backdrop-blur-sm">
                    <svg
                      className="w-4 h-4 text-slate-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12,6 12,12 16,14"></polyline>
                    </svg>
                    <span className="text-sm font-medium text-slate-700">
                      {new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span className="text-xs text-slate-500">
                      {formatDateDDMMYYYY(new Date())}
                    </span>
                  </div>

                  {/* User profile card */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      {/* User avatar */}
                      <div
                        className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-lg cursor-default"
                        title={`${user.firstName} ${user.lastName}`}
                        tabIndex={-1}
                      >
                        {user.firstName?.[0]}
                        {user.lastName?.[0]}
                      </div>
                    </div>

                    {/* User info - always visible on desktop */}
                    <div className="hidden md:block text-right">
                      <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                        {user.firstName} {user.lastName}
                        {user.role === "ADMIN" && (
                          <span
                            className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"
                            title="Admin User"
                          ></span>
                        )}
                      </p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>

                    {/* Animated logout button */}
                    <button
                      onClick={logout}
                      className="group relative rounded-lg btn-gradient-red px-4 py-2 font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        <svg
                          className="w-4 h-4 group-hover:rotate-12 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Logout
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <style>{`
              @keyframes shimmer {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
              }
              .animate-shimmer {
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                background-size: 200% 100%;
                animation: shimmer 2s infinite;
              }
            `}</style>
          </nav>

          <div className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full">
            {/* Show form only to admin or when user is editing their own profile */}
            {(user.role === "ADMIN" ||
              (selected && selected.id === user.id)) && (
              <div ref={formRef}>
                <EmployeeForm selected={selected} onSaved={handleSaved} />
              </div>
            )}

            {/* Show employee list to everyone with conditional buttons */}
            <EmployeeList
              onEdit={handleEdit}
              currentUser={user}
              refreshKey={refreshKey}
            />
          </div>

          {/* Footer - More spacious */}
          <footer className="bg-gradient-to-r from-slate-50 via-white to-slate-50 border-t border-slate-200 py-6 shadow-inner flex-shrink-0">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col items-center justify-center gap-4">
                {/* Logo and tagline */}
                <div className="text-center animate-slideDown">
                  <h3 className="text-xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                    WorkHub
                  </h3>
                  <p className="text-slate-500 text-sm">
                    Streamline Your Workforce Management
                  </p>
                </div>

                {/* Divider */}
                <div className="w-64 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>

                {/* Team credits */}
                <div className="text-center animate-slideUp">
                  <p className="text-slate-600 text-sm mb-3">
                    Crafted with{" "}
                    <span className="inline-block animate-heartbeat text-red-500">
                      ❤️
                    </span>{" "}
                    by our amazing team
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-default">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Parth Waghe
                    </span>
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-default">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Sameer Balgar
                    </span>
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-sm font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-default">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Nidhish Vartak
                    </span>
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-pink-600 text-white text-sm font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-default">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Vedika Takke
                    </span>
                  </div>
                </div>
                {/* Copyright */}
                <p className="text-slate-500 text-sm animate-fadeIn">
                  © 2025 WorkHub. All rights reserved.
                </p>
              </div>
            </div>

            <style>{`
              @keyframes heartbeat {
                0%, 100% { transform: scale(1); }
                10%, 30% { transform: scale(1.2); }
                20%, 40% { transform: scale(0.95); }
              }
              @keyframes slideDown {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
              }
              @keyframes slideUp {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
              }
              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              .animate-heartbeat {
                animation: heartbeat 1.5s ease-in-out infinite;
              }
              .animate-slideDown {
                animation: slideDown 0.6s ease-out;
              }
              .animate-slideUp {
                animation: slideUp 0.6s ease-out;
                animation-delay: 0.2s;
                animation-fill-mode: both;
              }
              .animate-fadeIn {
                animation: fadeIn 0.8s ease-out;
                animation-delay: 0.4s;
                animation-fill-mode: both;
              }
            `}</style>
          </footer>
        </div>
      )}
    </div>

);
}
