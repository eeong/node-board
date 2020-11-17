
const mysql2 = require("mysql2/promise");

const pool = mysql2.createPool({
	host: process.env.DB_HOST, 
	port: process.env.DB_PORT,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0
});

const sqlGen = async (table, mode, obj) => {
	let {field=[], data={}, file=null, id=null, order= null, limit=null } = obj;
	let values=[], query=null;
	let temp = Object.entries(data).filter((v) => {
		return field.includes(v[0]); 
	});
	
	if(mode == 'I') query = `INSERT INTO ${table} SET `;
	if(mode == 'U') query = `UPDATE ${table} SET `;
	if(mode == 'D') query = `DELETE FROM ${table}`;
	if(mode == 'S') query = `SELECT ${field.length == 0 ? '*' : field.toString()} FROM ${table} `;
	if(mode !== 'U' && id) query += ` WHERE id=${id} `;
	if(order) query += ` ${order} `;
	if(limit && limit.length == 2) query += ` LIMIT ${limit[0]}, ${limit[1]} `;
	
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
	if(mode == 'U' && id) query += ` WHERE id= ${id} `;
	
	let connect = await pool.getConnection();
	let r = await connect.query(query,values);
	connect.release();

	return r;
}


module.exports = { pool, mysql2, sqlGen };