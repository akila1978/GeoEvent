const mysql = require('mysql2'); // මෙතන mysql2 වෙන්න ඕන

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234', // ඔයාගේ MySQL පාස්වර්ඩ් එක
    database: 'goo'            // ඔයාගේ Database නම
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL Database Successfully!');
});

module.exports = db;