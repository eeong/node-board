const express = require('express');
const app = express();
const { pool , sqlGen} = require("./modules/mysql-connect");

app.listen(3000, ()=>{
	console.log("server listen at :3000");
});

app.get('/select', async (req, res, next ) => {
	try{
		//var sql = 'SELECT * FROM books ORDER BY id DESC'
		var {sql, values} = sqlGen('books','S',{order:'ORDER BY id DESC'});
		var connect =  await pool.getConnection();
		var r = await connect.query(sql);
		connect.release();
		res.json(r); 

	}	
	catch(err){
		next(err);
	}
});


app.get('/insert', async (req, res, next ) => {
	try{
		//var sql = 'INSERT INTO books SET title=?, writer=?, wdate=?, content=?'
		req.body ={title:"title",writer:"writer",wdate:"wdate",content:"content"}
		req.file = {filename:'2092020-2020.jpg',originalname:'adad' ,size:1234}
		var {sql, values} = sqlGen('books','I',{field:['title','writer','wdate','content'], data: req.body, file:req.file});
		var connect =  await pool.getConnection();
		var r = await connect.query(sql, values);
		connect.release();
		res.json(r[0]); 

	}
	catch(err){
		next(err);
	}
});

app.get('/delete/:id', async (req, res, next ) => {
	try{
		//var sql = 'DELETE FROM books WHERE id= req.params.id'
		var {sql, values} = sqlGen('books','D',{id:2});
		var connect =  await pool.getConnection();
		var r = await connect.query(sql, values);
		connect.release();
		res.json(r[0]); 

	}
	catch(err){
		next(err);
	}
});

app.get('/update', async (req, res, next ) => {
	try{
		//var sql = 'UPDATE books SET title=?, writer=?, wdate=?, content=? WHERE id= req.body.id'
		req.body ={title:"title",writer:"writer",wdate:"wdate",content:"content", id=199};
		req.file = {filename:'2092220-2020.jpg',originalname:'adadw' ,size:12345};
		var {sql, values} = sqlGen('books','I',{field:['title','writer','wdate','content'], data: req.body, file:req.file});
		var connect =  await pool.getConnection();
		var r = await connect.query(sql, values);
		connect.release();
		res.json(r[0]); 

	}
	catch(err){
		next(err);
	}
});