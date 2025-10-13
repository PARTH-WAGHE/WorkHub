import React, { useEffect, useState } from "react";
import { createEmployee, updateEmployee } from "../services/api.js";

const empty = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  phoneCountryCode: "+1",
  department: "",
  position: "",
  address: "",
  salary: "",
  currency: "USD",
  dateOfBirth: "",
  hireDate: "",
  active: true,
  password: "",
};

export default function EmployeeForm({ selected, onSaved }) {
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false); // Add a local state for showing the error toast/modal

  useEffect(() => {
    if (selected) {
      setForm({
        id: selected.id,
        firstName: selected.firstName || "",
        lastName: selected.lastName || "",
        email: selected.email || "",
        phone: selected.phone || "",
        phoneCountryCode: selected.phoneCountryCode || "+1",
        department: selected.department || "",
        position: selected.position || "",
        address: selected.address || "",
        salary: selected.salary ?? "",
        currency: selected.currency || "USD",
        dateOfBirth: selected.dateOfBirth || "",
        hireDate: selected.hireDate || "",
        active: !!selected.active,
        password: "",
      });
    } else {
      setForm(empty);
    }
  }, [selected]);

  useEffect(() => {
    if (error) {
      setShowErrorToast(true);
      // Auto-hide after 3 seconds
      const timer = setTimeout(() => setShowErrorToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const startTime = Date.now();

      const payload = {
        ...form,
        salary: form.salary === "" ? null : Number(form.salary),
        currency: form.currency || "USD",
      };
      if (!form.id && !form.password)
        throw new Error("Password is required for new employees");
      if (!form.password) delete payload.password;

      if (form.id) {
        await updateEmployee(form.id, payload);
      } else {
        await createEmployee(payload);
      }

      // Show saving animation for at least 800ms
      const elapsedTime = Date.now() - startTime;
      const minSaveTime = 800;
      if (elapsedTime < minSaveTime) {
        await new Promise((resolve) =>
          setTimeout(resolve, minSaveTime - elapsedTime)
        );
      }

      setForm(empty);
      onSaved && onSaved();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 mb-6 animate-fade-in-up relative">
      <h2 className="text-xl font-bold text-slate-900 mb-4">
        {form.id ? "Edit Employee" : "Add Employee"}
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
      <form onSubmit={onSubmit}>
        {/* Overlay during save */}
        {saving && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-700 font-semibold">Saving...</p>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="employee-firstName"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              First name *
            </label>
            <input
              id="employee-firstName"
              name="firstName"
              placeholder="First name"
              value={form.firstName}
              onChange={onChange}
              required
              autoComplete="given-name"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            />
          </div>
          <div>
            <label
              htmlFor="employee-lastName"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Last name *
            </label>
            <input
              id="employee-lastName"
              name="lastName"
              placeholder="Last name"
              value={form.lastName}
              onChange={onChange}
              required
              autoComplete="family-name"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            />
          </div>
          <div>
            <label
              htmlFor="employee-email"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Email *
            </label>
            <input
              id="employee-email"
              name="email"
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={onChange}
              required
              autoComplete="email"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            />
          </div>
          <div>
            <label
              htmlFor="employee-phoneCountryCode"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Phone
            </label>
            <div className="flex gap-2">
              <select
                id="employee-phoneCountryCode"
                name="phoneCountryCode"
                value={form.phoneCountryCode}
                onChange={onChange}
                aria-label="Country code"
                className="w-24 rounded-lg border border-slate-300 px-2 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition text-sm"
              >
                <option value="+1">+1 (US)</option>
                <option value="+44">+44 (UK)</option>
                <option value="+91">+91 (IN)</option>
                <option value="+86">+86 (CN)</option>
                <option value="+81">+81 (JP)</option>
                <option value="+49">+49 (DE)</option>
                <option value="+33">+33 (FR)</option>
                <option value="+39">+39 (IT)</option>
                <option value="+61">+61 (AU)</option>
                <option value="+7">+7 (RU)</option>
                <option value="+82">+82 (KR)</option>
                <option value="+55">+55 (BR)</option>
                <option value="+52">+52 (MX)</option>
                <option value="+34">+34 (ES)</option>
                <option value="+31">+31 (NL)</option>
                <option value="+46">+46 (SE)</option>
                <option value="+41">+41 (CH)</option>
                <option value="+64">+64 (NZ)</option>
                <option value="+65">+65 (SG)</option>
                <option value="+971">+971 (AE)</option>
              </select>
              <input
                id="employee-phone"
                name="phone"
                placeholder="Phone number"
                type="tel"
                value={form.phone}
                onChange={onChange}
                autoComplete="tel"
                aria-describedby="employee-phoneCountryCode"
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="employee-department"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Department
            </label>
            <input
              id="employee-department"
              name="department"
              placeholder="Department"
              value={form.department}
              onChange={onChange}
              autoComplete="organization"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            />
          </div>
          <div>
            <label
              htmlFor="employee-position"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Position
            </label>
            <input
              id="employee-position"
              name="position"
              placeholder="Position"
              value={form.position}
              onChange={onChange}
              autoComplete="organization-title"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            />
          </div>
          <div className="md:col-span-2">
            <label
              htmlFor="employee-address"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Address
            </label>
            <input
              id="employee-address"
              name="address"
              placeholder="Full address"
              value={form.address}
              onChange={onChange}
              autoComplete="street-address"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            />
          </div>
          <div>
            <label
              htmlFor="employee-salary"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Salary
            </label>
            <div className="flex gap-2">
              <select
                id="employee-currency"
                name="currency"
                value={form.currency}
                onChange={onChange}
                aria-label="Currency"
                className="w-24 rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="INR">INR</option>
                <option value="JPY">JPY</option>
                <option value="AUD">AUD</option>
                <option value="CAD">CAD</option>
                <option value="CHF">CHF</option>
                <option value="CNY">CNY</option>
                <option value="SEK">SEK</option>
                <option value="NZD">NZD</option>
              </select>
              <input
                id="employee-salary"
                name="salary"
                placeholder="Amount"
                type="number"
                step="0.01"
                value={form.salary}
                onChange={onChange}
                aria-describedby="employee-currency"
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="employee-dateOfBirth"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Date of Birth
            </label>
            <input
              id="employee-dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={form.dateOfBirth}
              onChange={onChange}
              autoComplete="bday"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            />
          </div>
          <div>
            <label
              htmlFor="employee-hireDate"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Hire date
            </label>
            <input
              id="employee-hireDate"
              name="hireDate"
              type="date"
              value={form.hireDate}
              onChange={onChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            />
          </div>
          <div>
            <label
              htmlFor="employee-password"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Password {form.id && "(optional)"}
            </label>
            <div className="relative">
              <input
                id="employee-password"
                name="password"
                placeholder={form.id ? "New password" : "Password"}
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={onChange}
                autoComplete={form.id ? "new-password" : "new-password"}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 pr-10 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
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
          </div>
          <div className="flex items-end pb-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <span
                className={`relative inline-block w-5 h-5 rounded border border-slate-300 transition-colors duration-200 ${
                  form.active
                    ? "bg-blue-600 border-blue-600"
                    : "bg-white border-slate-300"
                }`}
                tabIndex={0}
                role="checkbox"
                aria-checked={form.active}
                onClick={() => setForm((f) => ({ ...f, active: !f.active }))}
                onKeyDown={(e) => {
                  if (e.key === " " || e.key === "Enter") {
                    setForm((f) => ({ ...f, active: !f.active }));
                  }
                }}
              >
                {form.active && (
                  <svg
                    className="absolute left-0 top-0 w-5 h-5 text-white pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </span>
              <span className="text-sm font-medium text-slate-700">Active</span>
            </label>
          </div>
        </div>
        <div className="mt-6 flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg btn-gradient-orange px-6 py-2.5 font-semibold text-white shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed transition-shadow"
          >
            {saving ? "Saving..." : "Save"}
          </button>
          {form.id && (
            <button
              type="button"
              onClick={() => setForm(empty)}
              className="rounded-lg btn-gradient-violet px-6 py-2.5 font-semibold text-white hover:shadow-lg transition-shadow"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
