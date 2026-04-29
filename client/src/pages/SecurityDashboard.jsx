import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import toast from 'react-hot-toast';
import { Scan, LogIn, LogOut, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/api';

const SecurityDashboard = () => {
  const [isScanning, setIsScanning] = useState(false);
  const { user, logout } = useAuth();
  const scannerRef = useRef(null);

  useEffect(() => {
    if (isScanning && !scannerRef.current) {
      // Basic scanner setup
      const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
      scannerRef.current = scanner;

      scanner.render((text) => {
        setIsScanning(false);
        scanner.clear();
        
        apiClient.post('/visitors/checkin', { qrCode: text })
          .then(() => toast.success('Check-in Successful!'))
          .catch((err) => {
            if (err.response?.data?.message?.includes('already checked in')) {
              apiClient.post('/visitors/checkout', { qrCode: text })
                .then(() => toast.success('Check-out Successful!'))
                .catch(() => toast.error('Checkout failed'));
            } else {
              toast.error('Invalid Pass');
            }
          });
      });
    }
  }, [isScanning]);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2>Security Portal</h2>
          <p>User: {user?.name}</p>
        </div>
        <button onClick={logout} style={{ padding: '8px 16px', cursor: 'pointer' }}>
          Logout
        </button>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        <div className="glass" style={{ padding: '40px', textAlign: 'center' }}>
          {!isScanning ? (
            <div>
              <div style={{ 
                background: 'rgba(34, 211, 238, 0.1)', 
                width: '100px', 
                height: '100px', 
                borderRadius: '30px', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                margin: '0 auto 24px'
              }}>
                <Scan size={48} color="var(--accent)" />
              </div>
              <h2>Ready to Scan</h2>
              <p style={{ opacity: 0.7, marginBottom: '30px' }}>
                Position the visitor's QR code in front of the camera.
              </p>
              <button 
                onClick={() => setIsScanning(true)} 
                style={{ padding: '15px 40px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1.1rem' }}
              >
                Start Camera
              </button>
            </div>
          ) : (
            <div>
              <div id="reader" style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}></div>
              <button 
                onClick={() => setIsScanning(false)} 
                style={{ marginTop: '20px', padding: '10px 30px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', margin: '20px auto 0' }}
              >
                <X size={18} /> Stop Scanner
              </button>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <LogIn color="var(--success)" size={32} />
            <div>
              <p style={{ margin: 0, opacity: 0.7 }}>Check-ins Today</p>
              <h3 style={{ margin: 0 }}>12</h3>
            </div>
          </div>
          <div className="glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <LogOut color="var(--warning)" size={32} />
            <div>
              <p style={{ margin: 0, opacity: 0.7 }}>Active Inside</p>
              <h3 style={{ margin: 0 }}>5</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityDashboard;
