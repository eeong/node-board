const mysql2 = require("mysql2/promise");

const pool = mysql2.createPool({
	host: '127.0.0.1', 
	port: 3306,
	user: 'eeong',
	password: '000000',
	database: 'eeong',
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0
});

module.exports = pool;