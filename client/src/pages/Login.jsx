import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Lock, ArrowLeft } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass" 
        style={{ padding: '40px', width: '100%', maxWidth: '400px', position: 'relative' }}
      >
        <Link to="/" style={{ position: 'absolute', top: '20px', left: '20px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem' }}>
          <ArrowLeft size={16} />
          Back
        </Link>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, var(--primary), var(--accent))', 
            width: '64px', 
            height: '64px', 
            borderRadius: '16px', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            margin: '0 auto 16px'
          }}>
            <Lock color="white" size={32} />
          </div>
          <h2>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)' }}>Login to manage your passes</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Email Address</label>
            <input 
              type="email" 
              className="input-field" 
              placeholder="name@company.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Password</label>
            <input 
              type="password" 
              className="input-field" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%' }}>
            Sign In
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '600' }}>Create one</Link>
        </p>

        <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', fontSize: '0.8rem' }}>
          <p style={{ fontWeight: '600', marginBottom: '8px', color: 'var(--accent)' }}>Demo Credentials:</p>
          <p>Admin: admin@securepass.com</p>
          <p>Security: security@securepass.com</p>
          <p>Employee: sarah@securepass.com</p>
          <p>Pass: password123</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
