const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { sqlGen } = require('../modules/mysql-connect');

const cb = async (userid, userpw, done) => {
	let r;
	try {
		r = await sqlGen('users', 'S', {where:['userid', userid]});
		if(r[0][0]) {
			let compare = await bcrypt.compare(userpw + process.env.BCRYPT_SALT, r[0][0].userpw);
			if(compare) done(null, r[0][0]);
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
		passwordField: 'userpw',
		session: true
	}, cb));
};