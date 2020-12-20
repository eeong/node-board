const express = require("express");
const router = express.Router();
const error = require('http-errors');
const bcrypt = require('bcrypt');
const passport = require("passport");
const {sqlGen} = require("../modules/mysql-connect");
const {alert} =require("../modules/util");
const {isUser, isGuest} = require("../modules/auth-connect");

router.get('/join', isGuest , (req,res,next)=>{
	const pug = {
		file:'user-join', title: '회원가입',
		titleSub: '회원가입 창 입니다'
	}
	res.render('user/join' , pug);
});

router.post('/save', async (req, res, next) => {
	try {
		req.body.userpw = await bcrypt.hash( req.body.userpw + process.env.BCRYPT_SALT , Number(process.env.BCRYPT_ROUND));
		let r = await sqlGen('users', 'I', {field:['userid','userpw','username','usermail','api'],
	data: req.body});
	if(r[0].affectedRows == 1){
		res.send(alert('회원가입이 완료되었습니다.','/user/login'));
	}
	else {
		res.send(alert('회원가입이 실패했습니다.','/user/join'));
	}
	
	}
	catch(err){
		next(error(500, err.sqlMessage || err));
	}
})

router.get('/login', isGuest, (req, res, next)=>{
	const pug = {
		file:'user-login', title: '로그인',
		titleSub: '로그인하십시오'
	}
	res.render('user/login' , pug);
});

router.get('/login/kakao', passport.authenticate('kakao'));

router.get('/login/kakao/oauth', passport.authenticate('kakao', {failureRedirect: '/'}), (req, res, next) => {
	req.login(req.user, (err) => {
		if(err) next(err);
		else res.redirect('/');
	});
});


router.post('/logon', isGuest, async (req, res, next) => {
	msg ='잘못된 요청입니다';  
	const done = (err, user, msg) => {
		if(err) return next(err);
		if(!user) return res.send(alert(msg, '/'));
		else {
			req.login(user, (err) => {
				if(err) return next(err);
				else return res.send(alert('로그인 되었습니다.', '/'));
			});
		}
	}
	passport.authenticate('local', done)(req, res, next);
		
});

router.get('/logout', isUser , (req, res, next) => {
	req.session.destroy();
	res.send(alert('로그아웃 되었습니다','/'));
});


router.get('/idcheck/:userid', async (req, res, next) => {
	let r;
	try {
		r = await sqlGen('users', 'S', { where:['userid', req.params.userid]});
		if(r[0].length > 0)	res.json({code: 200, isUsed:true});
		else res.json({code: 200, isUsed:false})
	}
	catch(err) {
		res.json({code: 500, error: err.sqlMessage || err });
	}
});

module.exports = router;