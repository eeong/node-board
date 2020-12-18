const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { sqlGen } = require('../modules/mysql-connect');

const cb = async (userid, userpw, done) => {
	let r;
	try {
		r = sqlGen('users', 'S', {where:['userid', userid]});
		if(result[0]) {
			let compare = await bcrypt.compare(userpw + process.env.BCRYPT_SALT, result[0].userpw);
			if(compare) done(null, result[0]);
			else done(null, false, '아이디와 비밀번호를 확인하세요.');
		}
		else done(null, false, '아이디와 비밀번호를 확인하세요.');
	}
	catch(err) {
		done(err);
	}
}

module.exports = (passport) => {
	passport.use(new LocalStrategy({
		usernameField: 'userid',
		passwordField: 'userpw'
	}, cb));
};