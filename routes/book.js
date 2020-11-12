const express = require('express');
const router = express.Router();
const moment = require("moment");
const error = require("http-errors");
const path = require("path");


const pool = require('../modules/mysql-connect');
const { alert } = require("../modules/util");
const { upload, allowExt, imgExt } = require("../modules/multer");

//book render
router.get(['/','/list'], async (req, res, next) => {
	let query = 'SELECT * FROM books ORDER BY id ASC LIMIT 0, 10';
	let connect, r, pug;
	try {
		connect = await pool.getConnection();
		r = await connect.query(query);
		for (let v of r[0]){
		 v.wdate = moment(v.wdate).format('YYYY-MM-DD');
		 if (v.savefile) v.icon = path.extname(v.savefile).replace('.','').toUpperCase();
		}	
		pug = {
		file: 'book-list',
		title: '도서 리스트',
		titleSub: '고전도서 리스트',
		lists: r[0]
		}
		res.render('book/list',pug);
		connect.release();
	}
	catch(err) {
		if(connect) connect.release();
		`${err.code ? err.code : ""}\n
		${err.errno ? err.errno : ""}\n
		${err.sqlState ? err.sqlState : ""}\n
		${err.sqlMessage ? err.sqlMessage : ""}`
		next(error(500, err.sqlMessage));
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
		next(error(500, err.sqlMessage));

	}
});

router.post('/save', upload.single('upfile') , async (req, res, next) => {
	let values,query,r,connect,pug;
	let { title, writer, wdate, content} = req.body;
	try{
		if (req.ext && !req.allow) {
			res.send(alert(`${req.ext}는 업로드 할 수 없는 확장자입니다.`,'/book'));
		}
		else {
			values = [title,writer,wdate,content];
			query = 'INSERT INTO books SET title=?, writer=?, wdate=?, content=?';
			if(req.file){
				query += ', realfile=?, savefile=?, filesize=?';
				values.push(req.file.originalname);
				values.push(req.file.filename);
				values.push(req.file.size);
			}
			connect = await pool.getConnection();
			r = await connect.query(query, values);
			connect.release();
			res.redirect('/book/list');
		}
	}
	catch(err){
		if(connect) connect.release();
		next(error(500,err.sqlMessage));
	}
});

router.get('/delete/:id', async (req, res, next) => {
	let values,query,r,connect,pug;
	try{
		var id = req.params.id;
		query = `DELETE FROM books WHERE id = ${id}`;
		connect = await pool.getConnection();
		r = await connect.query(query);
		res.send(alert(r[0].affectedRows>0 ? '삭제되었습니다.' : '삭제에 실패하였습니다.', '/book'));
	}
	catch(err){
		if(connect) connect.release();
		next(error(500, err.sqlMessage));

	}
});


router.post('/change', upload.single('upfile'), async (req, res, next) => {
	let values,query,r,connect,pug;
	try{
		var {title, writer, wdate, content, id} = req.body;
		values = [title, writer, wdate, content, id];
		query = `UPDATE books SET title=?, writer=?, wdate=?, content=? WHERE id=?`;
		connect = await pool.getConnection();
		r = await connect.query(query, values);
		connect.release();
		res.send(alert(r[0].affectedRows > 0 ? '수정되었습니다.' : '수정에 실패하였습니다.', '/book'));
	}
	catch{err}{
		if(connect) connect.release();
		next(error(500, err.sqlMessage));
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
			book.file = `/upload/${book.savefile.substr(0, 6)}/${book.savefile}`;
			if(imgExt.includes(path.extname(book.realfile).replace('.','').toLowerCase())){
				book.src = book.file;
			}
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
		next(error(500, err.sqlMessage));
	}
});

router.get('/download', (req, res, next) => {
	console.log(req.query)
	try{
		let src = path.join(__dirname, "../storage", req.query.file.slice(7));
		res.download(src, req.query.name);

	}
	catch(err){
		next(error(500, err.sqlMessage));
	}
});

router.get('/remove/:id', (req, res, next) => {
	if(req.params.id) res.json({code: 200});
	else res.json({code: 500})
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