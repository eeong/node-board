const express = require('express');
const router = express.Router();
router.get('/', (req, res, next) => {
	//res.send('<h1> first</h1>');
	const err = new Error();
	next(err);
}); 
router.get('/', (req, res, next) => {
	res.send('<h1> second</h1>')
}) ;

router.get('/', (req, res, next) => {
	res.send('<h1> third</h1>')
}) ;
router.get('/sample', (req, res) => {
	res.send('<h1> sample like that</h1>')
}) ;

module.exports = router;