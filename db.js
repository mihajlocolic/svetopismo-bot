const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.CONN_URL,
    port: 3306,
    user: process.env.CONN_USER,
    password: process.env.CONN_PASSWORD,
    database: process.env.CONN_DB
});

module.exports = connection;
