//전역변수 모듈 불러오기 
const express = require("express");
const app = express();
const path = require("path");

//사용자 모듈 불러오기
const testRouter = require('./routes/test');
const bookRouter = require('./routes/book');
const errorRouter = require('./routes/error');

//서버 실행 
app.listen(3000, ()=>{
 console.log("Server listen at http://127.0.0.1:3000")
}); 

//초기 설정
app.set('view engine', 'pug');
app.set('views', './views');
app.locals.pretty = true;

app.use(express.json());
app.use(express.urlencoded({extended: false}));

//미들웨어
app.use('/', express.static(path.join(__dirname, './public')));
app.use('/test', testRouter);
app.use('/book', bookRouter);

//예외처리
app.use(errorRouter);
app.use((err, req, res, next) => {
	const pug ={
		img : err.img ? err.img : 500,
		code: err.code ? err.code : "!!!UNEXPECTED ERROR!!!",
		msg: err.error ? err.error : err
	};

	res.status(pug.code).render('err/err.pug', pug);
});
