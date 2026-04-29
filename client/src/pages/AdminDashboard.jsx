import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, UserPlus, Clock, Shield, TrendingUp, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, visitorsRes] = await Promise.all([
          apiClient.get('/admin/stats'),
          apiClient.get('/visitors')
        ]);
        setStats(statsRes.data.data);
        setVisitors(visitorsRes.data.data);
      } catch (err) {
        console.error(err);
        toast.error('Could not load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleExportCSV = async () => {
    try {
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "Name,Email,Purpose,Status\n";
      
      visitors.forEach(v => {
        csvContent += `${v.name},${v.email},${v.purpose},${v.status}\n`;
      });
      
      var encodedUri = encodeURI(csvContent);
      var link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "visitors.csv");
      document.body.appendChild(link);
      link.click();
      toast.success('Exported!');
    } catch (err) {
      toast.error('Failed to export');
    }
  };

  const filteredVisitors = visitors.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         v.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Admin Data...</div>;
  if (!stats) return <div style={{ padding: '40px', textAlign: 'center' }}>No data available</div>;

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 style={{ fontSize: '2rem', color: 'white' }}>Admin Dashboard</h2>
          <p style={{ color: 'var(--text-muted)' }}>Organization: {user?.organization || 'SecurePass'}</p>
        </div>
        <button onClick={logout} className="glass" style={{ padding: '10px 20px', color: 'var(--error)' }}>
          Logout
        </button>
      </header>

      {/* Stats Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <StatCard icon={<Users size={24} />} label="Total Users" value={stats.totalUsers} color="#6366f1" />
        <StatCard icon={<UserPlus size={24} />} label="Today's Visitors" value={stats.totalVisitorsToday} color="#22d3ee" />
        <StatCard icon={<Shield size={24} />} label="Inside Now" value={stats.activeVisitors} color="#10b981" />
        <StatCard icon={<Clock size={24} />} label="Pending" value={stats.pendingApprovals} color="#f59e0b" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        {/* Traffic Chart */}
        <div className="glass" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <TrendingUp size={20} color="var(--primary)" />
            <h3 style={{ margin: 0 }}>Traffic Overview</h3>
          </div>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.visitorsPerDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="_id" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--primary)' }}
                />
                <Area type="monotone" dataKey="count" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '20px', margin: 0 }}>Reports & Tools</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Generate logs and manage system data.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button onClick={handleExportCSV} className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '14px' }}>
              <Download size={18} /> Export Visitor Logs (CSV)
            </button>
            <button className="glass" style={{ padding: '14px', textAlign: 'center' }}>Manage Staff Accounts</button>
            <button className="glass" style={{ padding: '14px', textAlign: 'center' }}>System Audit Logs</button>
          </div>
        </div>
      </div>

      {/* Visitor Management Table */}
      <div className="glass" style={{ padding: '24px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <h3 style={{ margin: 0 }}>Recent Visitors</h3>
          <div style={{ display: 'flex', gap: '12px', flex: 1, maxWidth: '600px' }}>
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              className="input-field" 
              style={{ marginBottom: 0, flex: 2 }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select 
              className="input-field" 
              style={{ marginBottom: 0, flex: 1 }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="in">Checked In</option>
              <option value="out">Checked Out</option>
            </select>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <th style={{ padding: '16px', color: 'var(--text-muted)', fontWeight: '500' }}>Visitor</th>
                <th style={{ padding: '16px', color: 'var(--text-muted)', fontWeight: '500' }}>Purpose</th>
                <th style={{ padding: '16px', color: 'var(--text-muted)', fontWeight: '500' }}>Status</th>
                <th style={{ padding: '16px', color: 'var(--text-muted)', fontWeight: '500' }}>Host</th>
              </tr>
            </thead>
            <tbody>
              {filteredVisitors.map(v => (
                <tr key={v._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontWeight: '500' }}>{v.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{v.email}</div>
                  </td>
                  <td style={{ padding: '16px', fontSize: '0.9rem' }}>{v.purpose}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      padding: '4px 12px', 
                      borderRadius: '100px', 
                      fontSize: '0.75rem', 
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      backgroundColor: v.status === 'in' ? 'rgba(16, 185, 129, 0.1)' : v.status === 'pending' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(255,255,255,0.05)',
                      color: v.status === 'in' ? '#10b981' : v.status === 'pending' ? '#f59e0b' : 'var(--text-muted)',
                      border: `1px solid ${v.status === 'in' ? 'rgba(16, 185, 129, 0.2)' : v.status === 'pending' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255,255,255,0.1)'}`
                    }}>
                      {v.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px', fontSize: '0.9rem' }}>{v.host?.name || '---'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredVisitors.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No visitors found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <div className="glass" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
    <div style={{ background: `${color}15`, color: color, padding: '12px', borderRadius: '12px' }}>
      {icon}
    </div>
    <div>
      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</p>
      <h3 style={{ margin: '4px 0 0', fontSize: '1.5rem', fontWeight: '700' }}>{value}</h3>
    </div>
  </div>
);

export default AdminDashboard;
