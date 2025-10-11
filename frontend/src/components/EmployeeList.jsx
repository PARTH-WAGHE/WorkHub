import React, { useEffect, useState } from "react";
import { listEmployees, deleteEmployee } from "../services/api.js";
import ConfirmDialog from "./ConfirmDialog.jsx";
import EmployeeDetailModal from "./EmployeeDetailModal.jsx";
import SkeletonCard from "./SkeletonCard.jsx";
import AccessDeniedModal from "./AccessDeniedModal.jsx";

export default function EmployeeList({ onEdit, currentUser, refreshKey }) {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [viewEmployee, setViewEmployee] = useState(null);
  const [showAccessDenied, setShowAccessDenied] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filterKey, setFilterKey] = useState(0);

  async function load() {
    try {
      setLoading(true);
      const startTime = Date.now();

      const data = await listEmployees();

      // Ensure loading shows for at least 1.5 seconds for better UX
      const elapsedTime = Date.now() - startTime;
      const minLoadTime = 1500; // 1.5 seconds

      if (elapsedTime < minLoadTime) {
        await new Promise((resolve) =>
          setTimeout(resolve, minLoadTime - elapsedTime)
        );
      }

      setItems(data);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // Add effect to reload when refreshKey changes
  useEffect(() => {
    if (refreshKey > 0) {
      load();
    }
  }, [refreshKey]);

  // Filter logic
  useEffect(() => {
    let filtered = items;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (e) =>
          e.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.position?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Department filter
    if (departmentFilter !== "all") {
      filtered = filtered.filter((e) => e.department === departmentFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((e) =>
        statusFilter === "active" ? e.active : !e.active
      );
    }

    setFilteredItems(filtered);
    setCurrentPage(1); // Reset to page 1 when filters change
    // Reset animation key when filters change
    setFilterKey((prev) => prev + 1);
  }, [items, searchTerm, departmentFilter, statusFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Get unique departments
  const departments = [
    ...new Set(items.map((e) => e.department).filter(Boolean)),
  ];

  const onDelete = async (id) => {
    if (currentUser?.role !== "ADMIN") {
      setShowAccessDenied(true);
      return;
    }
    await deleteEmployee(id);
    setDeleteConfirm(null);
    await load();
  };

  const handleEdit = (employee) => {
    if (currentUser?.role !== "ADMIN" && currentUser?.id !== employee.id) {
      setShowAccessDenied(true);
      return;
    }
    onEdit(employee);
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

  if (loading)
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-6">
          <div className="h-8 w-48 bg-slate-200 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );

  if (error)
    return (
      <div className="bg-white rounded-xl shadow-md border border-slate-200 p-8">
        <p className="text-red-600">{error}</p>
      </div>
    );

  return (
    <>
      <div className="space-y-4">
        {/* Filter Section */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            Filter Employees
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name, email, position..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 pl-10 pr-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                />
                <svg
                  className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Department Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Department
              </label>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              >
                <option value="all">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          {(searchTerm ||
            departmentFilter !== "all" ||
            statusFilter !== "all") && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-slate-600">
                Showing {filteredItems.length} of {items.length} employees
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setDepartmentFilter("all");
                  setStatusFilter("all");
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            Employees ({filteredItems.length})
          </h2>
          {totalPages > 1 && (
            <p className="text-sm text-slate-600">
              Page {currentPage} of {totalPages}
            </p>
          )}
        </div>

        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-12 text-center animate-fadeIn">
            <svg
              className="w-16 h-16 mx-auto text-slate-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <p className="text-slate-500 text-lg">
              {items.length === 0
                ? "No employees found"
                : "No employees match your filters"}
            </p>
            {items.length > 0 && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setDepartmentFilter("all");
                  setStatusFilter("all");
                }}
                className="mt-4 text-blue-600 hover:text-blue-700 font-semibold"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              key={filterKey}
            >
              {currentItems.map((e, index) => {
                // Alternate direction based on column position in grid
                const columnIndex = index % 3;
                const direction =
                  columnIndex === 0
                    ? "left"
                    : columnIndex === 1
                    ? "center"
                    : "right";

                let animationClass = "animate-slideInLeft";
                if (direction === "right")
                  animationClass = "animate-slideInRight";
                if (direction === "center")
                  animationClass = "animate-slideInCenter";

                const isOwnProfile = currentUser?.id === e.id;
                const canEdit = currentUser?.role === "ADMIN" || isOwnProfile;
                const canDelete =
                  currentUser?.role === "ADMIN" && !isOwnProfile;

                return (
                  <div
                    key={`${e.id}-${filterKey}`}
                    className={`group bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ${animationClass}`}
                    style={{
                      animationDelay: `${index * 80}ms`,
                      animationFillMode: "both",
                    }}
                  >
                    {/* Card Header with Animated Gradient - Different from buttons */}
                    <div className="h-24 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 bg-[length:200%_200%] animate-cardGradient relative">
                      <div className="absolute -bottom-10 left-6">
                        <div className="w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center text-2xl font-bold text-slate-700 border-4 border-white">
                          {e.firstName?.[0]}
                          {e.lastName?.[0]}
                        </div>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                            e.active
                              ? "bg-green-100 text-green-800"
                              : "bg-slate-100 text-slate-800"
                          }`}
                        >
                          {e.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="pt-12 px-6 pb-6">
                      <h3 className="text-xl font-bold text-slate-900 mb-1">
                        {e.firstName} {e.lastName}
                      </h3>
                      <p className="text-sm text-slate-500 mb-4">
                        {e.position || "Employee"}
                      </p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <svg
                            className="w-4 h-4 text-slate-400"
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
                          <span className="truncate">{e.email}</span>
                        </div>
                        {e.phone && (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <svg
                              className="w-4 h-4 text-slate-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                              />
                            </svg>
                            <span>
                              {e.phoneCountryCode || "+1"} {e.phone}
                            </span>
                          </div>
                        )}
                        {e.department && (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <svg
                              className="w-4 h-4 text-slate-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                              />
                            </svg>
                            <span>{e.department}</span>
                          </div>
                        )}
                        {e.salary && (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <svg
                              className="w-4 h-4 text-slate-400"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-semibold">
                              {getCurrencySymbol(e.currency || "USD")}{" "}
                              {Number(e.salary).toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Card Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => setViewEmployee(e)}
                          className="flex-1 rounded-lg btn-gradient-blue px-3 py-2 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-shadow"
                        >
                          View Details
                        </button>
                        {canEdit ? (
                          <button
                            onClick={() => handleEdit(e)}
                            className="rounded-lg btn-gradient-slate px-3 py-2 text-sm font-semibold text-white hover:shadow-lg transition-shadow"
                            title="Edit"
                          >
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
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                        ) : (
                          <button
                            onClick={() => setShowAccessDenied(true)}
                            className="rounded-lg bg-slate-200 px-3 py-2 text-sm font-semibold text-slate-400 cursor-not-allowed"
                            title="Contact Admin"
                          >
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
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                              />
                            </svg>
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => setDeleteConfirm(e)}
                            className="rounded-lg btn-gradient-red px-3 py-2 text-sm font-semibold text-white hover:shadow-lg transition-shadow"
                            title="Delete"
                          >
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
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8 pb-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="rounded-lg px-4 py-2 font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  ← Previous
                </button>

                <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1;
                    // Show first, last, current, and adjacent pages
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                            currentPage === page
                              ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-110"
                              : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return (
                        <span
                          key={page}
                          className="w-10 h-10 flex items-center justify-center text-slate-400"
                        >
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="rounded-lg px-4 py-2 font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        @keyframes cardGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-100px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        @keyframes slideInCenter {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        .animate-cardGradient {
          animation: cardGradient 8s ease infinite;
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .animate-slideInCenter {
          animation: slideInCenter 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .animate-slideInRight {
          animation: slideInRight 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
      `}</style>

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        title="Delete Employee?"
        message={`Are you sure you want to delete ${deleteConfirm?.firstName} ${deleteConfirm?.lastName}? This action cannot be undone.`}
        onConfirm={() => onDelete(deleteConfirm.id)}
        onCancel={() => setDeleteConfirm(null)}
      />

      <EmployeeDetailModal
        employee={viewEmployee}
        onClose={() => setViewEmployee(null)}
        onEdit={onEdit}
        currentUser={currentUser}
      />

      <AccessDeniedModal
        isOpen={showAccessDenied}
        onClose={() => setShowAccessDenied(false)}
      />
    </>
  );
}
