const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer'); 
const crypto = require('crypto'); 

// --- 0. EMAIL CONFIGURATION ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com', 
    pass: 'your-app-password'     
  }
});

// --- 1. Register User ---
router.post('/register', async (req, res) => {
  let { email, password } = req.body;
  try {
    email = email.toLowerCase().trim();
    password = password.trim();
    console.log(`[REGISTER] Attempting to register: ${email}`);

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    
    console.log(`[REGISTER] Success! User created: ${email}`);
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("[REGISTER] Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// --- 2. Login User ---
router.post('/login', async (req, res) => {
  let { email, password } = req.body;
  try {
    email = email.toLowerCase().trim();
    password = password.trim();
    console.log(`\n--- Login Attempt for: ${email} ---`);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User NOT found.");
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Password mismatch.");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("✅ Password Matched. Logging in...");
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin }, 
      process.env.JWT_SECRET || 'fallbacksecret', 
      { expiresIn: '1h' }
    );
    res.json({ token, userId: user._id, isAdmin: user.isAdmin });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// --- 3. FORGOT PASSWORD ---
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      console.log(`[OTP FAIL] User not found: ${cleanEmail}`);
      return res.status(404).json({ message: "User not found" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Save to DB
    user.resetOTP = otp;
    user.resetOTPExpiry = Date.now() + 900000; // 15 mins
    await user.save();

    // --- DEV MODE PRINT ---
    console.log(`\n=======================================`);
    console.log(`🔑 DEV MODE OTP for ${cleanEmail}: ${otp}`);
    console.log(`=======================================\n`);
    
    res.json({ message: "OTP generated! Check Backend Terminal." }); 

  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// --- 4. RESET PASSWORD ---
router.post('/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const cleanEmail = email.toLowerCase().trim();
    const inputOTP = otp.toString().trim(); 

    // A. Find User by EMAIL ONLY first (More reliable)
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
        console.log(`[RESET FAIL] User not found: ${cleanEmail}`);
        return res.status(404).json({ message: "User not found" });
    }

    // B. Debug Logs 
    console.log(`[RESET CHECK] User: ${cleanEmail}`);
    console.log(`[RESET CHECK] Input OTP: '${inputOTP}'`);
    console.log(`[RESET CHECK] DB OTP:    '${user.resetOTP}'`);
    console.log(`[RESET CHECK] Expiry:     ${user.resetOTPExpiry} vs Now: ${Date.now()}`);

    // C. Check if OTP Matches
    if (user.resetOTP !== inputOTP) {
        console.log("❌ OTP Mismatch!");
        return res.status(400).json({ message: "Invalid OTP (Mismatch)" });
    }

    // D. Check if Expired
    if (user.resetOTPExpiry < Date.now()) {
        console.log("❌ OTP Expired!");
        return res.status(400).json({ message: "OTP Expired" });
    }

    // E. Success - Update Password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    
    // Clear OTP
    user.resetOTP = undefined;
    user.resetOTPExpiry = undefined;
    
    await user.save();

    console.log("✅ Password Successfully Changed!");
    res.json({ message: "Password Reset Successful! Please Login." });

  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;