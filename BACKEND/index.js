const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Database connection configuration
const db = mysql.createConnection({
    host: "localhost",
    user: "root",       
    password: "1234",       
    database: "goo" 
});

app.get('/', (req, res) => {
    return res.json("Backend is working!");
});

app.listen(8081, () => {
    console.log("Listening on port 8081...");
});