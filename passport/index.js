const { sqlGen } = require('../modules/mysql-connect');
const local = require('./local');
const kakao = require('./kakao');

module.exports = (passport) => {

	passport.serializeUser((user, done) => {
		done(null, user.id);
	}); 

	passport.deserializeUser(async (id, done) => {
		let r;
		try {
			r = await sqlGen('users', 'S', {where: ['id', id]})
			done(null, r[0][0]);
		}
		catch(err) {
			done(err);
		}
	});	
	local(passport);
	kakao(passport);
}
