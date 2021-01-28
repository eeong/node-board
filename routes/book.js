const express = require('express');
const router = express.Router();
const moment = require("moment");
const error = require("http-errors");
const path = require("path");
const fs = require("fs-extra");

const { sqlGen } = require('../modules/mysql-connect');
const { alert, getPath, getExt, txtCut } = require("../modules/util");
const { upload, allowExt, imgExt } = require("../modules/multer");
const pager = require('../modules/pager-connect');
const {isUser, isGuest} = require("../modules/auth-connect");

//book render
router.get(['/','/list','/list/:page'], async (req, res, next) => {
	let r, pug, totalRecord;
	let page = req.params.page || 1;
	req.app.locals.page = page;
	try {
		r = await sqlGen('books', 'S', {field: ['count(id)']});
		totalRecord = r[0][0]['count(id)'];
		let pagers = pager(page, totalRecord, {maxList: 5, maxPage: 3});
		r = await sqlGen('books', 'S', {limit: [pagers.startIdx, pagers.maxList], order:['id', 'DESC']});
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
		res.render('book/list', pug);
	}

	catch(err) {
		`${err.code ? err.code : ""}\n
		${err.errno ? err.errno : ""}\n
		${err.sqlState ? err.sqlState : ""}\n
		${err.sqlMessage ? err.sqlMessage : ""}`
		next(error(500, err.sqlMessage || err));
	}
	});

router.get('/write', isUser, (req, res) => {
	const pug = {
		file:'book-write',
		title: '도서 작성',
		titleSub: '작성해주세요',
		allowExt
	}
	res.render('book/write', pug);
});


router.get('/write/:id', isUser, async (req, res, next) => {
	let r,pug;
	try{
			r = await sqlGen('books', 'S',{ 
				where:{
					op:'AND', 
						fields:[
							['id', req.params.id],
							['uid', req.session.passport.user]
						]
					}
				});
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
		next(error(500, err.sqlMessage || err));
	}
});

router.post('/save',isUser, upload.single('upfile') , async (req, res, next) => {
	let r;
	try{
		let q = Object.entries(req.body).filter( (v) => {return v[0] =='wdate'})[0][1];
		if (req.allow == false) {
			res.send(alert(`${req.ext}는 업로드 할 수 없는 확장자입니다.`,'/book'));
		}
		else if(q != '') {
			r = await sqlGen('books', 'I', {field: ['title', 'writer', 'content', 'wdate', 'uid'], data: req.body, file: req.file});
			res.redirect('/book/list');
		}
		else {
			res.send(alert('도서의 발행일을 입력해주세요','/book/write'));
		}
	}
	catch(err){
		next(error(500, err.sqlMessage || err));
	}
});



router.post('/change',isUser, upload.single('upfile'), async (req, res, next) => {
	let r,connect;
	try{
		if (req.allow == false) {
			res.send(alert(`${req.ext}는 업로드 할 수 없는 확장자입니다.`,'/book'));
		}
		else {
			
			if(req.file) {
				//query= 'SELECT savefile FROM books WHERE id=' +req.body.id;
				r = await sqlGen('books', 'S', {
					where:{
					op:'AND', 
						fields:[
							['id', req.body.id],
							['uid', req.session.passport.user]
						]
					}, field:['savefile']});

				if(r[0][0].savefile) await fs.remove(getPath(r[0][0].savefile));
			}
			//query = `UPDATE books SET title=?, writer=?, wdate=?, content=?`;
				r = await sqlGen('books', 'U', { field: ["title", "wdate", "writer", "content"], data: req.body, file: req.file, where:[ 'id', req.body.id] });
				res.send(alert(r[0].affectedRows > 0 ? '수정되었습니다.' : '수정에 실패하였습니다.', '/book'));
		}
	}
	catch(err){
		next(error(500, err.sqlMessage || err));
	}
});


router.get('/delete/:id',isUser, async (req, res, next) => {
	let r;
	try{
		//query = `SELECT savefile FROM books WHERE id = ${id}`;
		r = await sqlGen('books', 'S', {
			where:{
			op:'AND', 
				fields:[
					['id', req.params.id],
					['uid', req.session.passport.user]
				]
			}
		});
		if(r[0][0].savefile) await fs.remove(getPath(r[0][0].savefile));
		// query = `DELETE FROM books WHERE id = ${id}`;
		r = await sqlGen('books', 'D', {
			where:{
			op:'AND', 
				fields:[
					['id', req.params.id],
					['uid', req.session.passport.user]
				]
			}
		});
		res.send(alert(r[0].affectedRows>0 ? '삭제되었습니다.' : '삭제에 실패하였습니다.', '/book'));
	}
	catch(err){
		next(error(500, err.sqlMessage || err));

	}
});

router.post('/multer/save',isUser, upload.single('upfile'), (req, res, next) => {
	res.redirect('/book');
});

router.get('/view/:id', async (req, res, next) => {
	let pug, r, book;
	try{
		r = await sqlGen('books', 'S', {field: ['count(id)']});
		totalRecord = r[0][0]['count(id)'];
		// query = `SELECT * FROM books WHERE id= ${req.params.id}`;
		r = await sqlGen('books','S', {between:['id', Number(req.params.id)-1, Number(req.params.id)+1]});
		console.log(r[0])
		if(req.params.id > 1){
			book = r[0][1];
			if(r[0][2]) book.next = [r[0][2].title, r[0][2].writer, r[0][2].content] ;
			if(r[0][0]) book.prev = [r[0][0].title, r[0][0].writer, r[0][0].content] ;
		}
		else {
			book = r[0][0];
			if(r[0][1]) book.next = [r[0][1].title, r[0][1].writer, r[0][1].content] ;

		}
		book.wdate = moment(book.wdate).format('YYYY-MM-DD');
		if(book.savefile){
			book.file = getPath(book.savefile,'rel'); //`/upload/${book.savefile.substr(0, 6)}/${book.savefile}`;
			if(imgExt.includes(getExt(book.realfile))){
				book.src = book.file;
			}
		}
		pug = {
			file:'book-view',
			title: '도서 상세보기',
			titleSub: '도서의 내용을 보여줌',
			book,
			totalRecord,
			page: req.app.locals.page
		}
		res.render('book/view', pug);
	}
	catch(err){
		next(error(500, err.sqlMessage || err));
	}
});

router.get('/download', (req, res, next) => {
	try{
		let src = path.join(__dirname, "../storage", req.query.file.slice(7));
		res.download(src, req.query.name);

	}
	catch(err){
		next(error(500, err.sqlMessage || err));
	}
});

router.get('/remove/:id',isUser, async (req, res, next) => {
	let connect, r;
	try {
		//query = 'SELECT savefile FROM books WHERE id=' + req.params.id;
		r = await sqlGen('books', 'S', {
			where:{
			op:'AND', 
				fields:[
					['id', req.params.id],
					['uid',  req.session.passport.user]
				]
			}, field:['savefile']} );
		let book = r[0][0];
		await fs.remove(getPath(book.savefile));
		//query = 'UPDATE books SET savefile=NULL, realfile=NULL, filesize=NULL WHERE id=' + req.params.id;
		r = await sqlGen('books','U',{
			where:{
			op:'AND', 
				fields:[
					['id', req.params.id],
					['uid',  req.session.passport.user]
				]
			}, field:['savefile', 'realfile', 'filesize'], data:{savefile:null,reqlfile:null,filesize:null}});
		res.json({code: 200});
	}
	catch(err) {
		res.json({code: 500, error: err});
	}
});



module.exports = router;

