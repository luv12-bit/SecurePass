import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <aside style={{ width: '250px', background: '#1e293b', color: 'white', padding: '20px', minHeight: '100vh', position: 'fixed', left: 0, top: 0 }}>
      <h2>SecurePass</h2>
      <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '30px' }}>Role: {user.role}</p>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {user.role === 'admin' && (
          <>
            <Link to="/admin" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
            <Link to="/admin/users" style={{ color: 'white', textDecoration: 'none' }}>Users</Link>
            <Link to="/admin/settings" style={{ color: 'white', textDecoration: 'none' }}>Settings</Link>
          </>
        )}
        
        {user.role === 'security' && (
          <>
            <Link to="/security" style={{ color: 'white', textDecoration: 'none' }}>Scanner</Link>
            <Link to="/security/logs" style={{ color: 'white', textDecoration: 'none' }}>Logs</Link>
          </>
        )}

        {user.role === 'employee' && (
          <>
            <Link to="/employee" style={{ color: 'white', textDecoration: 'none' }}>My Visitors</Link>
            <Link to="/employee/invites" style={{ color: 'white', textDecoration: 'none' }}>Invites</Link>
          </>
        )}
      </nav>

      <div style={{ position: 'absolute', bottom: '20px', left: '20px' }}>
        <p style={{ marginBottom: '10px' }}>{user.email}</p>
        <button onClick={logout} style={{ padding: '8px 16px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
