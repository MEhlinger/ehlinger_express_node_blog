var fs = require('fs');
var file = "posts.db";
var exists = fs.existsSync(file);
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);

db.serialize(function() {
	//if(!exists) {
		db.run("CREATE TABLE Posts (" +
		 "id INTEGER PRIMARY KEY AUTOINCREMENT," + 
		 "title TEXT,"+
		 "author TEXT,"+
		 "body TEXT,"+
		 "date TEXT)");
//		}

	for (var i = 0; i < 5; i++) {
		var stmt = db.prepare("INSERT INTO Posts (title, author, body, date) VALUES (?, ?, ?, ?)");

		var title = "Test Post" + (i+1);
		var author = "Marshall Ehlinger";
		var body = "Welcome! This is my test post. Lorem Ipsum. V:" + (i+1);
		var date = new Date();
		
		stmt.run(title, author, body, date.toISOString());
		stmt.finalize();
	}
});
db.close();
