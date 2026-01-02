import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PizzaBuilder = () => {
  const [step, setStep] = useState(1);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // State for the pizza customization
  const [selection, setSelection] = useState({
    base: '',
    sauce: '',
    cheese: '',
    veggies: []
  });

  // Load Inventory
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admin/inventory');
        setInventory(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load inventory", err);
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  // Handle Single Selection (Base, Sauce, Cheese)
  const handleSelect = (type, value) => {
    setSelection({ ...selection, [type]: value });
  };

  // Handle Multi Selection (Veggies)
  const handleVeggieToggle = (veggieName) => {
    const currentVeggies = selection.veggies;
    if (currentVeggies.includes(veggieName)) {
      setSelection({ 
        ...selection, 
        veggies: currentVeggies.filter(v => v !== veggieName) 
      });
    } else {
      setSelection({ 
        ...selection, 
        veggies: [...currentVeggies, veggieName] 
      });
    }
  };

  const handlePayment = async () => {
    // 1. Check if user is logged in
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert("Please login to place an order!");
      navigate('/login');
      return;
    }

    // 2. ASK FOR CONFIRMATION (Simulating a payment step)
    const isConfirmed = window.confirm("DEV MODE: Simulate a successful payment of ₹500?");
    
    if (isConfirmed) {
      try {
        // 3. SEND ORDER DIRECTLY TO BACKEND (Bypassing Razorpay)
        await axios.post('http://localhost:5000/api/orders', {
          userId: userId, 
          items: selection,
          amount: 500,
          paymentId: "DEV_TEST_ID_" + Date.now() 
        });

        alert("🍕 Order Placed Successfully! Redirecting to your orders...");
        navigate('/my-orders'); 
      } catch (err) {
        console.error("Order failed", err);
        alert("Order failed. Make sure your Backend is running!");
      }
    }
  };

  // Render the Grid of Options
  const renderOptions = (type, title) => {
    const items = inventory.filter(i => i.type === type);
    const isNextDisabled = type !== 'veggie' && !selection[type];

    return (
      <div style={styles.stepContainer}>
        <h3 style={styles.stepTitle}>{title}</h3>
        
        {items.length === 0 ? (
          <p>No options available. Please check Admin Inventory.</p>
        ) : (
          <div style={styles.grid}>
            {items.map(item => {
              const isSelected = type === 'veggie' 
                ? selection.veggies.includes(item.name) 
                : selection[type] === item.name;

              return (
                <div 
                  key={item._id} 
                  onClick={() => type === 'veggie' ? handleVeggieToggle(item.name) : handleSelect(type, item.name)}
                  style={isSelected ? styles.cardSelected : styles.card}
                >
                  <div style={styles.cardIcon}>{getIcon(type)}</div>
                  <div style={styles.cardText}>{item.name}</div>
                  {isSelected && <div style={styles.checkMark}>✔</div>}
                </div>
              );
            })}
          </div>
        )}

        <div style={styles.navButtons}>
          {step > 1 && (
            <button onClick={() => setStep(step - 1)} style={styles.backBtn}>Back</button>
          )}
          
          <button 
            onClick={() => setStep(step + 1)} 
            disabled={isNextDisabled} 
            style={isNextDisabled ? styles.nextBtnDisabled : styles.nextBtn}
          >
            {type === 'veggie' ? 'Review Order ➔' : 'Next Step ➔'}
          </button>
        </div>
      </div>
    );
  };

  const getIcon = (type) => {
    switch(type) {
      case 'base': return '🍘';
      case 'sauce': return '🥫';
      case 'cheese': return '🧀';
      case 'veggie': return '🥦';
      default: return '🍕';
    }
  };

  if (loading) return <div style={styles.loading}>Loading Menu...</div>;

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>🍕 Pizza<span style={{color: '#ffca28'}}>Maker</span></h2>
        
        {/* NEW BUTTON ADDED HERE */}
        <button onClick={() => navigate('/my-orders')} style={styles.myOrdersBtn}>
           📦 View My Orders
        </button>

        <ul style={styles.progressList}>
          {['Choose Base', 'Pick Sauce', 'Melt Cheese', 'Add Veggies', 'Checkout'].map((label, index) => {
            const stepNum = index + 1;
            const isActive = step === stepNum;
            const isCompleted = step > stepNum;
            
            return (
              <li 
                key={stepNum} 
                onClick={() => isCompleted ? setStep(stepNum) : null}
                style={isActive ? styles.activeStep : (isCompleted ? styles.completedStep : styles.step)}
              >
                {stepNum}. {label} {isCompleted && '✓'}
              </li>
            );
          })}
        </ul>

        <div style={styles.summaryBox}>
          <h4>Your Pizza:</h4>
          <p><strong>Base:</strong> {selection.base || '...'}</p>
          <p><strong>Sauce:</strong> {selection.sauce || '...'}</p>
          <p><strong>Cheese:</strong> {selection.cheese || '...'}</p>
          <p><strong>Veggies:</strong> {selection.veggies.join(', ') || 'None'}</p>
        </div>
      </div>

      {/* Main Area */}
      <div style={styles.mainContent}>
        {step === 1 && renderOptions('base', 'Start with a Base')}
        {step === 2 && renderOptions('sauce', 'Spread the Sauce')}
        {step === 3 && renderOptions('cheese', 'Make it Cheesy')}
        {step === 4 && renderOptions('veggie', 'Healthy Crunch')}
        
        {step === 5 && (
          <div style={styles.stepContainer}>
            <h3 style={styles.stepTitle}>Order Summary</h3>
            <div style={styles.receipt}>
              <div style={styles.receiptItem}><span>Base ({selection.base})</span> <span>₹150</span></div>
              <div style={styles.receiptItem}><span>Sauce ({selection.sauce})</span> <span>₹50</span></div>
              <div style={styles.receiptItem}><span>Cheese ({selection.cheese})</span> <span>₹100</span></div>
              <div style={styles.receiptItem}><span>Veggies ({selection.veggies.length})</span> <span>₹200</span></div>
              <hr style={{margin: '20px 0', border: '1px dashed #ccc'}}/>
              <div style={styles.receiptTotal}><span>Total</span> <span>₹500</span></div>
            </div>
            <div style={styles.navButtons}>
              <button onClick={() => setStep(4)} style={styles.backBtn}>Edit Pizza</button>
              <button onClick={handlePayment} style={styles.payBtn}>Pay Now (Bypass)</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- STYLES ---
const styles = {
  container: { display: 'flex', minHeight: '100vh', fontFamily: "'Poppins', sans-serif", backgroundColor: '#FFF5E6' },
  sidebar: { width: '280px', backgroundColor: '#D32F2F', color: 'white', padding: '30px', display: 'flex', flexDirection: 'column', boxShadow: '4px 0 10px rgba(0,0,0,0.1)' },
  mainContent: { flex: 1, padding: '40px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' },
  logo: { marginBottom: '20px', fontSize: '1.8rem', fontWeight: 'bold' },
  
  // NEW BUTTON STYLE
  myOrdersBtn: {
    marginBottom: '20px',
    padding: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.4)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '0.9rem',
    textAlign: 'left',
    paddingLeft: '15px',
    transition: '0.3s'
  },

  progressList: { listStyle: 'none', padding: 0, flex: 1 },
  step: { padding: '15px 10px', color: '#ffcdd2', borderBottom: '1px solid rgba(255,255,255,0.1)', cursor: 'not-allowed' },
  activeStep: { padding: '15px 10px', color: '#ffca28', fontWeight: 'bold', fontSize: '1.1rem', borderBottom: '2px solid #ffca28', cursor: 'default' },
  completedStep: { padding: '15px 10px', color: 'white', textDecoration: 'line-through', cursor: 'pointer', opacity: 0.8 },
  
  summaryBox: { backgroundColor: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '10px', fontSize: '0.9rem', lineHeight: '1.6' },
  
  stepContainer: { width: '100%', maxWidth: '800px', animation: 'fadeIn 0.5s ease' },
  stepTitle: { fontSize: '2.5rem', color: '#D32F2F', marginBottom: '30px', textAlign: 'center', fontWeight: '700' },
  
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '25px', marginBottom: '40px' },
  
  card: { backgroundColor: 'white', borderRadius: '15px', padding: '25px', textAlign: 'center', cursor: 'pointer', border: '2px solid #eee', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' },
  cardSelected: { backgroundColor: '#D32F2F', color: 'white', borderRadius: '15px', padding: '25px', textAlign: 'center', cursor: 'pointer', border: '2px solid #D32F2F', boxShadow: '0 8px 20px rgba(211, 47, 47, 0.4)', transform: 'translateY(-5px)', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' },
  
  cardIcon: { fontSize: '2.5rem' },
  cardText: { fontWeight: '600', fontSize: '1.1rem' },
  checkMark: { marginTop: '5px', fontSize: '1.2rem', fontWeight: 'bold', color: '#FFC107' },

  navButtons: { display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' },
  backBtn: { padding: '12px 30px', border: '2px solid #D32F2F', backgroundColor: 'transparent', color: '#D32F2F', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' },
  nextBtn: { padding: '12px 40px', border: 'none', backgroundColor: '#D32F2F', color: 'white', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', boxShadow: '0 4px 10px rgba(211, 47, 47, 0.4)', transition: '0.3s' },
  nextBtnDisabled: { padding: '12px 40px', border: 'none', backgroundColor: '#ccc', color: '#666', borderRadius: '50px', cursor: 'not-allowed', fontWeight: 'bold', fontSize: '1rem' },
  payBtn: { padding: '15px 50px', border: 'none', backgroundColor: '#FFC107', color: '#333', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.2rem', boxShadow: '0 4px 15px rgba(255, 193, 7, 0.5)' },
  
  receipt: { backgroundColor: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', maxWidth: '400px', margin: '0 auto' },
  receiptItem: { display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '1.1rem', color: '#555' },
  receiptTotal: { display: 'flex', justifyContent: 'space-between', fontSize: '1.5rem', fontWeight: 'bold', color: '#D32F2F' },
  
  loading: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '2rem', color: '#D32F2F', fontWeight: 'bold' }
};

export default PizzaBuilder;