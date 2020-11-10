const express = require('express');
const router = express.Router();
const pool = require('../modules/mysql_connect');
const moment = require("moment");


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
		connect.release();
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

router.post('/save',async (req, res) => {
	const { title, writer, wdate, content} = req.body;
	var values = [title,writer,wdate,content];
	var query = 'INSERT INTO books SET title=?, writer=?, wdate=?, content=?';
	const connect = await pool.getConnection();
	const r = await connect.query(query, values);
	connect.release();
	res.redirect('/book/list');
})

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