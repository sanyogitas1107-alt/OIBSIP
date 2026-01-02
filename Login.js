import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.userId);
      localStorage.setItem('isAdmin', res.data.isAdmin); 

      if (res.data.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError("Invalid Email or Password. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      
      <div style={styles.loginCard}>
        <div style={styles.header}>
          <h1 style={styles.logo}>🍕 Pizza<span style={{ color: '#FFC107' }}>Paradise</span></h1>
          <p style={styles.subtitle}>Welcome back! Hungry?</p>
        </div>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              placeholder="e.g. user@pizza.com"
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          {error && <div style={styles.errorMsg}>{error}</div>}

          <div style={{ textAlign: 'right', marginBottom: '10px' }}>
            <Link to="/forgot-password" style={styles.forgotLink}>
              Forgot Password?
            </Link>
          </div>

          <button type="submit" style={styles.loginBtn}>
            Login & Order ➔
          </button>
        </form>

        <div style={styles.footer}>
          <p>New to PizzaParadise? <Link to="/register" style={styles.link}>Create Account</Link></p>
          <p><Link to="/" style={styles.backLink}>← Back to Home</Link></p>
        </div>
      </div>
    </div>
  );
};

// --- Theme ---
const styles = {
  container: {
    minHeight: '100vh',
    // Theme Red to Orange Gradient
    background: 'linear-gradient(135deg, #D32F2F 0%, #FFC107 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: "'Poppins', sans-serif",
    padding: '20px' 
  },
  loginCard: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '15px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
    animation: 'slideUp 0.5s ease',
  },
  header: { marginBottom: '30px' },
  logo: { fontSize: '2.2rem', margin: '0', color: '#D32F2F', fontWeight: '800' },
  subtitle: { color: '#666', marginTop: '5px', fontSize: '1rem' },

  form: { display: 'flex', flexDirection: 'column', gap: '20px' },

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

  loginBtn: {
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
    transition: 'transform 0.2s',
  },

  errorMsg: {
    color: '#D32F2F',
    backgroundColor: '#ffebee',
    padding: '10px',
    borderRadius: '5px',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    border: '1px solid #ffcdd2'
  },

  footer: { marginTop: '30px', fontSize: '0.9rem', color: '#666' },
  link: { color: '#D32F2F', fontWeight: 'bold', textDecoration: 'none' },
  forgotLink: { color: '#666', fontSize: '0.85rem', textDecoration: 'none' },
  
 
  backLink: { color: '#999', textDecoration: 'none', fontSize: '0.85rem', marginTop: '10px', display: 'inline-block' } 
};

export default Login;