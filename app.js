//전역 모듈 
require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const error = require("http-errors");
const passport = require("passport");

//사용자 모듈 
const session = require('./modules/session-connect');
const morgan = require('./modules/morgan-connect');
const local = require('./modules/locals');
const passportModule = require('./passport');

//사용자 라우터
const testRouter = require('./routes/test');
const bookRouter = require('./routes/book');
const userRouter = require('./routes/user');

//서버 실행 
app.listen(process.env.port, ()=>{
 console.log("Server listen at http://127.0.0.1:"+process.env.PORT)
}); 

//초기 설정
app.set('view engine', 'pug');
app.set('views', './views');
app.locals.pretty = true;
app.locals.headTitle = 'Node.js를 활용한 게시판'

//미들웨어
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(morgan());
app.use(session());
app.use(local());

//passport 설정 
/* passportModule(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
	app.locals.user = req.user ? req.user : {};
	next();
}); */


//라우터
app.use('/', express.static(path.join(__dirname, './public')));
app.use('/upload', express.static(path.join(__dirname,'./storage')));
app.use('/test', testRouter);
app.use('/book', bookRouter);
app.use('/user', userRouter);



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
