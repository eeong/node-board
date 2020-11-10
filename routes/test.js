const express = require('express');
const router = express.Router();
router.get('/', (req, res) => {
	res.send('<h1>test like that</h1>')
}) 
router.get('/sample', (req, res) => {
	res.send('<h1> sample like that</h1>')
}) 

module.exports = router;