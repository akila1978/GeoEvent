// BACKEND/server.js
const express = require('express');
const cors = require('cors'); // මෙය තවමත් අවශ්‍ය විය හැක
const dotenv = require('dotenv');
const multer = require('multer'); 
const path = require('path');
const fs = require('fs');

dotenv.config();

const userRoutes = require('./routes/userRoutes');
const db = require('./db');

const app = express();

// --- 1. MANUAL CORS CONFIGURATION (මෙය තමයි වැදගත්ම කොටස) ---
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); 
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    
    // Browser එකෙන් මුලින්ම එවන OPTIONS request එකට කෙලින්ම success response එකක් දීම
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json());

// --- 2. UPLOADS FOLDER CHECK ---
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}
app.use('/uploads', express.static(uploadDir));

// --- 3. MULTER CONFIGURATION ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});
const upload = multer({ storage: storage });

// --- 4. TEST ROUTE ---
app.get('/', (req, res) => {
    res.send("GeoEvent Backend is Running Successfully!");
});

// --- 5. ROUTES ---
app.use('/api/users', userRoutes);

// ADD EVENT
app.post('/api/add-event', upload.single('image'), (req, res) => {
    if (!req.body) {
        return res.status(400).json({ Status: "Error", Message: "No data received." });
    }
    const { title, category, date, time, location, description, ticket_price, organizer_id } = req.body;
    const image = req.file ? req.file.filename : null;
    const sql = "INSERT INTO events (title, category, date, time, location, description, ticket_price, organizer_id, image, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')";
    const values = [title, category || 'General', date, time, location, description, ticket_price || 0, organizer_id, image];
    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json({ Status: "Error", Error: err });
        return res.status(201).json({ Status: "Success", id: result.insertId });
    });
});

// GET APPROVED EVENTS
app.get('/api/events', (req, res) => {
    const category = req.query.category;
    let sql = "SELECT * FROM events WHERE status = 'approved'";
    let params = [];
    if (category && category !== 'All') {
        sql += " AND category = ?";
        params.push(category);
    }
    sql += " ORDER BY created_at DESC";
    db.query(sql, params, (err, data) => {
        if (err) return res.status(500).json("Error");
        return res.json(data);
    });
});

// DELETE EVENT
app.delete('/api/delete-event/:id', (req, res) => {
    const sql = "DELETE FROM events WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ Error: err });
        return res.json({ Status: "Success" });
    });
});

// ADMIN STATS
app.get('/api/admin/stats', (req, res) => {
    const sqlUsers = "SELECT COUNT(*) as totalUsers FROM users";
    const sqlEvents = "SELECT COUNT(*) as totalEvents FROM events";
    const sqlPending = "SELECT COUNT(*) as pendingEvents FROM events WHERE status = 'pending'";
    db.query(sqlUsers, (err, usersResult) => {
        if(err) return res.json({Error: err});
        db.query(sqlEvents, (err, eventsResult) => {
            if(err) return res.json({Error: err});
            db.query(sqlPending, (err, pendingResult) => {
                if(err) return res.json({Error: err});
                res.json({
                    users: usersResult[0].totalUsers,
                    events: eventsResult[0].totalEvents,
                    pending: pendingResult[0].pendingEvents
                });
            });
        });
    });
});

// PENDING EVENTS
app.get('/api/admin/pending-events', (req, res) => {
    const sql = "SELECT * FROM events WHERE status = 'pending' ORDER BY created_at DESC";
    db.query(sql, (err, result) => {
        if (err) return res.json({ Status: "Error", Error: err });
        return res.json(result);
    });
});

// UPDATE STATUS
app.put('/api/admin/update-event-status/:id', (req, res) => {
    const { status } = req.body;
    const sql = "UPDATE events SET status = ? WHERE id = ?";
    db.query(sql, [status, req.params.id], (err, result) => {
        if (err) return res.json({ Status: "Error", Error: err });
        return res.json({ Status: "Success" });
    });
});

// MY EVENTS
app.get('/api/my-events/:id', (req, res) => {
    db.query("SELECT * FROM events WHERE organizer_id = ?", [req.params.id], (err, data) => {
        if (err) return res.json({ Error: err });
        return res.json(data);
    });
});

// --- 6. SERVER START ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});