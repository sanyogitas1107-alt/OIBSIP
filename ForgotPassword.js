import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1 = Email, 2 = OTP & New Pass
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const navigate = useNavigate();

    const handleRequestOTP = async (e) => {
        e.preventDefault();
        try {
            const cleanEmail = email.toLowerCase().trim();

            await axios.post('http://localhost:5000/api/auth/forgot-password', { email: cleanEmail });

            // --- DEV MODE ALERT ---
            alert("✅ DEV MODE: OTP Generated! \n\n👀 Please open your VS Code BACKEND TERMINAL to copy the 6-digit code.");

            setStep(2);
        } catch (err) {
            console.error(err);
            alert("❌ User not found. Please check the email spelling (it must match exactly).");
        }
    };

    const handleResetPassword = async (e) => {
    e.preventDefault();
    
    // --- DEBUG LOG ---
    console.log("Submitting Reset with:", { email, otp, newPassword });
    
    if (!otp) {
        alert("Error: OTP is empty! Please type it again.");
        return;
    }

    try {
      await axios.post('http://localhost:5000/api/auth/reset-password', { email, otp, newPassword });
      alert("Password Reset Successful! You can now login.");
      navigate('/login');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Invalid OTP or Expired");
    }
  };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={{ color: '#D32F2F' }}>🔑 Reset Password</h2>

                {step === 1 ? (
                    <form onSubmit={handleRequestOTP} style={styles.form}>
                        <p style={styles.text}>Enter your registered email ID.</p>
                        <input
                            type="email"
                            placeholder="e.g. admin@pizza.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value.toLowerCase())} 
                            required
                            style={styles.input}
                        />
                        <button type="submit" style={styles.button}>Get OTP (Dev Mode)</button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword} style={styles.form}>
                        <p style={styles.text}>
                            Check your <b>VS Code Backend Terminal</b><br />for the 6-digit code.
                        </p>
                        <input
                            type="text"
                            placeholder="Enter 6-digit OTP"
                            value={otp}  
                            onChange={(e) => {
                                console.log("Typing OTP:", e.target.value); 
                                setOtp(e.target.value);
                            }}
                            required
                            style={styles.input}
                        />
                        <input
                            type="password"
                            placeholder="New Password"
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            style={styles.input}
                        />
                        <button type="submit" style={styles.button}>Change Password</button>
                    </form>
                )}

                <p style={{ marginTop: '20px' }}>
                    <Link to="/login" style={styles.link}>← Back to Login</Link>
                </p>
            </div>
        </div>
    );
};

// --- STYLES ---
const styles = {
    container: {
        height: '100vh',
        background: 'linear-gradient(135deg, #D32F2F 0%, #FFC107 100%)', // Pizza Theme Gradient
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: "'Poppins', sans-serif",
    },
    card: {
        background: 'white',
        padding: '40px',
        borderRadius: '15px',
        textAlign: 'center',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        width: '100%',
        maxWidth: '380px'
    },
    text: { color: '#555', marginBottom: '10px' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '10px' },
    input: {
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #ccc',
        fontSize: '1rem',
        outline: 'none'
    },
    button: {
        padding: '12px',
        background: '#D32F2F',
        color: 'white',
        border: 'none',
        borderRadius: '50px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '1rem',
        transition: '0.3s'
    },
    link: {
        color: '#D32F2F',
        fontWeight: 'bold',
        textDecoration: 'none',
        fontSize: '0.9rem'
    }
};

export default ForgotPassword;