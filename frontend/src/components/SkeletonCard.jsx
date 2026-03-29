import React from "react";

export default function SkeletonCard({ theme = "light" }) {
  const isDark = theme === "dark";

  return (
    <div
      className={`rounded-xl border overflow-hidden animate-pulse ${
        isDark
          ? "bg-slate-900 border-slate-700 shadow-[0_18px_36px_rgba(2,6,23,0.42)]"
          : "bg-white border-slate-200 shadow-md"
      }`}
    >
      {/* Card Header Skeleton */}
      <div
        className={`h-24 relative ${
          isDark
            ? "bg-gradient-to-r from-slate-700 to-slate-600"
            : "bg-gradient-to-r from-slate-200 to-slate-300"
        }`}
      >
        <div className="absolute -bottom-10 left-6">
          <div
            className={`h-20 w-20 rounded-full border-4 ${
              isDark ? "bg-slate-700 border-slate-900" : "bg-slate-300 border-white"
            }`}
          ></div>
        </div>
        <div className="absolute top-3 right-3">
          <div
            className={`h-6 w-16 rounded-full ${
              isDark ? "bg-slate-700" : "bg-slate-300"
            }`}
          ></div>
        </div>
      </div>

      {/* Card Body Skeleton */}
      <div className="pt-12 px-6 pb-6">
        {/* Name */}
        <div
          className={`h-6 rounded w-3/4 mb-2 ${
            isDark ? "bg-slate-700" : "bg-slate-200"
          }`}
        ></div>
        {/* Position */}
        <div
          className={`h-4 rounded w-1/2 mb-4 ${
            isDark ? "bg-slate-700" : "bg-slate-200"
          }`}
        ></div>

        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded ${isDark ? "bg-slate-700" : "bg-slate-200"}`}></div>
            <div className={`h-4 rounded flex-1 ${isDark ? "bg-slate-700" : "bg-slate-200"}`}></div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded ${isDark ? "bg-slate-700" : "bg-slate-200"}`}></div>
            <div className={`h-4 rounded w-2/3 ${isDark ? "bg-slate-700" : "bg-slate-200"}`}></div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded ${isDark ? "bg-slate-700" : "bg-slate-200"}`}></div>
            <div className={`h-4 rounded w-1/2 ${isDark ? "bg-slate-700" : "bg-slate-200"}`}></div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <div className={`flex-1 h-10 rounded-lg ${isDark ? "bg-slate-700" : "bg-slate-200"}`}></div>
          <div className={`w-10 h-10 rounded-lg ${isDark ? "bg-slate-700" : "bg-slate-200"}`}></div>
          <div className={`w-10 h-10 rounded-lg ${isDark ? "bg-slate-700" : "bg-slate-200"}`}></div>
        </div>
      </div>
    </div>
  );
}
