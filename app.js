//전역 모듈 
require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const error = require("http-errors");
const passport = require("passport");
const http = require("http");
const https = require("https");

const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


global.Task = require('./api/models/taskModel');

const options = { // letsencrypt로 받은 인증서 경로를 입력
  ca: fs.readFileSync('/etc/letsencrypt/live/www.eeong.be/fullchain.pem'),
  key: fs.readFileSync('/etc/letsencrypt/live/www.eeong.be/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/www.eeong.be/cert.pem')
  };
  http.createServer(app).listen(3000);
	https.createServer(options, app).listen(443); 
	
const lex = require('greenlock-manage').create({
	version: 'draft-11', 
	configDir: '/etc/letsencrypt', 
	server: 'https://acme-v02.api.letsencrypt.org/directory',
	approveDomains: (opts, certs, cb) => {
		if (certs) {
			opts.domains = ['www.eeong.be', 'eeong.be']; 
		}
		else {
			opts.email = 'discography8@gmail.com';
			opts.agreeTos = true;
		}
		cb(null, { options: opts, certs });
	},
	renewWithin: 81 * 24 * 60 * 60 * 1000,
	renewBy: 80 * 24 * 60 * 60 * 1000,
});

https.createServer(lex.httpsOptions, lex.middleware(app)).listen(process.env.SSL_PORT || 443); 
http.createServer(lex.middleware(require('redirect-https')())).listen(process.env.PORT || 80);

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
	
	//서버 실행 
	
	app.listen(process.env.PORT, ()=>{
		console.log("Server listen at "+process.env.PORT)
	}); 
	
	
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
