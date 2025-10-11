import React, { useEffect, useState } from 'react';
import EmployeeList from './components/EmployeeList.jsx';
import EmployeeForm from './components/EmployeeForm.jsx';
import Login from './components/Login.jsx';

export default function App() {
  const [selected, setSelected] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('qf_user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const onLoggedIn = (u) => {
    setUser(u);
    localStorage.setItem('qf_user', JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('qf_user');
  };

  if (!user) return <Login onLoggedIn={onLoggedIn} />;

  return (
    <div style={{ maxWidth: 900, margin: '20px auto', fontFamily: 'Inter, system-ui, Arial' }}>
      <h1>QUEUEFREE - Employee Management</h1>
      <div style={{ marginBottom: 12 }}>
        <span>Signed in as {user.firstName} {user.lastName} ({user.email})</span>
        <button onClick={logout} style={{ marginLeft: 8 }}>Logout</button>
      </div>
      <EmployeeForm selected={selected} onSaved={() => setSelected(null)} />
      <EmployeeList onEdit={setSelected} />
    </div>
  );
}
