const KakaoStrategy = require('passport-kakao').Strategy;
const { sqlGen } = require('../modules/mysql-connect');
const cb = async (accessToken, refreshToken, profile, done) => {
	let r;
	console.log(profile._json.kakao_account.email);
	let user = {
		api: profile.provider,
		userid: profile.id,
		username: profile.username,
		email: profile._json.kakao_account.email
	};
	r = await sqlGen('users','S',{ where:{fields:[['api','user.api'],['userid','user.id']] , op:'AND'}}); 
	if(!r[0]) {
		r = await sqlGen('users', 'I' , {field:['userid','username','usermail','api'], data: user});
		r = await sqlGen('users','S',{ where:{fields:[['api','user.api'],['userid','user.id']], op:'AND'}});
	}
	done(null, r[0]);
}

module.exports = (passport) => {
	passport.use(new KakaoStrategy({
		clientID: process.env.CLIENT_ID,
		clientSecret : '',
		callbackURL : 'http://localhost:3000/user/login/kakao/oauth'
	}, cb));
};