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
  const [showErrorToast, setShowErrorToast] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Enforce minimum password length
    if ((form.password || "").length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/employees`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, active: true }),
      });

      if (!res.ok) {
        let errorMsg = "Registration failed";

        try {
          const errorData = await res.json();
          if (errorData?.error) {
            errorMsg = errorData.error;
          } else if (
            res.status === 409 ||
            (errorData?.message &&
              errorData.message.includes("Duplicate entry"))
          ) {
            errorMsg =
              "This email is already registered. Please use a different email or try logging in.";
          }
        } catch (_) {
          // If response is not JSON, check status codes
          if (res.status === 409) {
            errorMsg =
              "This email is already registered. Please use a different email or try logging in.";
          } else if (res.status === 400) {
            errorMsg = "Invalid registration data. Please check your input.";
          }
        }

        throw new Error(errorMsg);
      }

      const user = await res.json();
      onRegistered(user);
    } catch (err) {
      setError(err.message || "Network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      setShowErrorToast(true);
      const timer = setTimeout(() => setShowErrorToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="w-full max-w-md mx-auto p-6 sm:p-8 relative">
      <h2 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 sm:mb-6 text-center">
        Create Account
      </h2>
      {/* Interactive error toast/modal */}
      {showErrorToast && error && (
        <div className="fixed left-1/2 top-6 z-50 transform -translate-x-1/2 animate-fade-in-up">
          <div className="flex items-center gap-2 px-5 py-3 bg-red-500 text-white rounded-xl shadow-lg border border-red-600">
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 5.636l-1.414-1.414A9 9 0 105.636 18.364l1.414-1.414A7 7 0 1116.95 7.05z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01"
              />
            </svg>
            <span className="font-semibold">{error}</span>
            <button
              type="button"
              onClick={() => setShowErrorToast(false)}
              className="ml-3 text-white/80 hover:text-white focus:outline-none"
              aria-label="Dismiss"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="register-firstName"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            First Name
          </label>
          <input
            id="register-firstName"
            name="firstName"
            placeholder="Enter your first name"
            value={form.firstName}
            onChange={onChange}
            required
            autoComplete="given-name"
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
          />
        </div>
        <div>
          <label
            htmlFor="register-lastName"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Last Name
          </label>
          <input
            id="register-lastName"
            name="lastName"
            placeholder="Enter your last name"
            value={form.lastName}
            onChange={onChange}
            required
            autoComplete="family-name"
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
          />
        </div>
        <div>
          <label
            htmlFor="register-email"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Email
          </label>
          <input
            id="register-email"
            type="email"
            name="email"
            placeholder="yourname@gmail.com"
            value={form.email}
            onChange={onChange}
            required
            autoComplete="email"
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
          />
        </div>
        <div>
          <label
            htmlFor="register-password"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="register-password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={onChange}
              required
              minLength={4}
              autoComplete="new-password"
              aria-describedby="password-requirements"
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 pr-10 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
            >
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
          <p id="password-requirements" className="mt-1 text-xs text-slate-500">
            Password must be at least 4 characters long
          </p>
        </div>
        <div className="pt-2 flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            aria-describedby={loading ? "register-loading" : undefined}
            className="flex-1 rounded-lg btn-gradient-orange px-4 py-2.5 font-semibold text-white shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed transition-shadow"
          >
            <span id="register-loading" className="sr-only">
              {loading ? "Creating account, please wait..." : ""}
            </span>
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
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const saved = localStorage.getItem("wh_user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  // Real-time clock update
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
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
    <div className="min-h-screen bg-slate-50 safe-pt safe-pb page-transition">
      {!user ? (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 bg-[length:200%_200%] animate-bg-gradient relative overflow-hidden">
          {/* Enhanced loading animation for background shapes */}
          <div className="absolute top-0 left-0 w-48 sm:w-96 h-48 sm:h-96 bg-white/10 rounded-full blur-3xl animate-blob transition-all duration-700"></div>
          <div className="absolute top-0 right-0 w-48 sm:w-96 h-48 sm:h-96 bg-white/10 rounded-full blur-3xl animate-blob animation-delay-2000 transition-all duration-700"></div>
          <div className="absolute bottom-0 left-1/2 w-48 sm:w-96 h-48 sm:h-96 bg-white/10 rounded-full blur-3xl animate-blob animation-delay-4000 transition-all duration-700"></div>

          {/* Main content with stagger animation */}
          <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
            <div className="w-full max-w-md relative z-10 stagger-children">
              {!showRegister ? (
                <>
                  <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 border border-white/20">
                    <div className="text-center mb-6 sm:mb-8">
                      <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                        WorkHub
                      </h1>
                      <p className="text-slate-500 text-sm sm:text-base">
                        Employee Management System
                      </p>
                    </div>
                    <Login
                      onLoggedIn={onLoggedIn}
                      onSwitchToRegister={() => setShowRegister(true)}
                    />
                  </div>
                  <div className="text-center mt-4 sm:mt-6">
                    <p className="text-white mb-3 drop-shadow-lg font-medium text-sm sm:text-base">
                      Don't have an account?
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowRegister(true)}
                      className="text-white font-semibold px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg btn-gradient-purple shadow-xl hover:shadow-2xl transition-all border border-white/30 text-sm sm:text-base"
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

          {/* Enhanced footer animation */}
          <footer className="relative z-10 py-3 sm:py-4 text-center px-4 animate-fade-in-up">
            <div className="bg-white/10 backdrop-blur-md rounded-full inline-block px-4 sm:px-8 py-2 sm:py-3 border border-white/30 shadow-lg hover:bg-white/20 transition-all duration-300 animate-footerFadeIn">
              <p className="text-xs sm:text-sm font-medium drop-shadow-lg flex flex-col items-center justify-center">
                <span className="font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent text-lg sm:text-xl animate-gradientText">
                  © 2025 WorkHub
                </span>
                <span className="flex items-center justify-center gap-1 mt-1 animate-fadeIn">
                  Crafted with
                  <span className="inline-block animate-heartbeat text-pink-500 text-lg mx-1">
                    ❤️
                  </span>
                  by
                  <span className="font-bold text-blue-200 hover:text-blue-100 transition-colors cursor-default">
                    Parth Waghe
                  </span>
                  <span className="font-bold text-purple-200 hover:text-purple-100 transition-colors cursor-default">
                    , Sameer Balgar
                  </span>
                  <span className="font-bold text-indigo-200 hover:text-indigo-100 transition-colors cursor-default">
                    , Nidhish Vartak
                  </span>
                  <span className="font-bold text-pink-200 hover:text-pink-100 transition-colors cursor-default">
                    , Vedika Takke
                  </span>
                </span>
                <span className="mt-2 text-xs text-slate-300 animate-fadeIn">
                  Empowering organizations through better employee management
                </span>
              </p>
            </div>
            <style>{`
              @keyframes gradientText {
                0%,100% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
              }
              .animate-gradientText {
                background-size: 200% 200%;
                animation: gradientText 3s ease-in-out infinite;
              }
              @keyframes heartbeat {
                0%, 100% { transform: scale(1); }
                25% { transform: scale(1.15); }
                50% { transform: scale(0.95); }
                75% { transform: scale(1.1); }
              }
              .animate-heartbeat {
                animation: heartbeat 1.2s infinite;
              }
              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              .animate-fadeIn {
                animation: fadeIn 1s ease;
              }
            `}</style>
          </footer>

          {/* Desktop footer bottom */}
          <div className="hidden lg:flex items-center justify-center pt-6 border-t border-slate-200">
            <p className="text-slate-500 text-sm text-center w-full max-w-2xl mx-auto flex flex-col items-center animate-fadeIn">
              <span className="font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent text-lg animate-gradientText">
                © 2025 WorkHub. All rights reserved.
              </span>
              <span className="inline-flex items-center gap-2 mt-2">
                Made with{" "}
                <span className="text-pink-500 animate-heartbeat">❤️</span> by
                the WorkHub Team
              </span>
            </p>
          </div>

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
            @keyframes scaleUp {
              from { 
                opacity: 0;
                transform: scale(0.98);
              }
              to { 
                opacity: 1;
                transform: scale(1);
              }
            }
            @keyframes slideUp {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
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
            .animate-scaleUp {
              animation: scaleUp 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .animate-slideUp {
              animation: slideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
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
        <div className="min-h-screen flex flex-col stagger-children">
          {/* Enhanced nav animation */}
          <nav className="bg-white backdrop-blur-md border-b border-slate-200 shadow-lg flex-shrink-0 relative overflow-hidden animate-scaleUp">
            {/* Desktop-only decorative elements */}
            <div className="hidden xl:block absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-4">
                  {/* Desktop enhanced logo */}
                  <div className="relative group cursor-pointer">
                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-0 group-hover:opacity-30 transition-opacity duration-300 hidden lg:block"></div>
                    <div className="relative">
                      <h1 className="text-xl sm:text-2xl lg:text-3xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent hover:scale-110 transition-transform duration-300">
                        WorkHub
                      </h1>
                      <div className="flex items-center gap-1 sm:gap-2 mt-1">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <p className="text-xs sm:text-sm lg:text-base text-slate-500">
                          Employee Management{" "}
                        </p>
                        {user.role === "ADMIN" && (
                          <>
                            {/* Mobile admin badge */}
                            <span className="lg:hidden inline-flex items-center gap-1 px-1 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold">
                              Admin
                            </span>
                            {/* Desktop admin badge */}
                            <span className="hidden lg:inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-bold shadow-lg">
                              <svg
                                className="w-4 h-4"
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
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* User info and actions - enhanced for desktop */}
                <div className="flex items-center gap-2 sm:gap-6">
                  {/* Enhanced desktop time display */}
                  <div className="hidden lg:flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50 rounded-xl backdrop-blur-sm border border-slate-200 shadow-lg">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-blue-500 animate-pulse"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12,6 12,12 16,14"></polyline>
                      </svg>
                      <div className="flex flex-col">
                        <span className="text-lg font-bold text-slate-800 tabular-nums animate-timeUpdate">
                          {currentTime.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: true,
                          })}
                        </span>
                        <span className="text-sm text-slate-500 font-medium animate-dateSlide">
                          {formatDateDDMMYYYY(currentTime)}
                        </span>
                      </div>
                    </div>
                    {/* Desktop-only live indicator */}
                    <div className="flex items-center gap-1 px-2 py-1 bg-green-100 rounded-full">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                      <span className="text-xs font-medium text-green-700">
                        LIVE
                      </span>
                    </div>
                  </div>

                  {/* Mobile/Tablet time display */}
                  <div className="flex lg:hidden items-center gap-1 px-2 py-1 bg-slate-100 rounded-md">
                    <svg
                      className="w-3 h-3 text-slate-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12,6 12,12 16,14"></polyline>
                    </svg>
                    <span className="text-xs font-medium text-slate-600 tabular-nums">
                      {currentTime.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: false,
                      })}
                    </span>
                  </div>

                  {/* Desktop enhanced user profile card */}
                  <div className="flex items-center gap-2 sm:gap-4">
                    <div className="relative group">
                      {/* Desktop enhanced avatar */}
                      <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs sm:text-sm lg:text-base shadow-lg cursor-default relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer hidden lg:block"></div>
                        <span className="relative z-10">
                          {user.firstName?.[0]}
                          {user.lastName?.[0]}
                        </span>
                      </div>
                      {/* Desktop-only status indicator */}
                      <div className="hidden lg:block absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
                    </div>

                    {/* Enhanced desktop user info */}
                    <div className="hidden sm:block text-right">
                      <div className="lg:bg-gradient-to-r lg:from-slate-50 lg:to-blue-50 lg:px-3 lg:py-2 lg:rounded-lg lg:border lg:border-slate-200">
                        <p className="text-sm lg:text-base font-semibold text-slate-900 flex items-center gap-2">
                          {user.firstName} {user.lastName}
                          {user.role === "ADMIN" && (
                            <span
                              className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"
                              title="Admin User"
                            ></span>
                          )}
                        </p>
                        <p className="text-xs lg:text-sm text-slate-500">
                          {user.email}
                        </p>
                        {/* Desktop-only additional info */}
                        <p className="hidden lg:block text-xs text-slate-400 mt-1">
                          Last login: {new Date().toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Enhanced desktop logout button */}
                    <button
                      onClick={logout}
                      className="group relative rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 lg:py-3 font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-sm lg:text-base"
                    >
                      <span className="relative z-10 flex items-center gap-1 sm:gap-2">
                        <svg
                          className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 group-hover:rotate-12 transition-transform"
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
                        <span className="hidden sm:inline lg:text-base">
                          Logout
                        </span>
                      </span>
                      {/* Desktop-only hover effect */}
                      <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-red-400 to-red-500 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop-only bottom gradient */}
            <div className="hidden xl:block absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>

            <style>{`
              @keyframes timeUpdate {
                0% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.02); opacity: 0.8; }
                100% { transform: scale(1); opacity: 1; }
              }
              @keyframes dateSlide {
                0% { transform: translateX(-2px); opacity: 0.8; }
                100% { transform: translateX(0); opacity: 1; }
              }
              @keyframes shimmer {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
              }
              .animate-timeUpdate {
                animation: timeUpdate 1s ease-in-out;
              }
              .animate-dateSlide {
                animation: dateSlide 0.3s ease-out;
              }
              .animate-shimmer {
                animation: shimmer 2s ease-in-out infinite;
              }
              .tabular-nums {
                font-variant-numeric: tabular-nums;
                font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
              }
            `}</style>
          </nav>

          {/* Content with improved loading states */}
          <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full stagger-children">
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

          {/* Footer with slide-up animation */}
          <footer className="bg-gradient-to-r from-slate-50 via-white to-slate-50 border-t border-slate-200 py-4 sm:py-6 shadow-inner flex-shrink-0 animate-slideUp">
            {/* Enhanced desktop footer */}
            <div className="hidden lg:block">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <h3 className="text-2xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    WorkHub
                  </h3>
                  <div className="w-px h-8 bg-slate-300"></div>
                  <p className="text-slate-600">
                    Streamline Your Workforce Management
                  </p>
                </div>
                <div className="flex items-center gap-6 text-sm text-slate-500">
                  <span>Version 1.0.0</span>
                  <span>•</span>
                  <span>
                    Backend &amp; Frontend:{" "}
                    <span className="font-semibold text-blue-600">Render</span>
                  </span>
                  <span>•</span>
                  <span>
                    Database:{" "}
                    <span className="font-semibold text-green-600">
                      MySQL (Alwaysdata.com)
                    </span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    System Online
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-8 mb-6">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Product</h4>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li>Employee Management</li>
                    <li>Role-based Access</li>
                    <li>Real-time Updates</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">
                    Technology
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li>React 18</li>
                    <li>Spring Boot 3</li>
                    <li>MySQL 8</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">
                    Deployment
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li>Vercel Frontend</li>
                    <li>Render Backend</li>
                    <li>Cloud Database</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Team</h4>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li>Parth Waghe</li>
                    <li>Sameer Balgar</li>
                    <li>Nidhish Vartak</li>
                    <li>Vedika Takke</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Mobile/Tablet simple footer */}
            <div className="lg:hidden flex flex-col items-center justify-center gap-3 sm:gap-4">
              <div className="text-center animate-slideDown">
                <h3 className="text-lg sm:text-xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  WorkHub
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm">
                  Streamline Your Workforce Management
                </p>
              </div>

              {/* Divider */}
              <div className="w-48 sm:w-64 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>

              {/* Team credits - mobile responsive grid */}
              <div className="text-center animate-slideUp">
                <p className="text-slate-600 text-xs sm:text-sm mb-3">
                  Crafted with{" "}
                  <span className="inline-block animate-heartbeat text-red-500">
                    ❤️
                  </span>{" "}
                  by our amazing team
                </p>
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3 max-w-sm sm:max-w-none mx-auto">
                  <span className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-default">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="hidden xs:inline">Parth</span>
                    <span className="xs:hidden">P</span>
                  </span>
                  <span className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-default">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="hidden xs:inline">Sameer</span>
                    <span className="xs:hidden">S</span>
                  </span>
                  <span className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-default">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="hidden xs:inline">Nidhish</span>
                    <span className="xs:hidden">N</span>
                  </span>
                  <span className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 rounded-full bg-gradient-to-r from-pink-500 to-pink-600 text-white text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-default">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="hidden xs:inline">Vedika</span>
                    <span className="xs:hidden">V</span>
                  </span>
                </div>
              </div>
              {/* Copyright */}
              <p className="text-slate-500 text-xs sm:text-sm animate-fadeIn">
                © 2025 WorkHub. All rights reserved.
              </p>
            </div>

            {/* Desktop footer bottom */}
            <div className="hidden lg:flex items-center justify-center pt-6 border-t border-slate-200">
              <p className="text-slate-500 text-sm text-center w-full max-w-2xl mx-auto flex flex-col items-center animate-fadeIn">
                <span className="font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent text-lg animate-gradientText">
                  © 2025 WorkHub. All rights reserved.
                </span>
                <span className="inline-flex items-center gap-2 mt-2">
                  Made with{" "}
                  <span className="text-pink-500 animate-heartbeat">❤️</span> by
                  the WorkHub Team
                </span>
              </p>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}
