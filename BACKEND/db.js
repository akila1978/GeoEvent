const mysql = require('mysql2');
const dotenv = require('dotenv');

// .env ෆයිල් එකේ තියෙන variables load කරගැනීම
dotenv.config();

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'mysql-1665c94c-kumarasadun886-aff5.a.aivencloud.com',
    port: process.env.DB_PORT || 27589,
    user: process.env.DB_USER || 'avnadmin',
    password: process.env.DB_PASSWORD, // .env එකේ Password එක අනිවාර්යයෙන්ම තියෙන්න ඕනේ
    database: process.env.DB_NAME || 'defaultdb',
    ssl: {
        // වැදගත්ම කොටස: Self-signed certificate error එක මගහැරීමට මෙය 'false' විය යුතුයි
        rejectUnauthorized: false 
    }
});

// Database එකට කනෙක්ට් වීම පරීක්ෂා කිරීම
db.connect((err) => {
    if (err) {
        console.error('❌ Database connection failed:', err.message);
        return;
    }
    console.log('✅ Connected to Aiven MySQL Database Successfully!');
});

module.exports = db;