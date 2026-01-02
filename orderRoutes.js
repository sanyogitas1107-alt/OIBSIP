const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Inventory = require('../models/Inventory');

// --- 1. PLACE ORDER (Safe Mode - No Email Crashing) ---
router.post('/', async (req, res) => {
  try {
    const { items, amount, userId } = req.body;
    
    // --- INVENTORY UPDATE LOGIC ---
    // Create a list of all ingredients used
    const ingredientsUsed = [
      items.base, 
      items.sauce, 
      items.cheese, 
      ...(items.veggies || []) // Safely handle veggies
    ];

    // Loop through ingredients and update stock
    for (const ingredientName of ingredientsUsed) {
      if (!ingredientName) continue;

      const item = await Inventory.findOne({ name: ingredientName });
      
      if (item) {
        if (item.quantity > 0) {
          item.quantity -= 1;
          await item.save();

          // --- FAKE EMAIL ALERT (Console Log Only) ---
          if (item.quantity < item.threshold) {
             console.log(`\n⚠️ [MOCK EMAIL SENT] Admin Alert: Low stock for ${item.name} (${item.quantity} left)`);
          }
        }
      }
    }

    // --- SAVE ORDER TO DATABASE ---
    const newOrder = new Order({
      userId,
      items,
      amount,
      status: 'Order Received'
    });

    await newOrder.save();
    
    console.log(`✅ Order Placed: ${newOrder._id}`);
    res.json({ message: "Order Placed Successfully!", orderId: newOrder._id });

  } catch (err) {
    console.error("Order Failed:", err);
    res.status(500).json({ error: err.message });
  }
});

// --- 2. GET USER ORDERS ---
router.get('/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;