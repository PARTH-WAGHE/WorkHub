import React, { useEffect, useState } from 'react';
import { createEmployee, updateEmployee } from '../services/api.js';

const empty = {
  firstName: '', lastName: '', email: '', position: '',
  salary: '', hireDate: '', active: true, password: ''
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
        position: selected.position || '',
        salary: selected.salary ?? '',
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
    <form onSubmit={onSubmit} style={{ padding: 12, border: '1px solid #ddd', borderRadius: 8, marginBottom: 20 }}>
      <h2>{form.id ? 'Edit Employee' : 'Add Employee'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <input name="firstName" placeholder="First name" value={form.firstName} onChange={onChange} required />
        <input name="lastName" placeholder="Last name" value={form.lastName} onChange={onChange} required />
        <input name="email" placeholder="Email" type="email" value={form.email} onChange={onChange} required />
        <input name="position" placeholder="Position" value={form.position} onChange={onChange} />
        <input name="salary" placeholder="Salary" type="number" step="0.01" value={form.salary} onChange={onChange} />
        <input name="hireDate" placeholder="Hire date" type="date" value={form.hireDate} onChange={onChange} />
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" name="active" checked={form.active} onChange={onChange} /> Active
        </label>
        <input name="password" placeholder={form.id ? 'New password (optional)' : 'Password'} type="password" value={form.password} onChange={onChange} />
      </div>
      <div style={{ marginTop: 12 }}>
        <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
        {form.id && <button type="button" onClick={() => setForm(empty)} style={{ marginLeft: 8 }}>Cancel</button>}
      </div>
    </form>
  );
}
