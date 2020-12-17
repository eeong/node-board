const KakaoStrategy = require('passport-kakao').Strategy;
const { sqlGen } = require('../modules/mysql-connect');

console.log(sqlGen('users','S',{ where:{fields:[['api','user.api'],['userid','user.id']] , op:'AND'}}))

const cb = async (accessToken, refreshToken, profile, done) => {
	let r;
	console.log(profile._json.kakao_account.email);
	let user = {
		api: profile.provider,
		id: profile.id,
		username: profile.username,
		email: profile._json.kakao_account.email
	};
	r = await sqlGen('users','S',{ where:{'api': user.api, 'userid': user.id}}); //'SELECT * FROM member WHERE api=? AND userid=?';
	if(!r[0]) {
		sql = 'INSERT INTO member SET userid=?, username=?, email=?, api=?';
		r = await sqlGen('users', 'I' , [user.id, user.username, user.email, user.api]);
		sql = 'SELECT * FROM member WHERE api=? AND userid=?';
		result = await queryExecute(sql, [user.api, user.id]);
	}
	done(null, r[0]);
}

module.exports = (passport) => {
	passport.use(new KakaoStrategy({
		clientID: process.env.KAKAO_API,
		callbackURL: '/member/kakao/cb'
	}, cb));
};