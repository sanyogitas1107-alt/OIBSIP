import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // 1. Basic Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      // 2. Send Data to Backend
      await axios.post('http://localhost:5000/api/auth/register', {
        email: formData.email,
        password: formData.password
      });

      alert("Registration Successful! Please Login.");
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || "Registration Failed. Try again.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay}>
        
        <div style={styles.card}>
          <div style={styles.header}>
            <h1 style={styles.logo}>🍕 Pizza<span style={{color: '#FFC107'}}>Paradise</span></h1>
            <p style={styles.subtitle}>Join us for the best slice in town!</p>
          </div>

          <form onSubmit={handleRegister} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <input 
                type="email" 
                name="email" 
                placeholder="e.g. newuser@pizza.com" 
                onChange={handleChange} 
                required 
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input 
                type="password" 
                name="password" 
                placeholder="Create a strong password" 
                onChange={handleChange} 
                required 
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Confirm Password</label>
              <input 
                type="password" 
                name="confirmPassword" 
                placeholder="Repeat password" 
                onChange={handleChange} 
                required 
                style={styles.input}
              />
            </div>

            {error && <div style={styles.errorMsg}>{error}</div>}

            <button type="submit" style={styles.button}>
              Create Account ➔
            </button>
          </form>

          <div style={styles.footer}>
            <p>Already have an account? <Link to="/login" style={styles.link}>Login here</Link></p>
            <p><Link to="/" style={styles.homeLink}>← Back to Home</Link></p>
          </div>
        </div>

      </div>
    </div>
  );
};

// --- Red & Orange Theme Styles ---
const styles = {
  container: {
    minHeight: '100vh',
    
    background: 'linear-gradient(135deg, #D32F2F 0%, #FFC107 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: "'Poppins', sans-serif",
    padding: '20px' 
  },
  overlay: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '15px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
    animation: 'fadeInUp 0.6s ease',
  },
  header: { marginBottom: '25px' },
  logo: { fontSize: '2rem', margin: '0', color: '#D32F2F', fontWeight: '800' },
  subtitle: { color: '#666', marginTop: '5px' },
  
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  
  inputGroup: { textAlign: 'left' },
  label: { display: 'block', marginBottom: '8px', color: '#333', fontWeight: '600', fontSize: '0.9rem' },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '2px solid #eee',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border 0.3s',
    boxSizing: 'border-box'
  },
  
  button: {
    padding: '15px',
    backgroundColor: '#D32F2F',
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px',
    boxShadow: '0 4px 10px rgba(211, 47, 47, 0.3)',
    transition: 'background 0.3s'
  },
  
  errorMsg: {
    color: '#D32F2F',
    backgroundColor: '#ffebee',
    padding: '10px',
    borderRadius: '5px',
    fontSize: '0.9rem',
    fontWeight: 'bold'
  },
  
  footer: { marginTop: '25px', fontSize: '0.9rem', color: '#666' },
  link: { color: '#D32F2F', fontWeight: 'bold', textDecoration: 'none' },
  homeLink: { color: '#888', textDecoration: 'none', fontSize: '0.85rem', marginTop: '10px', display: 'inline-block' }
};

export default Register;