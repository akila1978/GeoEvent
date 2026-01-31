// BACKEND/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../db'); // Import shared DB connection

// 1. SIGNUP ROUTE (Updated)
router.post('/signup', (req, res) => {
    // අලුත් fields (city, phone, role) මෙතනට එකතු කරා
    const { username, email, password, city, phone, role } = req.body;
    console.log("Signup Request:", req.body);

    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // SQL Query එක වෙනස් කරා අලුත් ඩේටා ටික ඇතුලත් කරන්න
    const sql = "INSERT INTO users (username, email, password, city, phone, role) VALUES (?, ?, ?, ?, ?, ?)";
    
    // role එකක් එව්වේ නැත්නම් default 'user' කියලා ගමු
    const userRole = role || 'user';

    db.query(sql, [username, email, password, city, phone, userRole], (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ message: "Email already exists" });
            }
            return res.status(500).json({ message: "Database error" });
        }
        
        res.status(201).json({
            Status: "Success", // Added for frontend compatibility
            message: "User registered successfully", 
            id: result.insertId,
            name: username,
            email: email,
            role: userRole // Frontend එකට role එක යවනවා
        });
    });
});

// 2. LOGIN ROUTE (Updated)
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    
    db.query(sql, [email, password], (err, data) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ message: "Database error" });
        }
        
        if (data.length > 0) {
            const user = data[0];
            res.status(200).json({
                Status: "Success", // Added for frontend compatibility
                message: "Login successful", 
                id: user.id,
                name: user.username, 
                email: user.email,
                role: user.role // ✅ මෙන්න මේක වැදගත්: Role එක යවනවා
            });
        } else {
            return res.status(401).json({ message: "Invalid credentials" });
        }
    });
});

module.exports = router;