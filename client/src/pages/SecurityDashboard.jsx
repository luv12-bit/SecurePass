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
      scannerRef.current = new Html5QrcodeScanner("reader", { 
        fps: 10, 
        qrbox: { width: 250, height: 250 } 
      }, false);

      scannerRef.current.render(onScanSuccess, (err) => {
        // ignore errors for missing frames
      });
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Scanner error", err));
        scannerRef.current = null;
      }
    };
  }, [isScanning]);

  const onScanSuccess = async (decodedText) => {
    setIsScanning(false);
    
    if (scannerRef.current) {
      await scannerRef.current.clear();
      scannerRef.current = null;
    }

    try {
      // First try to check in
      try {
        await apiClient.post('/visitors/checkin', { qrCode: decodedText });
        toast.success('Check-in Successful!');
      } catch (err) {
        // If already checked in, try checking out
        if (err.response?.data?.message?.includes('already checked in')) {
          await apiClient.post('/visitors/checkout', { qrCode: decodedText });
          toast.success('Check-out Successful!');
        } else {
          throw err;
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Invalid Pass');
    }
  };

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

      <style>{`
        #reader { border: none !important; background: transparent !important; }
        #reader__dashboard_section_fa { display: none !important; }
        #reader__dashboard_section_csr { margin-bottom: 20px !important; }
        #reader__dashboard_section_csr button {
          background: var(--primary) !important; color: white !important;
          border-radius: 8px !important; padding: 8px 16px !important; border: none !important; cursor: pointer;
        }
        #reader__camera_selection {
          background: #1e293b !important; color: white !important; padding: 10px !important;
          border-radius: 8px !important; width: 100% !important; max-width: 300px; margin-bottom: 15px;
        }
        #reader__scan_region { border-radius: 12px !important; overflow: hidden !important; }
        #reader video { border-radius: 12px !important; object-fit: cover !important; }
        #reader span { color: white !important; }
      `}</style>
    </div>
  );
};

export default SecurityDashboard;
