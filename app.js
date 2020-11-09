//전역변수 모듈 불러오기 
const express = require("express");
const app = express();
const path = require("path");
const mysql2 = require("mysql2");
const moment = require("moment");
const connection = mysql2.createConnection({
	host: '127.0.0.1', 
	port: 3306,
	user: 'eeong',
	password: '000000',
	database: 'eeong'
})
//서버 실행 
app.listen(3000, ()=>{
 console.log("Server listen at http://127.0.0.1:3000")
}); 

//초기 설정
app.set('view engine','pug');
app.set('views', './views');
app.locals.pretty = true;


//미들웨어
app.use('/', express.static(path.join(__dirname, './public')));
app.use(express.json());
app.use(express.urlencoded({extended: false}));


//라우터
app.get('/book/list',(req, res) => {
	connection.query('SELECT * FROM books', (err, r) => {
		res.json(r);
	})
});
