module.exports = ()=>{
	return (req, res, next) => {
	req.app.locals.pretty = true;
	req.app.locals.headTitle = 'Node.js를 활용한 게시판'
	req.app.locals.user = req.session.user ;
	next();
}}