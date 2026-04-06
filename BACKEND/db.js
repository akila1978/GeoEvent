const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'mysql-1665c94c-kumarasadun886-aff5.a.aivencloud.com',
    port: process.env.DB_PORT || 27589, // අනිවාර්යයෙන්ම port එක දාන්න
    user: process.env.DB_USER || 'avnadmin',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'defaultdb', // Aiven එකේ default නම මේකයි
    ssl: {
        rejectUnauthorized: true // Aiven වලට SSL අනිවාර්යයි
    }
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to Aiven MySQL Database Successfully!');
});

module.exports = db;