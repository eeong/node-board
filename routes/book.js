const express = require('express');
const router = express.Router();
const moment = require("moment");
const error = require("http-errors");
const path = require("path");
const fs = require("fs-extra");

const { pool , sqlGen } = require('../modules/mysql-connect');
const { alert, getPath, getExt, txtCut } = require("../modules/util");
const { upload, allowExt, imgExt } = require("../modules/multer");
const {	pager } = require('../modules/pager-connect');

//book render
router.get(['/','/list','/list/:page'], async (req, res, next) => {
	// let query = 'SELECT * FROM books ORDER BY id ASC LIMIT 0, 10';
	let connect, r, pug, totalRecord, maxList, maxPager;
	let page = req.params.page || 1;
	req.app.locals.page = page;
	try {
		r = await sqlGen('books', 'S', {field: ['count(id)']});
		totalRecord = r[0][0]['count(id)'];
		let pagers = pager(page, totalRecord, {maxList: 3, maxPage: 3});
		r = await sqlGen('books', 'S', {limit: [pagers.startIdx, pagers.maxList], order:'ORDER BY id DESC'});
		for (let v of r[0]){
		 v.wdate = moment(v.wdate).format('YYYY-MM-DD');
		 if (v.savefile) v.icon = getExt(v.savefile,'upper');
		 v.content = txtCut(v.content);
		}	
		pug = {
		file: 'book-list',
		title: '도서 리스트',
		titleSub: '고전도서 리스트',
		lists: r[0],
		...pagers
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
			r = await sqlGen('books', 'S', {id:req.params.id});
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
			r = await sqlGen('books', 'I', {field:['title', 'writer', 'content', 'wdate'], data: req.body, file: req.file});
			res.redirect('/book/list');
		}
	}
	catch(err){
		if(connect) connect.release();
		next(error(500,err.sqlMessage || err));
	}
});



router.post('/change', upload.single('upfile'), async (req, res, next) => {
	let r,connect;
	try{
		if (req.allow == false) {
			res.send(alert(`${req.ext}는 업로드 할 수 없는 확장자입니다.`,'/book'));
		}
		else {
			
			if(req.file) {
				//query= 'SELECT savefile FROM books WHERE id=' +req.body.id;
				r = await sqlGen('books', 'S', { id: req.body.id, field:['savefile']});
				if(r[0][0].savefile) await fs.remove(getPath(r[0][0].savefile));
			}
			//query = `UPDATE books SET title=?, writer=?, wdate=?, content=?`;
				r = await sqlGen('books', 'U', { field: ["title", "wdate", "writer", "content"], data: req.body, file: req.file, id: req.body.id });
				res.send(alert(r[0].affectedRows > 0 ? '수정되었습니다.' : '수정에 실패하였습니다.', '/book'));
		}
	}
	catch(err){
		if(connect) connect.release();
		next(error(500, err.sqlMessage || err));
	}
});


router.get('/delete/:id', async (req, res, next) => {
	let r,connect;
	try{
		//query = `SELECT savefile FROM books WHERE id = ${id}`;
		r = await sqlGen('books', 'S', {id: req.params.id});
		if(r[0][0].savefile) await fs.remove(getPath(r[0][0].savefile));
		// query = `DELETE FROM books WHERE id = ${id}`;
		r = await sqlGen('books', 'D', {id: req.params.id});
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
	let connect, pug, r, book;
	try{
		// query = `SELECT * FROM books WHERE id= ${req.params.id}`;
		r = await sqlGen('books','S', {id:req.params.id});
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
			book,
			page: req.app.locals.page
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
	let connect, r;
	try {
		//query = 'SELECT savefile FROM books WHERE id=' + req.params.id;
		r = await sqlGen('books', 'S', {id: req.params.id, field:['savefile']} );
		let book = r[0][0];
		await fs.remove(getPath(book.savefile));
		//query = 'UPDATE books SET savefile=NULL, realfile=NULL, filesize=NULL WHERE id=' + req.params.id;
		r = await sqlGen('books','U',{id:req.params.id, field:['savefile', 'realfile', 'filesize'], data:{savefile:null,reqlfile:null,filesize:null}});
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