require("dotenv").config();
const crypto = require("crypto");
const bcrypt = require("bcrypt");

let pass = '1234'+process.env.BCRYPT_SALT; 
let sha512 = crypto.createHash('sha512').update(pass).digest('base64');

const passMaker = async () => {
	try{	const hash = await bcrypt.hash(pass,Number(process.env.BCRYPT_ROUND));
	const compare = await bcrypt.compare('1234'+process.env.BCRYPT_SALT, hash);  
	console.log(compare);
}
catch(err){
	throw err;
}
}
passMaker();
