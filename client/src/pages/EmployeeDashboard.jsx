import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Check, X, Clock, User, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/api';

/**
 * EmployeeDashboard Component
 * Allows employees to manage visitor requests assigned to them.
 */
const EmployeeDashboard = () => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();

  /**
   * Fetch visitors assigned to the current employee
   */
  const fetchVisitors = async () => {
    try {
      const res = await apiClient.get('/visitors');
      setVisitors(res.data.data);
      setLoading(false);
    } catch (err) {
      toast.error('Failed to load visitors');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  /**
   * Handle visitor status updates (Approve/Reject)
   * @param {string} id 
   * @param {string} status 
   */
  const handleStatusUpdate = async (id, status) => {
    try {
      await apiClient.put(`/visitors/${id}/status`, { status });
      toast.success(`Visitor ${status}`);
      fetchVisitors(); // Refresh list
    } catch (err) {
      const msg = err.response?.data?.message || 'Action failed';
      toast.error(msg);
      console.error('Status Update Error:', err);
    }
  };

  /**
   * Helper to get status color
   * @param {string} status 
   */
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'var(--success)';
      case 'rejected': return 'var(--error)';
      case 'in': return 'var(--accent)';
      case 'out': return 'var(--secondary)';
      default: return 'var(--warning)';
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1>Employee Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>Logged in as <span style={{ color: 'var(--primary)', fontWeight: '600' }}>{user?.name} ({user?.role})</span></p>
        </div>
        <button onClick={logout} className="glass" style={{ padding: '10px 20px', color: 'var(--error)' }}>
          Logout
        </button>
      </header>

      <div className="grid-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
        <AnimatePresence>
          {visitors.map((visitor) => (
            <motion.div 
              key={visitor._id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass"
              style={{ padding: '24px', borderLeft: `4px solid ${getStatusColor(visitor.status)}` }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '12px' }}>
                    <User size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem' }}>{visitor.name}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{visitor.email}</p>
                  </div>
                </div>
                <div style={{ 
                  fontSize: '0.7rem', 
                  padding: '6px 12px', 
                  borderRadius: '12px', 
                  background: 'rgba(255,255,255,0.05)',
                  color: getStatusColor(visitor.status),
                  textTransform: 'uppercase',
                  fontWeight: '800',
                  border: `1px solid ${getStatusColor(visitor.status)}33`,
                  display: 'flex',
                  alignItems: 'center',
                  height: 'fit-content'
                }}>
                  {visitor.status}
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <p style={{ fontSize: '0.9rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} /> {new Date(visitor.createdAt).toLocaleString()}</p>
                <p style={{ fontSize: '0.9rem', opacity: 0.8 }}><strong>Purpose:</strong> {visitor.purpose}</p>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                {visitor.status === 'pending' && (
                  <>
                    <button 
                      onClick={() => handleStatusUpdate(visitor._id, 'approved')}
                      className="btn-primary" 
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                      <Check size={18} /> Approve
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(visitor._id, 'rejected')}
                      className="glass" 
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--error)' }}
                    >
                      <X size={18} /> Reject
                    </button>
                  </>
                )}
                {(visitor.status === 'approved' || visitor.status === 'in') && (
                  <button 
                    disabled
                    className="glass" 
                    style={{ flex: 1, opacity: 0.8, color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '500' }}
                  >
                    {visitor.status === 'in' ? 'Visitor Checked-In' : 'Waiting for Check-in'}
                  </button>
                )}
                {visitor.qrCode && (
                   <a 
                    href={`http://localhost:5001/api/visitors/${visitor._id}/download`} 
                    className="glass"
                    style={{ padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center' }}
                    title="Download Pass"
                   >
                     <Download size={20} />
                   </a>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {visitors.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: '80px 0', opacity: 0.5 }}>
          <User size={64} style={{ marginBottom: '16px' }} />
          <h3>No visitor requests yet</h3>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
