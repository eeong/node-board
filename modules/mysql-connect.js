
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
	let {field=[], data={}, file=null, where=null, order= [], limit=[] } = obj;
	let values=[], query=null, connect=null, r=null;
	let temp = Object.entries(data).filter((v) => {
		return field.includes(v[0]); 
	});
	
	if(mode) mode = mode.toUpperCase();

	if(mode == 'I') query = `INSERT INTO ${table} SET `;
	if(mode == 'U') query = `UPDATE ${table} SET `;
	if(mode == 'D') query = `DELETE FROM ${table} `;
	if(mode == 'S') query = `SELECT ${field.length == 0 ? '*' : field.toString()} FROM ${table} `;
	
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
	if(Array.isArray(where)){
		if(where[2] && where[2].toLowerCase() == 'like')
		query += ` WHERE ${where[0]} LIKE '%${where[1]}%'`;
		else 
		query += ` WHERE ${where[0]} = '${where[1]}'`;
		
	}
		if(where && where.fields && where.op && (where.op.toLowerCase() == 'and' || where.op.toLowerCase() == 'or')){
			for(let i in where.fields){
				if(i == 0) query += ` WHERE `;
				else query += ` ${where.op} `;
					if(where.fields[i][2] && where.fields[i][2].toLowerCase() == 'like')
					query += ` WHERE ${where.fields[i][0]} LIKE '%${where.fields[i][1]}%'`;
					else 
					query += ` WHERE ${where.fields[i][0]} = '${where.fields[i][1]}'`;
			}
	}

	if(order.length > 1) query += ` ORDER BY ${order[0]} ${order[1]}`;
	if(limit.length > 1) query += ` LIMIT ${limit[0]}, ${limit[1]}`;
	
	if((mode=='D' || mode == 'U') && query.indexOf('WHERE') == -1 ) throw new Error('수정,삭제는 where 절이 필요함');
	
	
	
	try{
		connect = await pool.getConnection();
		r = await connect.query(query,values);
		connect.release();
		return r;
	}
	catch(err){
		if(connect) connect.release();
		throw new Error(err);
	}

}


module.exports = { pool, mysql2, sqlGen };