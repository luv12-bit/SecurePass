import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Check, X, Clock, User, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/api';
import { useSocket } from '../hooks/useSocket';
import CONFIG from '../config';

const EmployeeDashboard = () => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const socket = useSocket();

  const fetchVisitors = async () => {
    try {
      const res = await apiClient.get('/visitors');
      setVisitors(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load visitors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('new_visitor', (data) => {
        toast.success(data.message, {
          duration: 6000,
          position: 'top-right',
          icon: '🔔',
          style: { background: '#10b981', color: '#fff' },
        });
        fetchVisitors(); 
      });

      return () => {
        socket.off('new_visitor');
      };
    }
  }, [socket]);

  const handleStatusUpdate = async (id, status) => {
    try {
      await apiClient.put(`/visitors/${id}/status`, { status });
      toast.success(`Visitor marked as ${status}`);
      fetchVisitors(); 
    } catch (err) {
      console.error(err);
      toast.error('Action failed');
    }
  };

  const getStatusColor = (status) => {
    if (status === 'approved') return 'var(--success)';
    if (status === 'rejected') return 'var(--error)';
    if (status === 'in') return 'var(--accent)';
    if (status === 'out') return 'var(--secondary)';
    return 'var(--warning)';
  };

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h2>Employee Dashboard</h2>
          <p>Logged in as: {user?.name}</p>
        </div>
        <button onClick={logout} style={{ padding: '8px 16px', cursor: 'pointer' }}>
          Logout
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
        {visitors.map((visitor) => (
          <div 
            key={visitor._id}
            className="glass"
            style={{ padding: '20px', borderLeft: `4px solid ${getStatusColor(visitor.status)}` }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '50%' }}>
                  <User size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{visitor.name}</h3>
                  <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.8 }}>{visitor.email}</p>
                </div>
              </div>
              <div style={{ 
                fontSize: '0.75rem', 
                padding: '4px 8px', 
                borderRadius: '8px', 
                color: getStatusColor(visitor.status),
                border: `1px solid ${getStatusColor(visitor.status)}`,
                display: 'flex',
                alignItems: 'center',
                height: 'fit-content',
                textTransform: 'uppercase'
              }}>
                {visitor.status}
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Clock size={14} /> {new Date(visitor.createdAt).toLocaleString()}
              </p>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>Purpose: {visitor.purpose}</p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              {visitor.status === 'pending' && (
                <>
                  <button 
                    onClick={() => handleStatusUpdate(visitor._id, 'approved')}
                    style={{ flex: 1, padding: '10px', background: 'var(--success)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }}
                  >
                    <Check size={16} /> Approve
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(visitor._id, 'rejected')}
                    style={{ flex: 1, padding: '10px', background: 'var(--error)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }}
                  >
                    <X size={16} /> Reject
                  </button>
                </>
              )}
              {(visitor.status === 'approved' || visitor.status === 'in') && (
                <button 
                  disabled
                  style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '8px', opacity: 0.5 }}
                >
                  {visitor.status === 'in' ? 'Checked-In' : 'Awaiting Arrival'}
                </button>
              )}
              {visitor.qrCode && (
                 <a 
                  href={`${CONFIG.API_BASE_URL}/visitors/${visitor._id}/download`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ padding: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', color: 'white' }}
                 >
                   <Download size={18} />
                 </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {visitors.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: '50px', opacity: 0.7 }}>
          <User size={48} style={{ marginBottom: '10px' }} />
          <p>No visitor requests right now.</p>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
