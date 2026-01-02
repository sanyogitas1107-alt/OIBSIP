const mongoose = require('mongoose');
const Inventory = require('./models/Inventory');
require('dotenv').config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pizza_db')
  .then(() => console.log("MongoDB Connected for Seeding"))
  .catch(err => console.log(err));

const seedItems = [
  // --- 5 PIZZA BASES ---
  { name: "Thin Crust", type: "base", quantity: 50, threshold: 10 },
  { name: "Cheese Burst", type: "base", quantity: 50, threshold: 10 },
  { name: "Whole Wheat", type: "base", quantity: 50, threshold: 10 },
  { name: "Gluten-Free", type: "base", quantity: 50, threshold: 10 },
  { name: "Deep Dish", type: "base", quantity: 50, threshold: 10 },

  // --- 5 PIZZA SAUCES ---
  { name: "Tomato Basil", type: "sauce", quantity: 50, threshold: 10 },
  { name: "Spicy Red", type: "sauce", quantity: 50, threshold: 10 },
  { name: "BBQ Sauce", type: "sauce", quantity: 50, threshold: 10 },
  { name: "Pesto Green", type: "sauce", quantity: 50, threshold: 10 },
  { name: "White Garlic", type: "sauce", quantity: 50, threshold: 10 },

  // --- CHEESES ---
  { name: "Mozzarella", type: "cheese", quantity: 50, threshold: 10 },
  { name: "Cheddar", type: "cheese", quantity: 50, threshold: 10 },

  // --- VEGGIES ---
  { name: "Onion", type: "veggie", quantity: 100, threshold: 20 },
  { name: "Capsicum", type: "veggie", quantity: 100, threshold: 20 },
  { name: "Olives", type: "veggie", quantity: 100, threshold: 20 },
  { name: "Mushroom", type: "veggie", quantity: 100, threshold: 20 },
  { name: "Jalapeno", type: "veggie", quantity: 100, threshold: 20 },

  // --- MEATS---
  { name: "Pepperoni", type: "meat", quantity: 50, threshold: 10 },
  { name: "Chicken", type: "meat", quantity: 50, threshold: 10 },
  { name: "Sausage", type: "meat", quantity: 50, threshold: 10 }
];

const seedDB = async () => {
  await Inventory.deleteMany({}); 
  await Inventory.insertMany(seedItems);
  console.log("✅ Database Updated with 5 Bases & 5 Sauces!");
  mongoose.connection.close();
};

seedDB();