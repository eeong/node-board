//전역변수 모듈 불러오기 
const express = require("express");
const app = express();
const path = require("path");
const error = require("http-errors");



//사용자 모듈 불러오기
const testRouter = require('./routes/test');
const bookRouter = require('./routes/book');

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
app.use('/upload', express.static(path.join(__dirname,'./storage')));
app.use('/test', testRouter);
app.use('/book', bookRouter);

//예외처리
app.use((req, res, next) => {
	next(error(404, 'Page Not Found 페이지를 찾을 수 없습니다'));
});

app.use((err, req, res, next) => {
	const pug ={
		img : err.status == 404 ? err.status : 500,
		code: err.status || 500,
		msg: err.message || "Unexpected Error"
	};
	console.log(err)
	res.render('err/err.pug', pug); 
});