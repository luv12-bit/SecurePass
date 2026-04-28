import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Download, ArrowLeft, Calendar, User, Building, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '../services/api';
import CONFIG from '../config';

const PassView = () => {
  const { id } = useParams();
  const [visitor, setVisitor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPass = async () => {
      try {
        const res = await apiClient.get(`/visitors/${id}`);
        setVisitor(res.data.data);
      } catch (err) {
        console.error(err);
        toast.error('Pass not found or invalid');
      } finally {
        setLoading(false);
      }
    };
    fetchPass();
  }, [id]);

  if (loading) return <div>Loading Pass...</div>;
  if (!visitor) return <div style={{ textAlign: 'center', padding: '100px' }}>Pass not found.</div>;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '20px' }}>
      <div className="glass" style={{ padding: '40px', width: '100%', maxWidth: '450px', position: 'relative' }}>
        <Link to="/" style={{ position: 'absolute', top: '20px', left: '20px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', textDecoration: 'none' }}>
          <ArrowLeft size={16} /> Back
        </Link>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <ShieldCheck size={48} color="var(--success)" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ letterSpacing: '-0.02em', marginBottom: '5px' }}>Visitor Pass</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Secure Entry Badge</p>
        </div>

        <div style={{ 
          background: 'white', 
          padding: '24px', 
          borderRadius: '24px', 
          marginBottom: '32px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {visitor.qrCode ? (
            <img src={visitor.qrCode} alt="QR Code" style={{ width: '200px', height: '200px' }} />
          ) : (
            <div style={{ width: '200px', height: '200px', background: '#f3f4f6', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
              Pending QR
            </div>
          )}
          <p style={{ color: '#0f172a', fontWeight: '800', marginTop: '16px', fontSize: '1.2rem' }}>
            {visitor.name}
          </p>
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>ID: {visitor._id.slice(-8).toUpperCase()}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Calendar size={18} color="var(--primary)" />
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Date & Time</p>
              <p style={{ fontSize: '0.9rem', margin: 0 }}>{new Date(visitor.createdAt).toLocaleString()}</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Building size={18} color="var(--primary)" />
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Purpose</p>
              <p style={{ fontSize: '0.9rem', margin: 0 }}>{visitor.purpose}</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <User size={18} color="var(--primary)" />
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Host</p>
              <p style={{ fontSize: '0.9rem', margin: 0 }}>{visitor.host?.name || 'N/A'}</p>
            </div>
          </div>
        </div>

        <a 
          href={`${CONFIG.API_BASE_URL}/visitors/${visitor._id}/download`}
          className="btn-primary" 
          style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', textDecoration: 'none' }}
          target="_blank"
          rel="noreferrer"
        >
          <Download size={20} />
          Download PDF Badge
        </a>
      </div>
    </div>
  );
};

export default PassView;
