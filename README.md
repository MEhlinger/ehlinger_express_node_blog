Microblog with Node and Express
===============================


### What It Is

This is a microblog web application written in Javascript for Node,
using the popular Express web framework and the SQLite database.

This has been prepared for Professor Phillips' Spring 2016 Programming
Languages class at Mansfield University. In lieu of an explanatory PDF,
I give you this readme written in markdown.

The intent of the project was to create a simple demonstration of modern
server-side javascript. I have used Javascript in the browser, and SQLite
with Python, but I had yet to write a complete program with Node & SQLiite.

The application is configured to run locally on port 3000. There are some 
very boring test posts that can be modified or deleted.
It functions as a straightforward CRUD interface over HTTP. It is pretty
much entirely unstyled, but has all the basic functionality, and some
poorly tested error handling. If you find a bug, please do let me know.

This is for educational purposes only. I cannot attest to the quality of
the code, or the security of the application in a production environment.


### How to Use It

First, install node: [Node](http://nodejs.org)

and [NPM](https://www.npmjs.com/) while you're at it.


Clone it and runn app.js:

`$ node app.js`

Run populateDb.js if you want to reset the database:

`$ node populateDb.js`

Navigate to `127.0.0.1:3000` in your browser. You should see the home screen,
with a few boring posts and links to other parts of the application. 
Tinker around to your heart's content!


### Technologies

The microblog uses Node, an asynchronous server-side javascript platform.
Node allows web developers to write web applications that use the same
language on the client (javascript in the browser) and the server. 
Without something like Node, developers might use Ruby on Rails for Ruby, or
Django/Flask for Python to provide the back-end to their application.

The asynchronous nature of Node means that programs cannot be written in 
linear way that one might write a typical piece of software. In the case
of this application, http requests trigger function calls that respond the
request appropriately. This is done through the simple and fantastic Express
web framework, which works via Node to provide simple HTTP service methods.

One of the most interested features of Node for the computer science student
familiar with vanilla java desktop applications is the notion of callbacks.
Whereas in a linear program you can place one function on the line after 
another and expect, to a great degree of accuracy, the order in which they
will be called, this is not the case in Node javascript. Since it is 
asynchronous, there is no guarantee of exactly when one function will finish,
and whether it will finish before or after another. 

The solution to this predicament is callbacks. This is the function to call 
after the first function has returned. Most of the time, the callback is passed 
two arguments: the data returned from the first application, then any errors thrown.
This application actually does not embody the notion of callbacks particularly well,
because many of the operations performed are serialized for the very much
synchronous database, SQLite.

SQLite is a small SQL database, contained within a single file, for use primarily
with small web, mobile, and embedded applications. Having the entire database in
a single file obviously has restrictions, but the low overhead and high-quality
libraries connecting SQLite to popular high-level programming languages like
Javascript and Python. 

Error handling proved to be the biggest problem. I have very little experience
with error handling from my work with Java at the university, and unfortunately
have barely dabbled in my own time. The bulk of the time I spent debugging the 
application was getting error handling right, which is a spot of irony not lost
on me. Works well enough now, though.


### Limitations
The project is not entirely complete. I chose to leave it unstyled initially
because I intented to use a templating system like Jade or Liquid to provide
easily customizable, drop-in templates. After I got very hung up on Node error
handling, I put the templating on the backburner and never returned to it.

The next step of this project will be to implement the templating, likely
with Liquid. Liquid is used in the Jekyll blogging framework, which I have
recently used to deploy a simple website for a local event, [The Other Health Fair](http://theOtherHealthFair.org).
I don't intend to hard-code and style via css etc, so that this could be
reused for various sites without necessarily looking exactly the same.

I'm also nervous about the security of the application and SQLite. I know
very little about security. I would be hesistant to deploy this without some
serious research or the guiding hand of an experience web developer.



### More Reading

[Express](http://expressjs.com/)

[SQLite](https://www.sqlite.org/)


