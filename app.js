//전역변수 모듈 불러오기 
const express = require("express");
const app = express();
const path = require("path");

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


//미들웨어
app.use('/', express.static(path.join(__dirname, './public')));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('/test', testRouter);
app.use('/book', bookRouter);

