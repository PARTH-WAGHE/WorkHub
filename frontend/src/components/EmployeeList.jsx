import React, { useEffect, useState } from 'react';
import { listEmployees, deleteEmployee } from '../services/api.js';

export default function EmployeeList({ onEdit }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    if (!confirm('Delete employee?')) return;
    await deleteEmployee(id);
    await load();
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Employees</h2>
      <table width="100%" cellPadding="8" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th align="left">Name</th>
            <th align="left">Email</th>
            <th align="left">Position</th>
            <th align="right">Salary</th>
            <th align="left">Hired</th>
            <th align="left">Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(e => (
            <tr key={e.id} style={{ borderTop: '1px solid #ddd' }}>
              <td>{e.firstName} {e.lastName}</td>
              <td>{e.email}</td>
              <td>{e.position}</td>
              <td align="right">{Number(e.salary || 0).toLocaleString()}</td>
              <td>{e.hireDate}</td>
              <td>{e.active ? 'Yes' : 'No'}</td>
              <td>
                <button onClick={() => onEdit(e)}>Edit</button>
                <button onClick={() => onDelete(e.id)} style={{ marginLeft: 8 }}>Delete</button>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr><td colSpan="7" align="center">No employees</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
