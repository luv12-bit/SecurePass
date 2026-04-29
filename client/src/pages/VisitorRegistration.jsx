import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { UserPlus, CheckCircle, ArrowLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../services/api';

const VisitorRegistration = () => {
  const [employees, setEmployees] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [visitorId, setVisitorId] = useState(null);
  const [errors, setErrors] = useState({});
  const [photo, setPhoto] = useState(null);
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

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await apiClient.get('/auth/employees');
        setEmployees(res.data.data);
      } catch (err) {
        toast.error('Failed to load host list.');
      }
    };
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Manual validation
    let validationErrors = {};
    if (!formData.name) validationErrors.name = 'Full Name is required';
    if (!formData.email) {
      validationErrors.email = 'Email is required';
    } else if (!formData.email.includes('@')) {
      validationErrors.email = 'Must be a valid email';
    }
    if (!formData.phone || formData.phone.length < 10) validationErrors.phone = 'Phone must be at least 10 digits';
    if (!formData.purpose) validationErrors.purpose = 'Purpose is required';
    if (!formData.idType) validationErrors.idType = 'ID Type is required';
    if (!formData.idNumber) validationErrors.idNumber = 'ID Number is required';
    if (!formData.host) validationErrors.host = 'Please select a host';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please fix the errors in the form');
      return;
    }
    
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      if (photo) {
        data.append('photo', photo);
      }

      const res = await apiClient.post('/visitors', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setVisitorId(res.data.data._id);
      setIsSuccess(true);
      toast.success('Registration successful!');
    } catch (err) {
      console.error(err);
      if (err.response?.data?.errors) {
        toast.error(err.response.data.errors[0].msg);
      } else {
        toast.error(err.response?.data?.message || 'Registration failed');
      }
    }
  };

  if (isSuccess) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '20px' }}>
        <div className="glass" style={{ padding: '48px', textAlign: 'center', maxWidth: '500px', position: 'relative' }}>
          <Link to="/" style={{ position: 'absolute', top: '20px', left: '20px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', textDecoration: 'none' }}>
            <ArrowLeft size={16} /> Back
          </Link>
          <CheckCircle size={80} color="var(--success)" style={{ marginBottom: '24px' }} />
          <h2 style={{ marginBottom: '16px' }}>Registration Complete</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px', lineHeight: '1.6' }}>
            Your request has been sent to the host. Once approved, you will receive your digital pass link.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => navigate(`/pass/${visitorId}`)} className="btn-primary" style={{ flex: 1 }}>
              View Pass Status
            </button>
            <button onClick={() => navigate('/')} className="glass" style={{ flex: 1, padding: '12px' }}>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 20px', minHeight: '100vh', position: 'relative' }}>
      <Link to="/" style={{ position: 'absolute', top: '40px', left: '40px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '1rem', textDecoration: 'none' }}>
        <ArrowLeft size={18} /> Back to Home
      </Link>
      
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Visitor Registration</h2>
        <p style={{ color: 'var(--text-muted)' }}>Fill in your details for a digital entry pass</p>
      </header>

      <div className="glass" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px' }}>Full Name</label>
              <input name="name" className="input-field" placeholder="Enter your name" onChange={handleChange} />
              {errors.name && <span style={{ color: 'var(--error)', fontSize: '0.8rem' }}>{errors.name}</span>}
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px' }}>Email Address</label>
              <input name="email" className="input-field" placeholder="email@example.com" onChange={handleChange} />
              {errors.email && <span style={{ color: 'var(--error)', fontSize: '0.8rem' }}>{errors.email}</span>}
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px' }}>Phone Number</label>
              <input name="phone" className="input-field" placeholder="Phone Number" onChange={handleChange} />
              {errors.phone && <span style={{ color: 'var(--error)', fontSize: '0.8rem' }}>{errors.phone}</span>}
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px' }}>Purpose of Visit</label>
              <input name="purpose" className="input-field" placeholder="e.g., Business Meeting" onChange={handleChange} />
              {errors.purpose && <span style={{ color: 'var(--error)', fontSize: '0.8rem' }}>{errors.purpose}</span>}
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px' }}>ID Type</label>
              <select name="idType" className="input-field" onChange={handleChange} value={formData.idType}>
                <option value="Aadhaar">Aadhaar</option>
                <option value="PAN">PAN</option>
                <option value="Passport">Passport</option>
                <option value="Driving License">Driving License</option>
              </select>
              {errors.idType && <span style={{ color: 'var(--error)', fontSize: '0.8rem' }}>{errors.idType}</span>}
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px' }}>ID Number</label>
              <input name="idNumber" className="input-field" placeholder="Enter ID number" onChange={handleChange} />
              {errors.idNumber && <span style={{ color: 'var(--error)', fontSize: '0.8rem' }}>{errors.idNumber}</span>}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '32px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px' }}>Select Host</label>
              <select name="host" className="input-field" onChange={handleChange}>
                <option value="">Choose an employee...</option>
                {employees.map(emp => (
                  <option key={emp._id} value={emp._id}>{emp.name} ({emp.email})</option>
                ))}
              </select>
              {errors.host && <span style={{ color: 'var(--error)', fontSize: '0.8rem' }}>{errors.host}</span>}
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px' }}>Your Photo</label>
              <input type="file" accept="image/*" className="input-field" onChange={handleFileChange} />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '-10px' }}>Upload a clear photo for identification</p>
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', fontSize: '1.1rem' }}>
            <UserPlus size={20} />
            Submit Registration
          </button>
        </form>
      </div>
    </div>
export default VisitorRegistration;
