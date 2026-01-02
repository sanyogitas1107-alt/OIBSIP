import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // --- 1. Fetch Data Function ---
  const fetchData = async () => {
    try {
      const orderRes = await axios.get('http://localhost:5000/api/admin/orders');
      const invRes = await axios.get('http://localhost:5000/api/admin/inventory');

      // Show newest orders first
      setOrders(orderRes.data);
      setInventory(invRes.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching admin data", err);
      setLoading(false);
    }
  };

  // --- 2. Initial Load & Live Polling ---
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchOrdersOnly, 5000); // Update orders every 5s
    return () => clearInterval(interval);
  }, []);

  // Helper to update just orders quietly
  const fetchOrdersOnly = async () => {
    try {
      const orderRes = await axios.get('http://localhost:5000/api/admin/orders');
      setOrders(orderRes.data);
    } catch (err) { console.error(err); }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.post('http://localhost:5000/api/admin/update-status', { orderId: id, status });
      fetchData(); // Refresh immediately after update
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // --- 3. Restock Function ---
  const handleRestock = async (id) => {
    const amount = prompt("How much stock to add?", "10");
    if (!amount || isNaN(amount)) return;

    try {
      await axios.post('http://localhost:5000/api/admin/restock', { itemId: id, amount: parseInt(amount) });
      fetchData(); // Refresh UI to see green numbers again
      alert("Stock Updated!");
    } catch (err) {
      alert("Failed to restock");
    }
  };

  if (loading) return <div style={styles.loading}>Loading Dashboard...</div>;

  return (
    <div style={styles.container}>

      {/* --- Header --- */}
      <div style={styles.header}>
        <h1 style={styles.title}>👨‍🍳 Admin<span style={{ color: '#FFC107' }}>Panel</span></h1>
        <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
      </div>

      <div style={styles.contentGrid}>

        {/* --- LEFT COLUMN: Incoming Orders --- */}
        <div style={styles.column}>
          <h2 style={styles.sectionTitle}>🍕 Incoming Orders</h2>
          <div style={styles.scrollArea}>
            {orders.length === 0 ? <p style={{ textAlign: 'center', color: '#888' }}>No active orders.</p> : (
              orders.map(order => (
                <div key={order._id} style={styles.card}>

                  {/* Order Header */}
                  <div style={styles.cardHeader}>
                    {/* SAFE SLICE: We slice order._id because it is a string */}
                    <span style={styles.orderId}>#{order._id.slice(-6).toUpperCase()}</span>
                    <span style={{ ...styles.statusBadge, ...getStatusStyle(order.status) }}>
                      {order.status}
                    </span>
                  </div>

                  {/* Order Items */}
                  <div style={styles.ingredients}>
                    <span style={styles.pill}>🍘 {order.items.base}</span>
                    <span style={styles.pill}>🥫 {order.items.sauce}</span>
                    <span style={styles.pill}>🧀 {order.items.cheese}</span>
                    {order.items.veggies.map((v, i) => (
                      <span key={i} style={styles.vegPill}>🥦 {v}</span>
                    ))}
                  </div>

                  <div style={styles.meta}>
                    <span>Total: <strong>₹{order.amount}</strong></span>
                    <span style={{ fontSize: '0.8rem', color: '#999' }}>
                      User: {order.userId?.email || 'Unknown User'}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div style={styles.actionButtons}>
                    <button
                      onClick={() => updateStatus(order._id, 'In Kitchen')}
                      disabled={order.status !== 'Order Received'}
                      style={order.status === 'Order Received' ? styles.btnKitchen : styles.btnDisabled}
                    >
                      🔥 In Kitchen
                    </button>
                    <button
                      onClick={() => updateStatus(order._id, 'Sent to Delivery')}
                      disabled={order.status === 'Sent to Delivery'}
                      style={order.status !== 'Sent to Delivery' ? styles.btnDelivery : styles.btnDisabled}
                    >
                      🚀 Delivery
                    </button>
                  </div>

                </div>
              ))
            )}
          </div>
        </div>

        {/* --- RIGHT COLUMN: Inventory Management --- */}
        <div style={styles.column}>
          <h2 style={styles.sectionTitle}>📦 Pantry Status</h2>
          <div style={styles.tableCard}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHead}>
                  <th style={styles.th}>Ingredient</th>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Stock</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Action</th> {/* NEW COLUMN */}
                </tr>
              </thead>
              <tbody>
                {inventory.map(item => {
                  const isLow = item.quantity < item.threshold;
                  return (
                    <tr key={item._id} style={isLow ? styles.rowLow : styles.row}>
                      <td style={styles.td}><strong>{item.name}</strong></td>
                      <td style={styles.td}>{item.type}</td>
                      <td style={styles.td}>
                        <span style={isLow ? styles.stockLow : styles.stockOk}>
                          {item.quantity}
                        </span>
                      </td>
                      <td style={styles.td}>
                        {isLow ? <span style={styles.alertBadge}>⚠️ LOW</span> : <span style={styles.okBadge}>OK</span>}
                      </td>
                      {/* NEW RESTOCK BUTTON */}
                      <td style={styles.td}>
                        <button 
                          onClick={() => handleRestock(item._id)}
                          style={styles.restockBtn}
                        >
                          ➕ Add
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

// --- Helper for Status Colors ---
const getStatusStyle = (status) => {
  if (status === 'Order Received') return { backgroundColor: '#FFEBEE', color: '#D32F2F' }; // Red
  if (status === 'In Kitchen') return { backgroundColor: '#FFF8E1', color: '#FBC02D' }; // Yellow/Gold
  if (status === 'Sent to Delivery') return { backgroundColor: '#E8F5E9', color: '#388E3C' }; // Green
  return {};
};

// --- Theme Styles ---
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#FFF5E6',
    fontFamily: "'Poppins', sans-serif",
    padding: '20px'
  },
  loading: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#D32F2F', fontSize: '1.5rem' },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    backgroundColor: '#D32F2F',
    padding: '20px 40px',
    borderRadius: '15px',
    color: 'white',
    boxShadow: '0 4px 15px rgba(211, 47, 47, 0.3)'
  },
  title: { margin: 0, fontSize: '1.8rem' },
  logoutBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    border: '1px solid white',
    color: 'white',
    padding: '8px 20px',
    borderRadius: '30px',
    cursor: 'pointer'
  },

  contentGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '40px',
    maxWidth: '1400px',
    margin: '0 auto'
  },
  column: { display: 'flex', flexDirection: 'column', gap: '20px' },
  sectionTitle: { color: '#333', borderBottom: '3px solid #FFC107', paddingBottom: '10px', display: 'inline-block', width: 'auto' },

  // Orders
  scrollArea: { maxHeight: '80vh', overflowY: 'auto', paddingRight: '10px' },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
    borderLeft: '5px solid #D32F2F'
  },
  cardHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '15px' },
  orderId: { fontWeight: 'bold', fontSize: '1.1rem' },
  statusBadge: { padding: '5px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' },

  ingredients: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '15px' },
  pill: { backgroundColor: '#f5f5f5', padding: '4px 10px', borderRadius: '5px', fontSize: '0.9rem', border: '1px solid #eee' },
  vegPill: { backgroundColor: '#E8F5E9', color: '#2E7D32', padding: '4px 10px', borderRadius: '5px', fontSize: '0.9rem' },

  meta: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderTop: '1px dashed #eee', paddingTop: '10px' },

  actionButtons: { display: 'flex', gap: '10px' },
  btnKitchen: { flex: 1, padding: '10px', backgroundColor: '#FFC107', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', color: '#333' },
  btnDelivery: { flex: 1, padding: '10px', backgroundColor: '#4CAF50', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', color: 'white' },
  btnDisabled: { flex: 1, padding: '10px', backgroundColor: '#eee', border: 'none', borderRadius: '5px', cursor: 'not-allowed', color: '#aaa' },

  // Inventory Table
  tableCard: { backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHead: { borderBottom: '2px solid #eee' },
  th: { textAlign: 'left', padding: '15px', color: '#888', fontSize: '0.9rem' },
  row: { borderBottom: '1px solid #f9f9f9' },
  rowLow: { borderBottom: '1px solid #ffebee', backgroundColor: '#FFEBEE' }, // Light red bg for low stock
  td: { padding: '15px', fontSize: '0.95rem' },

  stockOk: { fontWeight: 'bold', color: '#333' },
  stockLow: { fontWeight: 'bold', color: '#D32F2F', fontSize: '1.1rem' },

  alertBadge: { backgroundColor: '#D32F2F', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' },
  okBadge: { backgroundColor: '#E8F5E9', color: '#2E7D32', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' },
  
  // NEW STYLE
  restockBtn: {
    padding: '5px 10px',
    backgroundColor: '#2196F3', // Blue
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold'
  }
};

export default AdminDashboard;