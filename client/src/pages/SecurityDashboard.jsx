import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Scan, LogIn, LogOut, ShieldCheck, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/api';

/**
 * SecurityDashboard Component
 * Provides QR scanning functionality for checking visitors in and out.
 */
const SecurityDashboard = () => {
  const [isScanning, setIsScanning] = useState(false);
  const { user, logout } = useAuth();
  const scannerRef = useRef(null);

  // Initialize/Cleanup scanner
  useEffect(() => {
    if (isScanning && !scannerRef.current) {
      scannerRef.current = new Html5QrcodeScanner("reader", { 
        fps: 10, 
        qrbox: { width: 250, height: 250 } 
      }, false);

      scannerRef.current.render(onScanSuccess, (err) => {
        // Silent failure for every frame that doesn't have a QR
      });
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Scanner cleanup failed", err));
        scannerRef.current = null;
      }
    };
  }, [isScanning]);

  /**
   * Success handler for QR Scan
   */
  const onScanSuccess = async (decodedText) => {
    setIsScanning(false);
    
    // Cleanup scanner immediately after successful read
    if (scannerRef.current) {
      await scannerRef.current.clear();
      scannerRef.current = null;
    }

    try {
      // Logic: Try check-in, if already in, perform check-out
      try {
        await apiClient.post('/visitors/checkin', { qrCode: decodedText });
        toast.success('Check-in Successful!');
      } catch (err) {
        if (err.response?.data?.message?.includes('already checked in')) {
          await apiClient.post('/visitors/checkout', { qrCode: decodedText });
          toast.success('Check-out Successful!');
        } else {
          throw err;
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or Expired Pass');
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1>Security Portal</h1>
          <p style={{ color: 'var(--text-muted)' }}>Authenticated as: {user?.name}</p>
        </div>
        <button onClick={logout} className="glass" style={{ padding: '10px 20px', color: 'var(--error)' }}>
          Logout
        </button>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass"
          style={{ padding: '40px', textAlign: 'center' }}
        >
          {!isScanning ? (
            <div style={{ padding: '40px 0' }}>
              <div style={{ 
                background: 'rgba(34, 211, 238, 0.1)', 
                width: '100px', 
                height: '100px', 
                borderRadius: '30px', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                margin: '0 auto 24px',
                transform: 'rotate(-10deg)'
              }}>
                <Scan size={48} color="var(--accent)" />
              </div>
              <h2 style={{ marginBottom: '16px' }}>Ready to Scan</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px' }}>
                Position the visitor's digital pass within the camera frame to verify identity and log access.
              </p>
              <button 
                onClick={() => setIsScanning(true)} 
                className="btn-primary"
                style={{ padding: '16px 60px', fontSize: '1.1rem', borderRadius: '14px' }}
              >
                Launch Camera
              </button>
            </div>
          ) : (
            <div>
              <div id="reader" style={{ width: '100%', maxWidth: '500px', margin: '0 auto', overflow: 'hidden', borderRadius: '24px', border: '2px dashed var(--accent)' }}></div>
              <button 
                onClick={() => setIsScanning(false)} 
                className="glass"
                style={{ marginTop: '30px', padding: '12px 40px', display: 'flex', alignItems: 'center', gap: '8px', margin: '30px auto 0' }}
              >
                <X size={18} /> Cancel Scanner
              </button>
            </div>
          )}
        </motion.div>

        <div className="responsive-grid">
          <StatCard icon={<LogIn color="var(--success)" />} label="Check-ins Today" value="12" />
          <StatCard icon={<LogOut color="var(--warning)" />} label="Active Inside" value="5" />
        </div>
      </div>

      <style>{`
        #reader__dashboard_section_csr button {
          background: var(--primary) !important;
          color: white !important;
          border-radius: 8px !important;
          padding: 8px 16px !important;
          border: none !important;
          font-weight: 600;
        }
        #reader__camera_selection {
          background: #1e293b !important;
          color: white !important;
          padding: 10px !important;
          border-radius: 12px !important;
          border: 1px solid var(--glass-border) !important;
        }
      `}</style>
    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
  <div className="glass" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px' }}>
      {icon}
    </div>
    <div>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{label}</p>
      <h3 style={{ fontSize: '1.5rem' }}>{value}</h3>
    </div>
  </div>
);

export default SecurityDashboard;
