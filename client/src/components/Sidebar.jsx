import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Shield, 
  LogOut, 
  Settings, 
  Clock,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Sidebar = ({ isMobile }) => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const getLinks = () => {
    switch (user.role) {
      case 'admin':
        return [
          { to: '/admin', icon: <LayoutDashboard size={20} />, label: 'Home' },
          { to: '/admin/users', icon: <Users size={20} />, label: 'Users' },
          { to: '/admin/settings', icon: <Settings size={20} />, label: 'Settings' },
        ];
      case 'security':
        return [
          { to: '/security', icon: <Shield size={20} />, label: 'Scan' },
          { to: '/security/logs', icon: <Clock size={20} />, label: 'Logs' },
        ];
      case 'employee':
        return [
          { to: '/employee', icon: <UserPlus size={20} />, label: 'Visitors' },
          { to: '/employee/invites', icon: <Clock size={20} />, label: 'Invites' },
        ];
      default:
        return [];
    }
  };

  const links = getLinks();

  // --- MOBILE BOTTOM NAV ---
  if (isMobile) {
    return (
      <nav className="glass" style={{ 
        position: 'fixed', 
        bottom: '0', 
        left: '0', 
        right: '0', 
        height: '70px',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 1000,
        borderRadius: '20px 20px 0 0',
        padding: '0 10px'
      }}>
        {links.map((link) => (
          <NavLink 
            key={link.to} 
            to={link.to} 
            style={({ isActive }) => ({
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              color: isActive ? 'var(--primary)' : 'var(--text-muted)',
              fontSize: '0.7rem'
            })}
          >
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}
        <button onClick={logout} style={{ background: 'transparent', color: 'var(--error)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', fontSize: '0.7rem' }}>
          <LogOut size={20} />
          <span>Exit</span>
        </button>
      </nav>
    );
  }

  // --- DESKTOP SIDEBAR ---
  return (
    <motion.aside 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="glass" 
      style={{ 
        width: '260px', 
        height: 'calc(100vh - 40px)', 
        position: 'fixed', 
        left: '20px', 
        top: '20px',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px',
        zIndex: 100,
        backgroundColor: '#0f172a',
        borderRight: '1px solid var(--glass-border)'
      }}
    >
      <div style={{ marginBottom: '40px', padding: '0 12px' }}>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--primary)', fontWeight: '800' }}>SecurePass</h2>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>
          {user.role} Portal
        </p>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {links.map((link) => (
          <NavLink 
            key={link.to} 
            to={link.to} 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '20px', marginTop: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', padding: '0 12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #818cf8, #6366f1)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>
            {user.name.charAt(0)}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: '0.9rem', fontWeight: '600', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{user.name}</p>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{user.email}</p>
          </div>
        </div>
        <button onClick={logout} className="sidebar-link" style={{ width: '100%', color: 'var(--error)' }}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>

      <style>{`
        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 12px;
          color: var(--text-muted);
          transition: all 0.2s ease;
          background: transparent;
        }
        .sidebar-link:hover {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-main);
        }
        .sidebar-link.active {
          background: rgba(129, 140, 248, 0.1);
          color: var(--primary);
          font-weight: 600;
        }
      `}</style>
    </motion.aside>
  );
};

export default Sidebar;
