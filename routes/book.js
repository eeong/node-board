const express = require('express');
const router = express.Router();
const pool = require('../modules/mysql_connect');
const moment = require("moment");


router.get('/list', async (req, res) => {
	var query = 'SELECT * FROM books ORDER BY id DESC LIMIT 0, 10';
	const connect = await pool.getConnection();
	const r = await connect.query(query);
	const r2 = await connect.query('SELECT * FROM books WHERE id=7');
	connect.release();
	for (let v of r[0]) v.wdate = moment(v.wdate).format('YYYY-MM-DD');
	const pug = {
		file: 'book-list',
		title: '도서 리스트',
		titleSub: '고전도서 리스트',
		lists: r[0]
}
res.render('book/list',pug);
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