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
app.set('view engine', 'pug');
app.set('views', './views');
app.locals.pretty = true;


//미들웨어
app.use('/', express.static(path.join(__dirname, './public')));
app.use(express.json());
app.use(express.urlencoded({extended: false}));


//라우터
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
});