import React from "react";

export default function InfoModal({
  isOpen,
  title,
  message,
  onClose,
  showRegisterButton,
  onRegister,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform animate-slideUpBounce">
        <div className="p-6">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 bg-[length:200%_200%] animate-gradientFlow shadow-lg animate-iconBounce">
            <svg
              className="w-8 h-8 text-white animate-iconRotate"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2 text-center animate-slideDown">
            {title}
          </h3>
          <p
            className="text-slate-600 text-center mb-6 animate-slideDown"
            style={{ animationDelay: "0.1s" }}
          >
            {message}
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 px-6 py-4 bg-slate-50 rounded-b-2xl">
          {showRegisterButton ? (
            <>
              <button
                onClick={onRegister}
                className="rounded-lg btn-gradient-orange px-6 py-2.5 font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all animate-buttonSlideIn"
              >
                Create Account
              </button>
              <button
                onClick={onClose}
                className="rounded-lg bg-slate-200 px-6 py-2.5 font-semibold text-slate-700 hover:bg-slate-300 hover:scale-105 transition-all animate-buttonSlideIn"
                style={{ animationDelay: "0.1s" }}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="rounded-lg btn-gradient-blue px-6 py-2.5 font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all animate-buttonSlideIn"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUpBounce {
          0% { 
            opacity: 0; 
            transform: translateY(30px) scale(0.9); 
          }
          50% { 
            transform: translateY(-10px) scale(1.02); 
          }
          100% { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }
        @keyframes iconBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes iconRotate {
          0% { transform: rotate(0deg) scale(0.5); opacity: 0; }
          50% { transform: rotate(180deg) scale(1.1); }
          100% { transform: rotate(360deg) scale(1); opacity: 1; }
        }
        @keyframes slideDown {
          from { 
            opacity: 0; 
            transform: translateY(-10px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        @keyframes buttonSlideIn {
          from { 
            opacity: 0; 
            transform: translateX(-20px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }
        @keyframes gradientFlow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUpBounce {
          animation: slideUpBounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .animate-iconBounce {
          animation: iconBounce 2s ease-in-out infinite;
          animation-delay: 0.5s;
        }
        .animate-iconRotate {
          animation: iconRotate 0.6s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.4s ease-out;
          animation-fill-mode: both;
        }
        .animate-buttonSlideIn {
          animation: buttonSlideIn 0.4s ease-out;
          animation-fill-mode: both;
        }
        .animate-gradientFlow {
          animation: gradientFlow 3s ease infinite;
        }
      `}</style>
    </div>
  );
}
