import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Users, UserPlus, Clock, Shield, LogOut, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/api';

/**
 * AdminDashboard Component
 * Provides a high-level overview of system metrics and visitor traffic.
 */
const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await apiClient.get('/admin/stats');
        setStats(res.data.data);
        setLoading(false);
      } catch (err) {
        toast.error('Failed to load system statistics');
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="loading">Analyzing System Data...</div>;
  if (!stats) return <div style={{ textAlign: 'center', padding: '100px' }}>Dashboard unavailable.</div>;

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1>Admin Analytics</h1>
          <p style={{ color: 'var(--text-muted)' }}>Welcome back, {user?.name}</p>
        </div>
        <button onClick={logout} className="glass" style={{ padding: '10px 20px', color: 'var(--error)' }}>
          Logout
        </button>
      </header>

      {/* Stats Overview */}
      <div className="responsive-grid" style={{ marginBottom: '40px' }}>
        <StatCard icon={<Users color="#6366f1" />} label="Total Users" value={stats.totalUsers} />
        <StatCard icon={<UserPlus color="#22d3ee" />} label="Visitors Today" value={stats.totalVisitorsToday} />
        <StatCard icon={<Shield color="#10b981" />} label="Currently Inside" value={stats.activeVisitors} />
        <StatCard icon={<Clock color="#f59e0b" />} label="Pending Actions" value={stats.pendingApprovals} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        {/* Traffic Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass" 
          style={{ padding: '32px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
            <TrendingUp size={20} color="var(--primary)" />
            <h3>Visitor Traffic (7D)</h3>
          </div>
          <div style={{ height: '350px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.visitorsPerDay}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="_id" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: 'white' }}
                />
                <Area type="monotone" dataKey="count" stroke="var(--primary)" fillOpacity={1} fill="url(#colorCount)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Action Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass" 
          style={{ padding: '32px' }}
        >
          <h3 style={{ marginBottom: '24px' }}>Management Control</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <ActionButton label="User Management" />
            <ActionButton label="Download Access Logs" />
            <ActionButton label="Organization Settings" />
            <ActionButton label="Security Policies" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glass" 
    style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}
  >
    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '16px' }}>
      {icon}
    </div>
    <div>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>{label}</p>
      <h2 style={{ fontSize: '1.8rem' }}>{value}</h2>
    </div>
  </motion.div>
);

const ActionButton = ({ label }) => (
  <button className="glass" style={{ width: '100%', padding: '16px', textAlign: 'left', fontWeight: '500', fontSize: '0.95rem', background: 'rgba(255,255,255,0.02)' }}>
    {label}
  </button>
);

export default AdminDashboard;
