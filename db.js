const mysql = require('mysql');
const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root973',
    database: process.env.DB_NAME || 'db'
});

module.exports = { connection };
