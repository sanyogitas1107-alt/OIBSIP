import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={styles.container}>
      <div style={styles.overlay}>
        
        <div style={styles.content}>
          <div style={styles.logoBadge}>🍕 Est. 2025</div>
          
          <h1 style={styles.title}>
            Pizza<span style={styles.highlight}>Paradise</span>
          </h1>
          
          <p style={styles.subtitle}>
            Hand-tossed crust. Secret family sauce. <br />
            <span style={{color: '#FFC107', fontWeight: 'bold'}}>Customized by You.</span>
          </p>
          
          <div style={styles.buttonGroup}>
            <Link to="/login" style={styles.primaryBtn}>Order Now 🚀</Link>
            <Link to="/register" style={styles.secondaryBtn}>Join Us</Link>
          </div>
          
          <div style={styles.features}>
            <div style={styles.featureItem}>🧀 Fresh Cheese</div>
            <div style={styles.featureItem}>🍅 Organic Sauce</div>
            <div style={styles.featureItem}>⚡ Fast Delivery</div>
          </div>
        </div>

      </div>
    </div>
  );
};

const styles = {
  container: {
    height: '92vh', 
    backgroundImage: 'url("https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    fontFamily: "'Poppins', sans-serif",
    overflow: 'hidden'
  },
  overlay: {
    background: 'linear-gradient(to bottom, rgba(211, 47, 47, 0.8), rgba(0, 0, 0, 0.85))',
    height: '100%', 
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    color: 'white',
  },
  content: { maxWidth: '800px', padding: '20px', animation: 'fadeIn 1s ease-out' },
  logoBadge: { backgroundColor: '#FFC107', color: '#333', padding: '5px 15px', borderRadius: '20px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem', display: 'inline-block', marginBottom: '20px' },
  title: { fontSize: '4rem', margin: '0 0 20px 0', fontWeight: '800', lineHeight: '1.1', textShadow: '0 4px 10px rgba(0,0,0,0.5)' },
  highlight: { color: '#FFC107' },
  subtitle: { fontSize: '1.4rem', marginBottom: '40px', fontWeight: '300', lineHeight: '1.6', color: '#f0f0f0' },
  buttonGroup: { display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '50px', flexWrap: 'wrap' },
  primaryBtn: { padding: '15px 40px', backgroundColor: '#D32F2F', color: 'white', textDecoration: 'none', fontSize: '1.1rem', borderRadius: '50px', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(211, 47, 47, 0.5)', border: '2px solid #D32F2F' },
  secondaryBtn: { padding: '15px 40px', backgroundColor: 'transparent', border: '2px solid white', color: 'white', textDecoration: 'none', fontSize: '1.1rem', borderRadius: '50px', fontWeight: 'bold' },
  features: { display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '30px' },
  featureItem: { fontSize: '0.9rem', fontWeight: '600', color: '#ccc', textTransform: 'uppercase', letterSpacing: '1px' }
};

export default Home;