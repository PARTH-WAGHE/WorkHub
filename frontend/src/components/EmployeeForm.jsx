import React, { useEffect, useState } from 'react';
import { createEmployee, updateEmployee } from '../services/api.js';

const empty = {
  firstName: '', lastName: '', email: '', phone: '',
  department: '', position: '', address: '',
  salary: '', dateOfBirth: '', hireDate: '', active: true, password: ''
};

export default function EmployeeForm({ selected, onSaved }) {
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selected) {
      setForm({
        id: selected.id,
        firstName: selected.firstName || '',
        lastName: selected.lastName || '',
        email: selected.email || '',
        phone: selected.phone || '',
        department: selected.department || '',
        position: selected.position || '',
        address: selected.address || '',
        salary: selected.salary ?? '',
        dateOfBirth: selected.dateOfBirth || '',
        hireDate: selected.hireDate || '',
        active: !!selected.active,
        password: ''
      });
    } else {
      setForm(empty);
    }
  }, [selected]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...form,
        salary: form.salary === '' ? null : Number(form.salary),
      };
      if (!form.id && !form.password) throw new Error('Password is required for new employees');
      if (!form.password) delete payload.password;

      if (form.id) {
        await updateEmployee(form.id, payload);
      } else {
        await createEmployee(payload);
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
    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 mb-6">
      <h2 className="text-xl font-bold text-slate-900 mb-4">
        {form.id ? 'Edit Employee' : 'Add Employee'}
      </h2>
      {error && <p className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">First name *</label>
            <input
              name="firstName"
              placeholder="First name"
              value={form.firstName}
              onChange={onChange}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Last name *</label>
            <input
              name="lastName"
              placeholder="Last name"
              value={form.lastName}
              onChange={onChange}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
            <input
              name="email"
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={onChange}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
            <input
              name="phone"
              placeholder="Phone number"
              type="tel"
              value={form.phone}
              onChange={onChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
            <input
              name="department"
              placeholder="Department"
              value={form.department}
              onChange={onChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Position</label>
            <input
              name="position"
              placeholder="Position"
              value={form.position}
              onChange={onChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
            <input
              name="address"
              placeholder="Full address"
              value={form.address}
              onChange={onChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Salary</label>
            <input
              name="salary"
              placeholder="Salary"
              type="number"
              step="0.01"
              value={form.salary}
              onChange={onChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
            <input
              name="dateOfBirth"
              type="date"
              value={form.dateOfBirth}
              onChange={onChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Hire date</label>
            <input
              name="hireDate"
              type="date"
              value={form.hireDate}
              onChange={onChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password {form.id && '(optional)'}</label>
            <input
              name="password"
              placeholder={form.id ? 'New password' : 'Password'}
              type="password"
              value={form.password}
              onChange={onChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            />
          </div>
          <div className="flex items-end pb-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="active"
                checked={form.active}
                onChange={onChange}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-200"
              />
              <span className="text-sm font-medium text-slate-700">Active</span>
            </label>
          </div>
        </div>
        <div className="mt-6 flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
          {form.id && (
            <button
              type="button"
              onClick={() => setForm(empty)}
              className="rounded-lg bg-slate-100 px-6 py-2.5 font-semibold text-slate-700 hover:bg-slate-200 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
