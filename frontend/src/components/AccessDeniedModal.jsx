import React from "react";

export default function AccessDeniedModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full text-center animate-fade-in-up">
        <div className="mb-3">
          <svg
            className="mx-auto w-10 h-10 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 17v.01M12 7v6m-6 6h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-bold mb-2 text-slate-800">
          Access Restricted
        </h3>
        <p className="text-slate-600 mb-4">
          You do not have permission to perform this action.
          <br />
          Please contact your administrator.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-2 px-5 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow hover:scale-105 transition"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
