import React from "react";

export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden animate-pulse">
      {/* Card Header Skeleton */}
      <div className="h-24 bg-gradient-to-r from-slate-200 to-slate-300 relative">
        <div className="absolute -bottom-10 left-6">
          <div className="w-20 h-20 rounded-full bg-slate-300 border-4 border-white"></div>
        </div>
        <div className="absolute top-3 right-3">
          <div className="h-6 w-16 bg-slate-300 rounded-full"></div>
        </div>
      </div>

      {/* Card Body Skeleton */}
      <div className="pt-12 px-6 pb-6">
        {/* Name */}
        <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
        {/* Position */}
        <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>

        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-slate-200 rounded"></div>
            <div className="h-4 bg-slate-200 rounded flex-1"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-slate-200 rounded"></div>
            <div className="h-4 bg-slate-200 rounded w-2/3"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-slate-200 rounded"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <div className="flex-1 h-10 bg-slate-200 rounded-lg"></div>
          <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
          <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}
