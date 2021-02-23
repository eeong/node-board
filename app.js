//전역 모듈 
require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const error = require("http-errors");
const passport = require("passport");
const http = require("http");
const https = require("https");
const fs = require("fs");
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


global.Game = require('./api/models/gameModel');
global.ItemArmor = require('./api/models/armorModel');
global.ItemWeapon = require('./api/models/weaponModel');

const options = { 
  ca: fs.readFileSync('/etc/letsencrypt/live/www.eeong.be/fullchain.pem'),
  key: fs.readFileSync('/etc/letsencrypt/live/www.eeong.be/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/www.eeong.be/cert.pem')
  };
  

// 프로토콜 별  서버 실행  

  http.createServer(app).listen(process.env.PORT);
  https.createServer(options, app).listen(process.env.PORT_SSL); 
	
	
//MongoDB Set

mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);
mongoose.connect(
	`${process.env.DB}`,
  { useNewUrlParser: true }
	);
	
	//사용자 모듈 
	const session = require('./modules/session-connect');
	const morgan = require('./modules/morgan-connect');
	const local = require('./modules/locals');
	const passportModule = require('./passport');
	
	//사용자 라우터
	const bookRouter = require('./routes/book');
	const userRouter = require('./routes/user');
	const bserRouter = require('./api/routes/Routes');
	
	/*서버 실행 
	
	app.listen(80, ()=>{
		console.log("Server listen at "+process.env.PORT)
	});*/ 
	
	
	//초기 설정
	app.set('view engine', 'pug');
	app.set('views', './views');
	
	
	//미들웨어
	app.use(express.json());
	app.use(express.urlencoded({extended: false}));

app.use(morgan());
app.use(session());
app.use(local());

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//passport 설정 
passportModule(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
	app.locals.user = req.user ? req.user : null;
	next();
}); 

//라우터
app.use('/', express.static(path.join(__dirname, './public')));
app.use('/upload', express.static(path.join(__dirname,'./storage')));
app.use('/book', bookRouter);
app.use('/user', userRouter);
app.use('/bser', bserRouter);


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
