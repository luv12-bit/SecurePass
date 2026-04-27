import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { UserPlus, CheckCircle, ArrowLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../services/api';

/**
 * VisitorRegistration Component
 * Public-facing form for visitors to pre-register.
 */
const VisitorRegistration = () => {
  const [employees, setEmployees] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [visitorId, setVisitorId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    purpose: '',
    idType: 'Aadhaar',
    idNumber: '',
    host: '',
  });

  const navigate = useNavigate();

  // Load employee list for host selection
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await apiClient.get('/auth/employees');
        setEmployees(res.data.data);
      } catch (err) {
        toast.error('Failed to load host list. Please refresh.');
      }
    };
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * Submit registration form
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.host) {
      return toast.error('Please select a host employee');
    }

    try {
      const res = await apiClient.post('/visitors', formData);
      setVisitorId(res.data.data._id);
      setIsSuccess(true);
      toast.success('Registration successful!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Try again.');
    }
  };

  // Success View: Displayed after successful registration
  if (isSuccess) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '20px' }}>
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass" 
          style={{ padding: '48px', textAlign: 'center', maxWidth: '500px', position: 'relative' }}
        >
          <Link to="/" style={{ position: 'absolute', top: '20px', left: '20px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem' }}>
            <ArrowLeft size={16} />
            Back
          </Link>
          <CheckCircle size={80} color="var(--success)" style={{ marginBottom: '24px' }} />
          <h2 style={{ marginBottom: '16px' }}>Registration Complete</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px', lineHeight: '1.6' }}>
            Your request has been sent to the host. Once approved, you will receive your digital pass link.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={() => navigate(`/pass/${visitorId}`)} 
              className="btn-primary" 
              style={{ flex: 1 }}
            >
              View Pass Status
            </button>
            <button 
              onClick={() => navigate('/')} 
              className="glass" 
              style={{ flex: 1 }}
            >
              Back to Home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Form View: Main registration form
  return (
    <div style={{ padding: '40px 20px', minHeight: '100vh', position: 'relative' }}>
      <Link to="/" style={{ position: 'absolute', top: '40px', left: '40px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '1rem' }}>
        <ArrowLeft size={18} />
        Back to Home
      </Link>
      
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Visitor Registration</h2>
        <p style={{ color: 'var(--text-muted)' }}>Fill in your details for a digital entry pass</p>
      </header>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass" 
        style={{ maxWidth: '800px', margin: '0 auto', padding: '40px' }}
      >
        <form onSubmit={handleSubmit}>
          <div className="responsive-grid" style={{ marginBottom: '24px' }}>
            <div>
              <label className="label">Full Name</label>
              <input name="name" className="input-field" placeholder="Enter your name" required onChange={handleChange} />
            </div>
            <div>
              <label className="label">Email Address</label>
              <input name="email" type="email" className="input-field" placeholder="email@example.com" required onChange={handleChange} />
            </div>
            <div>
              <label className="label">Phone Number</label>
              <input name="phone" className="input-field" placeholder="+91 00000 00000" required onChange={handleChange} />
            </div>
            <div>
              <label className="label">Purpose of Visit</label>
              <input name="purpose" className="input-field" placeholder="e.g., Business Meeting" required onChange={handleChange} />
            </div>
            <div>
              <label className="label">ID Type</label>
              <select name="idType" className="input-field" required onChange={handleChange}>
                <option value="Aadhaar">Aadhaar</option>
                <option value="PAN">PAN</option>
                <option value="Passport">Passport</option>
                <option value="Driving License">Driving License</option>
              </select>
            </div>
            <div>
              <label className="label">ID Number</label>
              <input name="idNumber" className="input-field" placeholder="Enter ID number" required onChange={handleChange} />
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label className="label">Select Host (Whom are you meeting?)</label>
            <select name="host" className="input-field" required onChange={handleChange}>
              <option value="">Choose an employee...</option>
              {employees.map(emp => (
                <option key={emp._id} value={emp._id}>{emp.name} ({emp.email})</option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
            <UserPlus size={20} />
            Submit Registration
          </button>
        </form>
      </motion.div>
      
      <style>{`
        .label { display: block; margin-bottom: 8px; font-size: 0.9rem; font-weight: 600; color: var(--text-muted); }
      `}</style>
    </div>
  );
};

export default VisitorRegistration;
