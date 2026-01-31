// BACKEND/server.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config(); // Load env vars before importing other files

const multer = require('multer'); 
const path = require('path');
const fs = require('fs'); // fs මොඩියුලය එකතු කළා (Files check කරන්න)
const userRoutes = require('./routes/userRoutes');
const db = require('./db'); // Import the shared DB connection

const app = express();

app.use(cors());
app.use(express.json());

// --- 1. UPLOADS FOLDER CHECK & CREATE ---
// uploads ෆෝල්ඩරය නැත්නම් ඉබේම හදනවා (Error එන එක නවත්වන්න)
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// Uploads folder එක public කරනවා
app.use('/uploads', express.static(uploadDir));

// =============================================================
//  MULTER CONFIGURATION (Image Save කරන තැන)
// =============================================================
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        // ෆයිල් නම පැටලෙන්නේ නැති වෙන්න දිනයක් එකතු කරනවා
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

const upload = multer({ storage: storage });

// =============================================================
//  USER ROUTES (Login/Signup)
// =============================================================
app.use('/api/users', userRoutes);

// =============================================================
//  EVENT ROUTES
// =============================================================

// 4. ADD EVENT ROUTE (මේ කොටස විතරක් Replace කරන්න)
app.post('/api/add-event', upload.single('image'), (req, res) => {
    
    // --- DEBUGGING START ---
    console.log("📥 Request Received!");
    console.log("Headers Content-Type:", req.headers['content-type']); // මෙතනින් බලාගන්න පුළුවන් Frontend එක එවන්නේ මොනවද කියලා
    console.log("Req Body:", req.body);
    console.log("Req File:", req.file);
    // --- DEBUGGING END ---

    // req.body Undefined නම් මෙතනින් නවත්වනවා (Crash නොවී)
    if (!req.body) {
        console.error("❌ Error: req.body is undefined!");
        return res.status(400).json({ Status: "Error", Message: "No data received. Check Frontend headers." });
    }

    const { title, category, date, time, location, description, ticket_price, organizer_id } = req.body;
    
    // Image එකක් නැත්නම් null ගන්නවා
    const image = req.file ? req.file.filename : null;

    const sql = "INSERT INTO events (title, category, date, time, location, description, ticket_price, organizer_id, image, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')";
    
    const values = [
        title, 
        category || 'General', 
        date, 
        time, 
        location, 
        description, 
        ticket_price || 0, 
        organizer_id, 
        image 
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("❌ Database Error:", err);
            return res.status(500).json({ Status: "Error", Error: err.sqlMessage || err });
        }
        console.log("✅ Event Saved Successfully! ID:", result.insertId);
        return res.status(201).json({ Status: "Success", id: result.insertId, image: image });
    });
});

// 5. GET APPROVED EVENTS (Public)
// Note: I added '/api' prefix so the Vite proxy works
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
        if (err) return res.json("Error");
        return res.json(data);
    });
});

// 6. DELETE EVENT
app.delete('/api/delete-event/:id', (req, res) => {
    const sql = "DELETE FROM events WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ Error: err });
        return res.json({ Status: "Success" });
    });
});

// =============================================================
//  ADMIN ROUTES
// =============================================================

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

app.get('/api/admin/pending-events', (req, res) => {
    const sql = "SELECT * FROM events WHERE status = 'pending' ORDER BY created_at DESC";
    db.query(sql, (err, result) => {
        if (err) return res.json({ Status: "Error", Error: err });
        return res.json(result);
    });
});

app.put('/api/admin/update-event-status/:id', (req, res) => {
    const eventId = req.params.id;
    const { status } = req.body;
    const sql = "UPDATE events SET status = ? WHERE id = ?";
    db.query(sql, [status, eventId], (err, result) => {
        if (err) return res.json({ Status: "Error", Error: err });
        return res.json({ Status: "Success", Message: `Event ${status} successfully` });
    });
});

// 7. ORGANIZER MY EVENTS
app.get('/api/my-events/:id', (req, res) => {
    db.query("SELECT * FROM events WHERE organizer_id = ?", [req.params.id], (err, data) => {
        if (err) return res.json({ Error: err });
        return res.json(data);
    });
});


// =============================================================
//  SERVER START
// =============================================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});