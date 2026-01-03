// BACKEND/server.js
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const dotenv = require('dotenv');

const userRoutes = require('./routes/userRoutes'); 

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: '1234', // ඔයාගේ MySQL පාස්වර්ඩ් එක
    database: 'goo' 
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL Database.');
});

// User Routes
app.use('/api/users', userRoutes);

// =============================================================
//  ADMIN & EVENT MANAGEMENT ROUTES (Updated)
// =============================================================

// 1. ADMIN: Pending Events ලබාගැනීම (Dashboard එකට)
app.get('/api/admin/pending-events', (req, res) => {
    const sql = "SELECT * FROM events WHERE status = 'pending' ORDER BY created_at DESC";
    db.query(sql, (err, result) => {
        if (err) return res.json({ Status: "Error", Error: err });
        return res.json(result);
    });
});

// 2. ADMIN: Event එකක් Approve හෝ Reject කිරීම
app.put('/api/admin/update-event-status/:id', (req, res) => {
    const eventId = req.params.id;
    const { status } = req.body; // 'approved' හෝ 'rejected'

    const sql = "UPDATE events SET status = ? WHERE id = ?";
    db.query(sql, [status, eventId], (err, result) => {
        if (err) return res.json({ Status: "Error", Error: err });
        return res.json({ Status: "Success", Message: `Event ${status} successfully` });
    });
});

// 3. USER: User Profile එකෙන් Event එකක් Submit කිරීම (Pending ලෙස Save වේ)
// Note: අපි කලින් හැදූ Table එකේ event_time, category NOT NULL නිසා default අගයන් දැම්මා error එන එක නවත්තන්න.
app.post('/api/add-event', (req, res) => {
    // Frontend එකෙන් එවන data
    const { title, date, location, description, organizer_id } = req.body;

    // Default values (Frontend එකෙන් එව්වොත් ඒවා ගන්නවා, නැත්නම් default)
    const category = req.body.category || 'General';
    const time = req.body.time || '09:00:00';
    const status = 'pending';

    const sql = "INSERT INTO events (title, event_date, location, description, organizer_id, status, category, event_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    
    const values = [
        title, 
        date, 
        location, 
        description, 
        organizer_id,
        status,
        category,
        time
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error creating pending event:", err);
            return res.json({ Status: "Error", Error: err });
        }
        return res.json({ Status: "Success", id: result.insertId });
    });
});

// 4. ADMIN: Admin Dashboard එකෙන් Full Event එකක් Create කිරීම (Direct Approved)
app.post('/create-event', (req, res) => {
    const { title, category, date, time, location, price, description, imageUrl } = req.body;

    const sql = "INSERT INTO events (title, category, event_date, event_time, location, price, description, image_url, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'approved')";
    
    const values = [title, category, date, time, location, price, description, imageUrl];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error inserting event:", err);
            return res.status(500).json({ Error: "Error adding event" });
        }
        return res.json({ Status: "Success", id: result.insertId });
    });
});

// 5. PUBLIC SITE: Approved Events විතරක් පෙන්වීම
// (මෙතන වෙනස් කළා: status = 'approved' කෑල්ල දැම්මා. නැත්නම් pending ඒවත් site එකේ පෙන්නනවා)
app.get('/events', (req, res) => {
    const sql = "SELECT * FROM events WHERE status = 'approved' ORDER BY created_at DESC";
    
    db.query(sql, (err, data) => {
        if (err) {
            return res.json("Error");
        }
        return res.json(data);
    });
});

// 6. User ගේ තමන්ගේ Events බලාගැනීම (Profile Page එකට)
app.get('/api/my-events/:id', (req, res) => {
    const userId = req.params.id;
    const sql = "SELECT * FROM events WHERE organizer_id = ? ORDER BY created_at DESC";
    
    db.query(sql, [userId], (err, data) => {
        if (err) return res.json({ Status: "Error", Error: err });
        return res.json(data);
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});