const express = require('express');
const router = express.Router();
const db = require('../db'); // අපි කලින් හදපු Database Connection එක මෙතනට ගන්නවා

// 1. LOGIN Route එක
router.post('/login', (req, res) => {
    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    
    db.query(sql, [req.body.email, req.body.password], (err, data) => {
        if (err) {
            console.error(err);
            return res.json("Error");
        }
        if (data.length > 0) {
            return res.json("Success");
        } else {
            return res.json("Fail");
        }
    });
});

// 2. SIGNUP Route එක (මේකත් දාලම තියමු, පස්සේ ඕන වෙනවනේ)
router.post('/signup', (req, res) => {
    const sql = "INSERT INTO users (name, email, password) VALUES (?)";
    const values = [
        req.body.name,
        req.body.email,
        req.body.password
    ];

    db.query(sql, [values], (err, data) => {
        if (err) {
            console.error(err);
            return res.json("Error");
        }
        return res.json(data);
    });
});

// මේ රවුටර් එක එළියට දෙනවා (Export කරනවා)
module.exports = router;