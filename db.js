const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root973',
    database: 'db'
});

module.exports = { connection };
