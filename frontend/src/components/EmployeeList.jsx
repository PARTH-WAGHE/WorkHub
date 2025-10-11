import React, { useEffect, useState } from 'react';
import { listEmployees, deleteEmployee } from '../services/api.js';
import ConfirmDialog from './ConfirmDialog.jsx';

export default function EmployeeList({ onEdit }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  async function load() {
    try {
      setLoading(true);
      setItems(await listEmployees());
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const onDelete = async (id) => {
    await deleteEmployee(id);
    setDeleteConfirm(null);
    await load();
  };

  if (loading) return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-8 text-center">
      <p className="text-slate-500">Loading...</p>
    </div>
  );

  if (error) return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-8">
      <p className="text-red-600">{error}</p>
    </div>
  );

  return (
    <>
      <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Employees</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Position</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Address</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {items.map(e => (
                <tr key={e.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                    {e.firstName} {e.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{e.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{e.phone || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{e.department || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{e.position || '-'}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate" title={e.address}>
                    {e.address || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      e.active ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {e.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button
                      onClick={() => onEdit(e)}
                      className="text-blue-600 hover:text-blue-800 font-medium transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(e)}
                      className="text-red-600 hover:text-red-800 font-medium transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-slate-500">
                    No employees found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        title="Delete Employee?"
        message={`Are you sure you want to delete ${deleteConfirm?.firstName} ${deleteConfirm?.lastName}? This action cannot be undone.`}
        onConfirm={() => onDelete(deleteConfirm.id)}
        onCancel={() => setDeleteConfirm(null)}
      />
    </>
  );
}
