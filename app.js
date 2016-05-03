"use strict";
const express = require('express');
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const domain = require('domain').create();

const file = "posts.db";
const db = new sqlite3.Database(file);
const app = express();
const port = 3000;

domain.on('error', function(err) {
	console.log("Thrown: " + err);
});

app.use(bodyParser.urlencoded({extended:true}));

Array.prototype.includes = function(key) {
	if (this.indexOf(key) !== -1) {
		return true;
	} else {
		return false;
	}
};


//   Home  //
app.route('/').get(function(req, res) {
	db.serialize(function() {
		let postString = "";
		db.each("SELECT id, title, author, body, date FROM Posts", function(err, row) {
			postString += "<h2>" +  row.title + "</h2>" + row.author + "<p>" + row.body + "</p>Date: " + row.date + "; id: " + row.id;
		}, function(err) {
			if (err) {
				console.error(err);
				res.status('501').send('Internal Server Error');
			} else {
				res.send(postString + "<br><center><a href='/posts'>POSTS</a> | <a href='/new'>NEW POST</a><center>")
			}
		});
	});
});


// //  Add New Blog Post  //
app.route('/new').get(function(req, res) {
	res.send("<form method='post' action='/new'>" + 
		"Post Title:<input type='text' name='title'><br>" +
		"Author:<input type='text' name='author'><br>"+
		"Post Body<input type='text' name ='body'><br>"+
		"<input type='submit' value='Submit Post'><input type='reset'>");
}).post(function(req, res) {
	db.serialize(function() {
		var stmt = db.prepare("INSERT INTO Posts (title, author, body, date) VALUES (?, ?, ?, ?)");

		var title = req.body.title;
		var author = req.body.author;
		var body = req.body.body;
		var date = new Date();
		
		stmt.run([title, author, body, date.toISOString()], domain.intercept(function(data) {
			stmt.finalize();
			res.status('200').send("<center><br><b>Post Successful.</b><br><a href='/'>HOME</a><center>" )	
		}));
	});
});

// //  Edit Existing Blog Post  //
app.route('/edit/:id').get(function(req, res) {
	res.send("<form method='post' action='/edit/" + req.params.id +"'>" + 
		"Post Title:<input type='text' name='title'><br>" +
		"Author:<input type='text' name='author'><br>"+
		"Post Body<input type='text' name ='body'><br>"+
		"<input type='submit' value='Submit Post'><input type='reset'>");
}).post(function(req, res) {
	db.serialize(function() {
		let ids = [];
		db.each("SELECT id FROM Posts", function(err, row) {
			ids.push(row.id);
		}, function(err) {
			if (ids.includes(Number(req.params.id))) {
				var stmt = db.prepare("UPDATE Posts SET title=?, author=?, body=?, date=? WHERE id = " + req.params.id);

				var title = req.body.title;
				var author = req.body.author;
				var body = req.body.body;
				var date = new Date();

				stmt.run([title, author, body, date.toISOString()], domain.intercept(function(data) {
					stmt.finalize();
					res.status('200').send("<center><br><b>Edit Successful.</b><br><a href='/'>HOME</a><center>");
				}));
			} else {
				res.status('501').send('Yeah you made that id up. Get out of my house.');
			}
		});
	});
});

// //  Archival Page  //
app.route('/posts').get(function(req, res) {
	db.serialize(function(){
		let titles = "";
		db.each("SELECT title, id FROM Posts", function(err, row) {
			titles += "<a href='" + req.url + "/" + row.id + "'>" + row.title + "</a><br>";
		}, function(err) {
			if (err) {
				res.status('501').status('Internal Server Error');
			} else {
				res.send(titles + "<br><center><a href='/'>BACK TO HOME</a>");
			}
		})
	})
});


// //  Specific Post Page  //
app.route('/posts/:id').get(function(req, res) {
	db.serialize(function() { 
		let ids = []
		db.each("SELECT id FROM Posts", function(err, row) {
			ids.push(row.id);
		}, function(err) {
			if (ids.includes(Number(req.params.id))) {
				db.get("SELECT id, title, author, body, date FROM Posts WHERE id = ?", req.params.id, domain.intercept(function(row) {
					res.send("<h2>" +  row.title + "</h2>" + row.author + "<p>" + row.body + "</p>Date: " + row.date + "; id: " + row.id +
						"<br><a href='/posts'>BACK TO ARCHIVE</a> | <a href='/'>HOME</a>" +
						"<br><form action='/posts/" + req.params.id + "' method='post'><input type='submit' value='DELETE POST'></form>" + 
						"<form  action='/edit/" + req.params.id + "' method='get'><input type='submit' value='EDIT POST'></form>");
				}));	
			} else {
				res.status('404').send("404 NOT FOUND <br> No Post Matching id:" + req.params.id + "<br><a href='/posts'>BACK TO ARCHIVE</a>");
			}
		});
	});
}).post(function(req, res) {
	db.serialize(function(){
		db.get("DELETE FROM Posts WHERE id = ?", req.params.id, function(err, row) {
			if (err) {
				console.error(err);
				res.status('501').send('501 Internal Server Error');
			} else {
				res.status('200').send("<center><b>Post Deleted</b><br><a href='/posts'>BACK TO ARCHIVE</a></center>")
			}
		});
	});
});


app.listen(3000, function() {
	console.log("App listening on port " + port + ".");
});
