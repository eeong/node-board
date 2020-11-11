const express = require('express');
const router = express.Router();
const moment = require("moment");
const pool = require('../modules/mysql_connect');
const { alert } = require("../modules/util");

router.get(['/','/list'], async (req, res, next) => {
	let query = 'SELECT * FROM books ORDER BY id DESC LIMIT 0, 10';
	let connect, r;
	try {
		connect = await pool.getConnection();
		r = await connect.query(query);
		for (let v of r[0]) v.wdate = moment(v.wdate).format('YYYY-MM-DD');
		const pug = {
		file: 'book-list',
		title: '도서 리스트',
		titleSub: '고전도서 리스트',
		lists: r[0]
		}
		res.render('book/list',pug);
		connect.release();
	}
	catch(e) {
		if(connect) connect.release();
		e.msg = 
		`${e.code ? e.code : ""}\n
		${e.errno ? e.errno : ""}\n
		${e.sqlState ? e.sqlState : ""}\n
		${e.sqlMessage ? e.sqlMessage : ""}`
		next(e);
	}
	});

router.get('/write', (req, res) => {
	const pug = {
		file:'book-write',
		title: '도서 작성',
		titleSub: '작성해주세요',
	}
	res.render('book/write',pug);
});


router.get('/write/:id', async (req, res, next) => {
	try{
		var values = [req.params.id]
		var query = `SELECT * FROM books WHERE id=?`;
	
		const connect = await pool.getConnection();
		const r = await connect.query(query, values);
		connect.release();
		r[0][0].wdate = moment(r[0][0].wdate).format('YYYY-MM-DD');
		const pug = {
			file:'book-update',
			title: '도서 수정',
			titleSub: '수정해주세요',
			book: r[0][0]
		}
		res.render('book/write',pug);
	}
	catch(err){
		if(connect) connect.release();
		next(err);
	}
});

router.post('/save', async (req, res, next) => {
	try{
		const { title, writer, wdate, content} = req.body;
		var values = [title,writer,wdate,content];
		var query = 'INSERT INTO books SET title=?, writer=?, wdate=?, content=?';
		const connect = await pool.getConnection();
		const r = await connect.query(query, values);
		connect.release();
		res.redirect('/book/list');
	}
	catch(err){
		if(connect) connect.release();
		next(err);
	}
});

router.get('/delete/:id', async (req, res, next) => {
	try{
		var id = req.params.id;
		var query = `DELETE FROM books WHERE id = ${id}`;
		const connect = await pool.getConnection();
		const r = await connect.query(query);
		res.send(alert(r[0].affectedRows>0 ? '삭제되었습니다.' : '삭제에 실패하였습니다.', '/book'));
	}
	catch(err){
		if(connect) connect.release();
		next(err);
	}
});


router.post('/change', async (req, res, next) => {
	try{
		var {title, writer, wdate, content, id} = req.body;
		var values = [title, writer, wdate, content, id];
		var query = `UPDATE books SET title=?, writer=?, wdate=?, content=? WHERE id=?`;
		const connect = await pool.getConnection();
		const r = await connect.query(query, values);
		connect.release();
		res.send(alert(r[0].affectedRows > 0 ? '수정되었습니다.' : '수정에 실패하였습니다.', '/book'));
	}
	catch{err}{
		if(connect) connect.release();
		next(err);
	}
});

module.exports = router;

/* app.get('/book/list', (req, res) => {
	pool.getConnection((err, connect) => {
		connect.query('SELECT * FROM books', (e, r) => {
			connect.query('SELECT * FROM books WHERE id = 5', (e, r) => {
			connect.release();
			const pug = {
				css:'book-list',
				js: 'book-list',
				title: '도서 리스트',
				titleSub: '고전도서 리스트',
				lists: r
		}
		})
			res.render('book/list',pug);
		});
	});
}); */

/* 
app.get('/book/list', (req, res) => {
	connection.query('SELECT * FROM books', function(err, r) {
		// res.json(r);
		for(let v of r) {
			v.wdate = moment(v.wdate).format('YYYY-MM-DD');
		};
		const pug = {
			css:'book-list',
			js: 'book-list',
			title: '도서 리스트',
			titleSub: '고전도서 리스트',
			lists: r
	}
	
		res.render('book/list', pug);
	});
}); */