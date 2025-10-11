import React, { useState } from "react";
import AccessDeniedModal from "./AccessDeniedModal.jsx";

export default function EmployeeDetailModal({
  employee,
  onClose,
  onEdit,
  currentUser,
}) {
  const [showAccessDenied, setShowAccessDenied] = useState(false);

  if (!employee) return null;

  const calculateAge = (dob) => {
    if (!dob) return "-";
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const getCurrencySymbol = (currency) => {
    const symbols = {
      USD: "$",
      EUR: "€",
      GBP: "£",
      INR: "₹",
      JPY: "¥",
      AUD: "A$",
      CAD: "C$",
      CHF: "CHF",
      CNY: "¥",
      SEK: "kr",
      NZD: "NZ$",
    };
    return symbols[currency] || currency;
  };

  const canEdit =
    currentUser?.role === "ADMIN" || currentUser?.id === employee.id;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden transform animate-slideUp">
          {/* Header with Gradient */}
          <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-[length:200%_200%] animate-gradientShift p-8 text-white">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition"
            >
              <svg
                className="w-6 h-6"
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
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-bold">
                {employee.firstName?.[0]}
                {employee.lastName?.[0]}
              </div>
              <div>
                <h2 className="text-3xl font-bold">
                  {employee.firstName} {employee.lastName}
                </h2>
                <p className="text-white/90 mt-1">
                  {employee.position || "Employee"} •{" "}
                  {employee.department || "General"}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
            {!employee.firstName ? (
              // Loading skeleton for modal
              <div className="animate-pulse space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-100 rounded-xl h-48"></div>
                  <div className="bg-slate-100 rounded-xl h-48"></div>
                  <div className="bg-slate-100 rounded-xl h-48"></div>
                  <div className="bg-slate-100 rounded-xl h-48"></div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Information */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase">
                        Email
                      </label>
                      <p className="text-slate-900 font-medium">
                        {employee.email}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase">
                        Phone
                      </label>
                      <p className="text-slate-900 font-medium">
                        {employee.phone
                          ? `${employee.phoneCountryCode || "+1"} ${
                              employee.phone
                            }`
                          : "-"}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase">
                        Address
                      </label>
                      <p className="text-slate-900 font-medium">
                        {employee.address || "-"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Employment Details */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Employment Details
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase">
                        Department
                      </label>
                      <p className="text-slate-900 font-medium">
                        {employee.department || "-"}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase">
                        Position
                      </label>
                      <p className="text-slate-900 font-medium">
                        {employee.position || "-"}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase">
                        Hire Date
                      </label>
                      <p className="text-slate-900 font-medium">
                        {employee.hireDate || "-"}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase">
                        Status
                      </label>
                      <p>
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                            employee.active
                              ? "bg-green-100 text-green-800"
                              : "bg-slate-100 text-slate-800"
                          }`}
                        >
                          {employee.active ? "Active" : "Inactive"}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-100">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-emerald-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Personal Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase">
                        Date of Birth
                      </label>
                      <p className="text-slate-900 font-medium">
                        {employee.dateOfBirth || "-"}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase">
                        Age
                      </label>
                      <p className="text-slate-900 font-medium">
                        {calculateAge(employee.dateOfBirth)} years
                      </p>
                    </div>
                  </div>
                </div>

                {/* Financial Information */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-amber-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Financial Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase">
                        Salary
                      </label>
                      <p className="text-slate-900 font-bold text-2xl">
                        {getCurrencySymbol(employee.currency || "USD")}{" "}
                        {Number(employee.salary || 0).toLocaleString()}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {employee.currency || "USD"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-8 py-4 bg-slate-50 border-t border-slate-200">
            <button
              onClick={onClose}
              className="rounded-lg btn-gradient-slate px-4 py-2 font-semibold text-white hover:shadow-lg transition-shadow"
            >
              Close
            </button>
            {canEdit ? (
              <button
                onClick={() => {
                  onEdit(employee);
                  onClose();
                }}
                className="rounded-lg btn-gradient-orange px-4 py-2 font-semibold text-white shadow-lg hover:shadow-xl transition-shadow"
              >
                Edit Employee
              </button>
            ) : (
              <button
                onClick={() => setShowAccessDenied(true)}
                className="rounded-lg bg-slate-200 px-4 py-2 font-semibold text-slate-400 cursor-not-allowed"
              >
                🔒 Contact Admin
              </button>
            )}
          </div>
        </div>

        <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        .animate-gradientShift {
          animation: gradientShift 8s ease infinite;
        }
      `}</style>
      </div>

      <AccessDeniedModal
        isOpen={showAccessDenied}
        onClose={() => setShowAccessDenied(false)}
      />
    </>
  );
}
