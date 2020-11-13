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

const sqlGen = (mode, table, field, data, file) => {
	let values = [], query;
	let temp = Object.entries(data).filter((v) => {
		return field.includes(v[0]); 
	});
	
	if(mode == 'I') query = 'INSERT INTO ' +table+ ' SET ';
	else query = 'UPDATE ' +table+ ' SET ';
	
	if(file) {
		temp.push(['savefile', file.filename]); 
		temp.push(['realfile', file.originalname]); 
		temp.push(['filesize', file.size]); 
	}
	for(var v of temp) {
		query += v[0] + '=?,';
		values.push(v[1]);
	}
	query = query.substr(0, query.length - 1);
	return {query, values}
}


module.exports = { pool, sqlGen};