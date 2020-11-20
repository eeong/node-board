module.exports = ()=>{
	return (req, res, next) => {
	req.app.locals.pretty = true;
	req.app.locals.user = req.session.user ;
	next();
}}