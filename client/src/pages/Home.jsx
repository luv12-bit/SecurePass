import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, UserCheck, QrCode, FileText } from 'lucide-react';

const Home = () => {
  return (
    <div className="home-container" style={{ minHeight: '100vh', padding: '40px 20px' }}>
      <header style={{ textAlign: 'center', marginBottom: '80px' }}>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ 
            fontSize: 'clamp(3rem, 10vw, 4.5rem)', 
            marginBottom: '16px', 
            background: 'linear-gradient(to right, var(--primary), var(--accent))', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent',
            fontWeight: '900', 
            letterSpacing: '-0.05em' 
          }}
        >
          SecurePass
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}
        >
          Modern Visitor Management System for Secure Workplaces
        </motion.p>
      </header>

      <div className="grid-container" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '24px', 
        maxWidth: '1200px', 
        margin: '0 auto' 
      }}>
        <FeatureCard 
          icon={<UserCheck size={32} color="var(--primary)" />}
          title="Pre-Registration"
          desc="Register as a visitor in seconds and get instant approval."
          link="/visitor-register"
          btnText="Register Now"
        />
        <FeatureCard 
          icon={<QrCode size={32} color="var(--accent)" />}
          title="Digital Pass"
          desc="Receive a secure QR code on your phone for easy check-in."
          link="/login"
          btnText="View Pass"
        />
        <FeatureCard 
          icon={<Shield size={32} color="#10b981" />}
          title="Fast Check-in"
          desc="Security staff can scan QR codes for paperless entry."
          link="/login"
          btnText="Staff Login"
        />
        <FeatureCard 
          icon={<FileText size={32} color="var(--primary)" />}
          title="Detailed Reports"
          desc="Admins can track visitor trends and export logs with ease."
          link="/login"
          btnText="Admin Portal"
        />
      </div>

      <footer style={{ textAlign: 'center', marginTop: '80px', color: 'var(--text-muted)' }}>
        <p>© 2026 SecurePass Inc. All rights reserved.</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc, link, btnText }) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    className="glass" 
    style={{ padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
  >
    <div style={{ marginBottom: '20px' }}>{icon}</div>
    <h3 style={{ marginBottom: '12px' }}>{title}</h3>
    <p style={{ color: 'var(--text-muted)', marginBottom: '24px', lineHeight: '1.6' }}>{desc}</p>
    <Link to={link} className="btn-primary" style={{ marginTop: 'auto', width: '100%', textAlign: 'center' }}>
      {btnText}
    </Link>
  </motion.div>
);

export default Home;
