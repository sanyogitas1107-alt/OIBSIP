import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const getLinkStyle = ({ isActive }) => {
    return isActive ? styles.activeLink : styles.link;
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.brand} onClick={() => navigate('/')}>
        🍕 Pizza<span style={{color: '#FFC107'}}>App</span>
      </div>
      
      <div style={styles.links}>
        <NavLink to="/" style={getLinkStyle} end>Home</NavLink>
        
        {token ? (
          <>
            <NavLink to="/dashboard" style={getLinkStyle}>Order Pizza</NavLink>
            <NavLink to="/my-orders" style={getLinkStyle}>My Orders</NavLink>
            
            {isAdmin && (
              <NavLink to="/admin" style={getLinkStyle}>
                Admin Panel
              </NavLink>
            )}
            
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/login" style={getLinkStyle}>Login</NavLink>
            <NavLink to="/register" style={styles.ctaBtn}>Sign Up</NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 40px',
    backgroundColor: '#D32F2F',
    color: 'white',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  },
  brand: { fontSize: '1.5rem', fontWeight: 'bold', cursor: 'pointer' },
  
  links: { display: 'flex', gap: '20px', alignItems: 'center' },
  
  // Standard White Link
  link: { 
    textDecoration: 'none', 
    color: 'white', 
    fontWeight: '500', 
    transition: '0.3s',
    paddingBottom: '5px'
  },

  // Active Yellow Link
  activeLink: { 
    textDecoration: 'none', 
    color: '#FFC107',
    fontWeight: 'bold', 
    transition: '0.3s',
    borderBottom: '2px solid #FFC107', 
    paddingBottom: '3px'
  },

  logoutBtn: { 
    background: 'transparent', 
    border: '1px solid white', 
    color: 'white', 
    padding: '5px 15px', 
    borderRadius: '20px', 
    cursor: 'pointer',
    marginLeft: '10px'
  },
  ctaBtn: { 
    textDecoration: 'none', 
    backgroundColor: '#FFC107', 
    color: '#333', 
    padding: '8px 20px', 
    borderRadius: '20px', 
    fontWeight: 'bold' 
  }
};

export default Navbar;