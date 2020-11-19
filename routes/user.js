const express = require("express");
const router = express.Router();
const error = require('http-errors');
const bcrypt = require('bcrypt');
const {pool, sqlGen} = require("../modules/mysql-connect");
const {alert} =require("../modules/util");

router.get('/join', (req,res,next)=>{
	const pug = {
		file:'user-join', title: '회원가입',
		titleSub: '회원가입 창 입니다'
	}
	res.render('user/join' , pug);
});

router.post('/save', async (req, res, next) => {
	try {
		req.body.userpw = await bcrypt.hash( req.body.userpw + process.env.BCRYPT_SALT , Number(process.env.BCRYPT_ROUND));
		let r = await sqlGen('users', 'I', {field:['userid','userpw','username','usermail'],
	data: req.body});
	if(r[0].affectedRows == 1){
		res.send(alert('회원가입이 완료되었습니다.','/user/login'));
	}
	else {
		res.send(alert('회원가입이 실패했습니다.','/user/join'));
	}
	res.json(r[0]);
	}
	catch(err){
		next(error(500, err.sqlMessage || err));
	}
})

router.get('/login', (req, res, next)=>{
	const pug = {
		file:'user-login', title: '로그인',
		titleSub: '로그인하십시오'
	}
	res.render('user/login' , pug);
});

router.post('/logon', async (req, res, next) => {
	try {
		let msg = '아이디 또는 패스워드가 올바르지 않습니다'
		let r = await sqlGen('users','S',{ where:['userid', req.body.userid]});
		if(r[0].length > 0){
			let compare = await bcrypt.compare(req.body.userpw + process.env.BCRYPT_SALT, r[0][0].userpw);
			// 세션 처리
			if(compare) {
			req.session.user = {
				userid: r[0][0].userid,
				username: r[0][0].username,
				usermail: r[0][0].usermail,
			}
			res.send(alert('로그인되었습니다','/book'));
		}
			else res.send(alert(msg,'/user/login'))
		}
		else res.send(alert(msg,'/user/login'));
	}
	catch(err){
		next(error(500, err.sqlMessage || err));
	}
})

router.get('/logout', (req, res, next) => {
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