import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, UserPlus, Clock, Shield, TrendingUp, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await apiClient.get('/admin/stats');
        setStats(res.data.data);
      } catch (err) {
        console.error(err);
        toast.error('Could not load statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleExportCSV = async () => {
    try {
      toast.loading('Preparing CSV...', { id: 'csv' });
      // Fetch all visitors
      const res = await apiClient.get('/visitors');
      const visitors = res.data.data;
      
      if (visitors.length === 0) {
        toast.error('No data to export', { id: 'csv' });
        return;
      }

      // Convert to CSV string
      const headers = ['Name', 'Email', 'Purpose', 'Status', 'Date'];
      const csvRows = [headers.join(',')];
      
      visitors.forEach(v => {
        const row = [
          `"${v.name}"`,
          `"${v.email}"`,
          `"${v.purpose}"`,
          `"${v.status}"`,
          `"${new Date(v.createdAt).toLocaleDateString()}"`
        ];
        csvRows.push(row.join(','));
      });
      
      const csvData = csvRows.join('\n');
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', `visitors_export_${Date.now()}.csv`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast.success('Export downloaded!', { id: 'csv' });
    } catch (err) {
      console.error('Export error', err);
      toast.error('Export failed', { id: 'csv' });
    }
  };

  if (loading) return <div>Loading Admin Data...</div>;
  if (!stats) return <div>No data available</div>;

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2>Admin Dashboard</h2>
          <p>User: {user?.name}</p>
        </div>
        <button onClick={logout} style={{ padding: '8px 16px', cursor: 'pointer' }}>
          Logout
        </button>
      </header>

      {/* Stats Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div className="glass" style={{ padding: '20px', display: 'flex', gap: '15px' }}>
          <Users size={32} color="#6366f1" />
          <div>
            <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>Total Users</p>
            <h3 style={{ margin: 0 }}>{stats.totalUsers}</h3>
          </div>
        </div>
        
        <div className="glass" style={{ padding: '20px', display: 'flex', gap: '15px' }}>
          <UserPlus size={32} color="#22d3ee" />
          <div>
            <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>Visitors Today</p>
            <h3 style={{ margin: 0 }}>{stats.totalVisitorsToday}</h3>
          </div>
        </div>
        
        <div className="glass" style={{ padding: '20px', display: 'flex', gap: '15px' }}>
          <Shield size={32} color="#10b981" />
          <div>
            <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>Inside Now</p>
            <h3 style={{ margin: 0 }}>{stats.activeVisitors}</h3>
          </div>
        </div>

        <div className="glass" style={{ padding: '20px', display: 'flex', gap: '15px' }}>
          <Clock size={32} color="#f59e0b" />
          <div>
            <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>Pending</p>
            <h3 style={{ margin: 0 }}>{stats.pendingApprovals}</h3>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        {/* Traffic Chart */}
        <div className="glass" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <TrendingUp size={20} color="var(--primary)" />
            <h3>Visitor Traffic (7 Days)</h3>
          </div>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.visitorsPerDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="_id" stroke="var(--text-muted)" />
                <YAxis stroke="var(--text-muted)" />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.2} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Action Panel */}
        <div className="glass" style={{ padding: '20px' }}>
          <h3 style={{ marginBottom: '20px' }}>Admin Tools</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <button 
              onClick={handleExportCSV}
              style={{ padding: '15px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
            >
              <Download size={18} /> Export Visitor Data (CSV)
            </button>
            <button style={{ padding: '15px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', cursor: 'pointer' }}>
              Manage Users
            </button>
            <button style={{ padding: '15px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', cursor: 'pointer' }}>
              System Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
