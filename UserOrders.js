import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) return;
      
      try {
        // Fetching all orders and filtering 
        const res = await axios.get('http://localhost:5000/api/admin/orders'); 
        const myOrders = res.data.filter(o => o.userId === userId).reverse(); 
        setOrders(myOrders);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); // Live polling
    return () => clearInterval(interval);
  }, []);

  const getStatusParams = (status) => {
    switch (status) {
      case 'In Kitchen': 
        return { color: '#FFC107', width: '50%', text: 'Cooking...', icon: '👨‍🍳' };
      case 'Sent to Delivery': 
        return { color: '#4CAF50', width: '100%', text: 'Out for Delivery', icon: '🚀' };
      default: 
        return { color: '#D32F2F', width: '10%', text: 'Order Received', icon: '📋' };
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>🍕 Your <span style={{color: '#D32F2F'}}>Orders</span></h1>
        <Link to="/" style={styles.backBtn}>← Back to Menu</Link>
      </div>

      {loading ? (
        <div style={styles.loading}>Loading your pizzas...</div>
      ) : orders.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={{fontSize: '4rem'}}>🍽️</div>
          <h3>No orders yet!</h3>
          <p>You haven't ordered any delicious pizzas yet.</p>
          <Link to="/" style={styles.orderBtn}>Order Now</Link>
        </div>
      ) : (
        <div style={styles.grid}>
          {orders.map(order => {
            const statusParams = getStatusParams(order.status);
            
            return (
              <div key={order._id} style={styles.card}>
                
                {/* Card Header */}
                <div style={styles.cardHeader}>
                  <span style={styles.orderId}>#{order._id.slice(-6).toUpperCase()}</span>
                  <span style={styles.timestamp}>
                     {/* Show time if available, or just static text for now */}
                     Recent Order
                  </span>
                </div>

                {/* Progress Bar */}
                <div style={styles.statusContainer}>
                  <div style={styles.progressBarBg}>
                    <div style={{
                      ...styles.progressBarFill, 
                      width: statusParams.width, 
                      backgroundColor: statusParams.color
                    }}></div>
                  </div>
                  <div style={{...styles.statusText, color: statusParams.color}}>
                    {statusParams.icon} {statusParams.text}
                  </div>
                </div>

                <hr style={styles.divider} />

                {/* Pizza Details */}
                <div style={styles.details}>
                  <div style={styles.detailRow}>
                    <strong>Base:</strong> <span style={styles.pill}>{order.items.base}</span>
                  </div>
                  <div style={styles.detailRow}>
                    <strong>Sauce:</strong> <span style={styles.pill}>{order.items.sauce}</span>
                  </div>
                  <div style={styles.detailRow}>
                    <strong>Cheese:</strong> <span style={styles.pill}>{order.items.cheese}</span>
                  </div>
                  <div style={styles.detailRow}>
                    <strong>Veggies:</strong> 
                    <div style={styles.veggieList}>
                      {order.items.veggies && order.items.veggies.length > 0 
                        ? order.items.veggies.map((v, i) => <span key={i} style={styles.veggiePill}>{v}</span>) 
                        : <span style={{color: '#999', fontSize: '0.8rem'}}>None</span>}
                    </div>
                  </div>
                </div>
                
                <div style={styles.totalRow}>
                  <span>Total Amount</span>
                  <span style={styles.price}>₹{order.amount}</span>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// --- Theme Styles (Red, Orange, Cream) ---
const styles = {
  container: { 
    padding: '40px', 
    fontFamily: "'Poppins', sans-serif", 
    backgroundColor: '#FFF5E6', 
    minHeight: '100vh' 
  },
  header: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: '40px',
    borderBottom: '2px solid rgba(211, 47, 47, 0.1)',
    paddingBottom: '20px'
  },
  title: { fontSize: '2rem', fontWeight: '800', color: '#333', margin: 0 },
  backBtn: { 
    textDecoration: 'none', 
    color: '#D32F2F', 
    fontWeight: 'bold', 
    border: '2px solid #D32F2F', 
    padding: '8px 20px', 
    borderRadius: '30px',
    transition: '0.3s'
  },
  
  grid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
    gap: '30px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  
  // Card Styling
  card: { 
    backgroundColor: 'white', 
    borderRadius: '15px', 
    padding: '25px', 
    boxShadow: '0 10px 25px rgba(0,0,0,0.05)', 
    border: '1px solid #fff',
    transition: 'transform 0.2s',
    display: 'flex',
    flexDirection: 'column'
  },
  cardHeader: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    marginBottom: '15px', 
    alignItems: 'center' 
  },
  orderId: { fontWeight: 'bold', color: '#555', fontSize: '1.1rem' },
  timestamp: { fontSize: '0.8rem', color: '#999' },
  
  // Status Bar
  statusContainer: { marginBottom: '20px' },
  progressBarBg: { height: '8px', backgroundColor: '#f0f0f0', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' },
  progressBarFill: { height: '100%', transition: 'width 0.5s ease', borderRadius: '4px' },
  statusText: { fontSize: '0.9rem', fontWeight: 'bold', textAlign: 'right' },
  
  divider: { border: 'none', borderTop: '1px dashed #eee', margin: '0 0 15px 0' },
  
  // Details
  details: { fontSize: '0.9rem', color: '#555', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' },
  detailRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  pill: { backgroundColor: '#FFF3E0', color: '#E65100', padding: '2px 8px', borderRadius: '4px', fontSize: '0.85rem' },
  veggieList: { display: 'flex', gap: '5px', flexWrap: 'wrap' },
  veggiePill: { backgroundColor: '#E8F5E9', color: '#2E7D32', padding: '2px 8px', borderRadius: '4px', fontSize: '0.85rem' },
  
  totalRow: { marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid #f9f9f9', paddingTop: '15px' },
  price: { fontSize: '1.2rem', fontWeight: 'bold', color: '#D32F2F' },

  // Empty State
  emptyState: { textAlign: 'center', marginTop: '50px', color: '#888' },
  orderBtn: { display: 'inline-block', marginTop: '20px', padding: '12px 30px', backgroundColor: '#D32F2F', color: 'white', borderRadius: '50px', textDecoration: 'none', fontWeight: 'bold' },
  
  loading: { textAlign: 'center', fontSize: '1.2rem', color: '#D32F2F', marginTop: '50px' }
};

export default UserOrders;