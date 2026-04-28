import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, UserCheck, QrCode, FileText, ArrowRight, Zap, Star } from 'lucide-react';

const Home = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* 1. HERO SECTION */}
      <section style={{ 
        padding: '120px 20px 80px', 
        textAlign: 'center', 
        position: 'relative', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Subtle background glow, no scrollbars */}
        <div style={{ 
          position: 'absolute', 
          top: '0', 
          left: '0', 
          right: '0', 
          height: '500px', 
          background: 'radial-gradient(ellipse at top, rgba(37, 99, 235, 0.15), transparent 70%)', 
          pointerEvents: 'none',
          zIndex: 0 
        }} />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ 
            position: 'relative',
            zIndex: 1,
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            background: 'rgba(20, 184, 166, 0.1)', 
            padding: '8px 20px', 
            borderRadius: '100px', 
            border: '1px solid rgba(20, 184, 166, 0.2)', 
            marginBottom: '32px', 
            fontSize: '0.9rem', 
            color: 'var(--accent)',
            fontWeight: '600'
          }}
        >
          <Zap size={16} fill="currentColor" /> SecurePass Enterprise is live
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ 
            position: 'relative',
            zIndex: 1,
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', 
            marginBottom: '24px', 
            color: 'white',
            fontWeight: '800', 
            letterSpacing: '-0.02em',
            lineHeight: '1.2',
            maxWidth: '800px'
          }}
        >
          Modernize your lobby with <br/>
          <span style={{ color: 'var(--primary)' }}>Digital Visitor Management</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ 
            position: 'relative',
            zIndex: 1,
            color: 'var(--text-muted)', 
            fontSize: 'clamp(1rem, 2vw, 1.25rem)', 
            maxWidth: '600px', 
            marginBottom: '48px', 
            lineHeight: '1.6' 
          }}
        >
          Replace paper logbooks with secure QR passes, real-time tracking, and instant host notifications.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <Link to="/register" className="btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Start Free Trial <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="glass" style={{ padding: '16px 32px', fontSize: '1.1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
            Try Demo
          </Link>
        </motion.div>
      </section>

      {/* 2. TRUSTED BY SECTION */}
      <section style={{ padding: '40px 20px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '32px', fontWeight: '600' }}>Trusted by innovative organizations</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(30px, 8vw, 80px)', flexWrap: 'wrap', opacity: 0.5 }}>
            {['Acme Corp', 'GlobalTech', 'InnovateIO', 'Nexus Systems'].map((company, i) => (
              <span key={i} style={{ fontSize: '1.25rem', fontWeight: '700', letterSpacing: '-0.5px' }}>{company}</span>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURES */}
      <section style={{ padding: '100px 20px', maxWidth: '1200px', margin: '0 auto', flex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', marginBottom: '16px', color: 'white' }}>Everything you need for security</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            A complete suite of tools to manage the entire visitor lifecycle from registration to check-out.
          </p>
        </div>

        <div className="responsive-grid" style={{ gap: '24px' }}>
          <FeatureCard 
            icon={<UserCheck size={28} color="var(--primary)" />}
            title="Pre-Registration"
            desc="Visitors pre-register via phone. Hosts get notified instantly to approve or deny access."
          />
          <FeatureCard 
            icon={<QrCode size={28} color="var(--accent)" />}
            title="Digital QR Passes"
            desc="Approved visitors receive a secure, timed QR code to scan at the front desk."
          />
          <FeatureCard 
            icon={<Shield size={28} color="var(--success)" />}
            title="Rapid Check-in"
            desc="Security staff use our ultra-fast scanner portal to verify identity in seconds."
          />
          <FeatureCard 
            icon={<FileText size={28} color="var(--warning)" />}
            title="Audit Analytics"
            desc="Admins monitor real-time traffic and export detailed compliance logs."
          />
        </div>
      </section>

      {/* 4. FOOTER */}
      <footer style={{ borderTop: '1px solid var(--glass-border)', padding: '60px 20px 40px', background: 'rgba(0,0,0,0.2)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '40px' }}>
          <div style={{ maxWidth: '300px' }}>
            <h2 style={{ fontSize: '1.5rem', color: 'white', marginBottom: '16px', letterSpacing: '-1px' }}>SecurePass</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>Modernizing physical security with digital-first visitor management.</p>
          </div>
          <div style={{ display: 'flex', gap: '80px', flexWrap: 'wrap' }}>
            <div>
              <h4 style={{ color: 'white', marginBottom: '20px', fontSize: '1rem' }}>Product</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li><Link to="/" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Features</Link></li>
                <li><Link to="/" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: 'white', marginBottom: '20px', fontSize: '1rem' }}>Legal</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li><Link to="/" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Privacy Policy</Link></li>
                <li><Link to="/" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Terms of Service</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '60px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          <p>© 2026 SecurePass Technologies Inc.</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className="glass" 
    style={{ padding: '32px', display: 'flex', flexDirection: 'column' }}
  >
    <div style={{ marginBottom: '24px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', padding: '16px', borderRadius: '16px', width: 'fit-content' }}>
      {icon}
    </div>
    <h3 style={{ marginBottom: '12px', fontSize: '1.25rem', color: 'white' }}>{title}</h3>
    <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem' }}>{desc}</p>
  </motion.div>
);

export default Home;
