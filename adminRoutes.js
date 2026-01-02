const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Inventory = require('../models/Inventory');

// 1. Get All Orders (Newest First)
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'email') // Show User Email instead of just ID
      .sort({ createdAt: -1 });    // Sort by Newest
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Get Inventory Status
router.get('/inventory', async (req, res) => {
  try {
    const inventory = await Inventory.find();
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Update Order Status (Admin Action)
router.post('/update-status', async (req, res) => {
  const { orderId, status } = req.body;
  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();
    
    // Check Inventory logic could go here (Optional for now)
    
    res.json({ message: "Status Updated", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Restock Inventory
router.post('/restock', async (req, res) => {
  const { itemId, amount } = req.body;
  try {
    const item = await Inventory.findById(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.quantity += amount;
    await item.save();

    res.json({ message: "Stock updated", item });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;