//전역변수 모듈 불러오기 
const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const moment = require("moment")

const multer = require("multer");
const { v4: uuidv4} = require("uuid");

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		var folder = path.join(__dirname, './storage', moment().format('YYMMDD'))
		if(!fs.existsSync(folder)) fs.mkdirSync(folder);
		cb(null, folder);
	},
  filename: (req, file, cb) => {
		var ext = path.extname(file.originalname);
		var name = moment().format('YYMMDD') + '-' +uuidv4() + ext;
	 cb(null, name);
	}
});

 
const upload = multer({ storage});

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

//멀터

app.get('/multer', (req, res, next) => {
	res.render('multer/write.pug');
	next();
});

app.post('/multer/save', upload.single('upfile'), (req, res, next) => {
	res.json(req.body);
});

//예외처리
app.use(errorRouter);
app.use((err, req, res, next) => {
	const pug ={
		img : err.img || 500,
		code: err.code || "!!!UNEXPECTED ERROR!!!",
		msg: err.error || err
	};

	res.render('err/err.pug', pug);
});
