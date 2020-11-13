const express = require('express');
const router = express.Router();
const moment = require("moment");
const error = require("http-errors");
const path = require("path");
const fs = require("fs-extra");

const { pool , sqlGen } = require('../modules/mysql-connect');
const { alert, getPath, getExt } = require("../modules/util");
const { upload, allowExt, imgExt } = require("../modules/multer");


//book render
router.get(['/','/list'], async (req, res, next) => {
	let query = 'SELECT * FROM books ORDER BY id ASC LIMIT 0, 10';
	let connect, r, pug;
	try {
		connect = await pool.getConnection();
		r = await connect.query(query);
		connect.release();
		for (let v of r[0]){
		 v.wdate = moment(v.wdate).format('YYYY-MM-DD');
		 if (v.savefile) v.icon = getExt(v.savefile,'upper');
		}	
		pug = {
		file: 'book-list',
		title: '도서 리스트',
		titleSub: '고전도서 리스트',
		lists: r[0]
		}
		res.render('book/list',pug);
	}

	catch(err) {
		if(connect) connect.release();
		`${err.code ? err.code : ""}\n
		${err.errno ? err.errno : ""}\n
		${err.sqlState ? err.sqlState : ""}\n
		${err.sqlMessage ? err.sqlMessage : ""}`
		next(error(500, err.sqlMessage || err));
	}
	});

router.get('/write', (req, res) => {
	const pug = {
		file:'book-write',
		title: '도서 작성',
		titleSub: '작성해주세요',
		allowExt
	}
	res.render('book/write', pug);
});


router.get('/write/:id', async (req, res, next) => {
	let values,query,r,connect,pug;
	try{
			values = [req.params.id]
			query = `SELECT * FROM books WHERE id=?`;
		 	connect = await pool.getConnection();
			 r = await connect.query(query, values);
			connect.release();
			r[0][0].wdate = moment(r[0][0].wdate).format('YYYY-MM-DD');
			pug = {
			file:'book-update',
			title: '도서 수정',
			titleSub: '수정해주세요',
			book: r[0][0],
			allowExt
		}
		res.render('book/write', pug);
	}
	catch(err){
		if(connect) connect.release();
		next(error(500, err.sqlMessage || err));
	}
});

router.post('/save', upload.single('upfile') , async (req, res, next) => {
	let r,connect;
	try{
		if (req.allow == false) {
			res.send(alert(`${req.ext}는 업로드 할 수 없는 확장자입니다.`,'/book'));
		}
		else {
			let obj = sqlGen('I', 'books', ['title', 'writer', 'content', 'wdate'], req.body, req.file);
			connect = await pool.getConnection();
			r = await connect.query(obj.query, obj.values);
			connect.release();
			res.redirect('/book/list');
		}
	}
	catch(err){
		if(connect) connect.release();
		next(error(500,err.sqlMessage || err));
	}
});



router.post('/change', upload.single('upfile'), async (req, res, next) => {
	let values,query,r,connect,pug;
	try{
		if (req.allow == false) {
			res.send(alert(`${req.ext}는 업로드 할 수 없는 확장자입니다.`,'/book'));
		}
		else {
			connect = await pool.getConnection();
			if(req.file) {
				query= 'SELECT savefile FROM books WHERE id=' +req.body.id;
				r = await connect.query(query);
				if(r[0][0].savefile) await fs.remove(getPath(r[0][0].savefile));
			}
			query = `UPDATE books SET title=?, writer=?, wdate=?, content=?`;
			let obj = sqlGen('U', 'books', ["title","wdate","writer","content"], req.body , req.file);
			obj.query += ` WHERE id= ${req.body.id}`;
			r = await connect.query(obj.query, obj.values);
			connect.release();
			res.send(alert(r[0].affectedRows > 0 ? '수정되었습니다.' : '수정에 실패하였습니다.', '/book'));
		}
		
	}
	catch(err){
		if(connect) connect.release();
		next(error(500, err.sqlMessage || err));
	}
});


router.get('/delete/:id', async (req, res, next) => {
	let values,query,r,connect,pug;
	try{
		var id = req.params.id;
		connect = await pool.getConnection();
		query = `SELECT savefile FROM books WHERE id = ${id}`;
		r = await connect.query(query);
		connect.release();
		if(r[0][0].savefile) await fs.remove(getPath(r[0][0].savefile));
		query = `DELETE FROM books WHERE id = ${id}`;
		r = await connect.query(query);
		connect.release();
		res.send(alert(r[0].affectedRows>0 ? '삭제되었습니다.' : '삭제에 실패하였습니다.', '/book'));
	}
	catch(err){
		if(connect) connect.release();
		next(error(500, err.sqlMessage || err));

	}
});

router.post('/multer/save', upload.single('upfile'), (req, res, next) => {
	res.redirect('/book');
});

router.get('/view/:id', async (req, res, next) => {
	let connect, query, pug, r, book;
	try{
		query = `SELECT * FROM books WHERE id= ${req.params.id}`;
		connect = await pool.getConnection();
		r = await connect.query(query);
		connect.release();
		book = r[0][0];
		book.wdate = moment(book.wdate).format('YYYY-MM-DD');
		if(book.savefile){
			book.file = getPath(book.savefile,'rel'); //`/upload/${book.savefile.substr(0, 6)}/${book.savefile}`;
			if(imgExt.includes(getExt(book.realfile))){
				book.src = book.file;
			}
			console.log(book);
		}
		pug = {
			file:'book-view',
			title: '도서 상세보기',
			titleSub: '도서의 내용을 보여줌',
			book
		}
		res.render('book/view', pug);
	}
	catch(err){
		if(connect) connect.release();
		next(error(500, err.sqlMessage || err));
	}
});

router.get('/download', (req, res, next) => {
	console.log(req.query)
	try{
		let src = path.join(__dirname, "../storage", req.query.file.slice(7));
		res.download(src, req.query.name);

	}
	catch(err){
		next(error(500, err.sqlMessage || err));
	}
});

router.get('/remove/:id', async (req, res, next) => {
	let connect, query, values, r;
	try {
		query = 'SELECT savefile FROM books WHERE id=' + req.params.id;
		connect = await pool.getConnection();
		r = await connect.query(query);
		connect.release();
		let book = r[0][0];
		await fs.remove(getPath(book.savefile));
		query = 'UPDATE books SET savefile=NULL, realfile=NULL, filesize=NULL WHERE id=' + req.params.id;
		r = await connect.query(query);
		connect.release();
		res.json({code: 200});
	}
	catch(err) {
		if(connect) connect.release();
		res.json({code: 500, error: err});
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