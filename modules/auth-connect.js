const {alert} = require('./util');

const isUser = (req, res, next) =>{
	if(req.app.locals.user ) next();
	else res.send(alert('로그인해주세요','/user/login'));
}


const isGuest = (req, res, next) => {
	if(req.app.locals.user ) res.send(alert('정상적인 접근이 아닙니다','/'))
	else next()
} 

module.exports = {isUser, isGuest};