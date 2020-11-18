const express = require("express");
const router = express.Router();
const {pool, sqlGen} = require("../modules/mysql-connect");

router.get('/join', (req,res,next)=>{
	const pug = {
		file:'user-join', title: '회원가입',
		titleSub: '회원가입 창 입니다'
	}
	res.render('user/join' , pug);
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