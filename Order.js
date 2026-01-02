const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: {
    base: String,
    sauce: String,
    cheese: String,
    veggies: [String]
  },
  amount: { type: Number, required: true },
  status: { type: String, default: 'Order Received' }, // Status: Received -> Kitchen -> Delivery
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);