const mongoose = require('mongoose');
const inventorySchema = new mongoose.Schema({
  name: String, // e.g., 'Thin Crust', 'Tomato Sauce'
  type: { type: String, enum: ['base', 'sauce', 'cheese', 'veggie', 'meat'] },
  quantity: Number,
  threshold: { type: Number, default: 20 }
});
module.exports = mongoose.model('Inventory', inventorySchema);