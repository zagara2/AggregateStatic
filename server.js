require("babel-register")({
    presets: ['react']
});

var express = require('express');
var session = require('express-session');
var app = express();

//from express session tutorial
// app.set('public', __dirname + '/public');
//app.engine('html', require('ejs').renderFile);
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

var sess;
//


app.use(express.static("public"));
// app.use(require("./routes/index.jsx"));



// DB TEST STUFF START
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

app.use(bodyParser.urlencoded({
    extended: true //changed to "true" because of express session tutorial 
}));

var Test = require("./models/testModel.js");

var db = process.env.MONGODB_URI || "mongodb://localhost/mongoTestAggregate3";

// Connect mongoose to our database
mongoose.connect(db, function(error) {
    // Log any errors connecting with mongoose
    if (error) {
        console.log(error);
    }
    // Or log a success message
    else {
        console.log("mongoose connection is successful");
    }
});

//DB TEST: ROUTES

// Route to post our form submission to mongoDB via mongoose
app.post("/submit", function(req, res) {

    // We use the "Example" class we defined above to check our req.body(what the user typed in) against our user model(how we specified things have to be in order to be accepted into the database)
    //putting the user input into a format that can be saved to the database
    var user = new Test(req.body);

    // With the new "Example" object created, we can save our data to mongoose
    // Notice the different syntax. The magic happens in userModel.js
    user.save(function(error, doc) { //doc is the data to be saved
        // Send any errors to the browser
        if (error) {
            res.send(error);
        }
        // Otherwise, send the new doc to the browser
        else {
            res.send(doc);
        }
    });
});


// Route to get all saved users
app.get("/users", function(req, res) {

    Test.find({})
        .exec(function(err, doc) {

            if (err) {
                console.log(err);
            } else {
                res.send(doc);
            }
        });
});

//END OF DB TEST STUFF 

//START OF EXPRESS SESSION TUTORIAL ROUTE STUFF

// app.get('/', function(req, res) {
//     sess = req.session;
//     console.log("path is /");
//     //Session set when user Request our app via URL
//     if (sess.email) {

//          * This line check Session existence.
//          * If it existed will do some action.

//          console.log("session found. path is /");
//         res.redirect('/admin');
//     } else {
//     	console.log("session not found. path is /");
//         res.sendFile(__dirname + './public/index.html');
//     }
// });

app.post('/login', function(req, res) {
    console.log(req.body);
    //check if user's email is in the db
    //or rather, check if there is a db entry that matches both the entered email and pword

    Test.find({ $and: [{ email: req.body.email }, { password: req.body.pass }] })
        .exec(function(err, doc) {

            if (err) {
                console.log(err);
            } else if (!doc.length) { //if no entry found that matches both 
                console.log("email/password mismatch");
                flash = {
                    "msg": "Email/password mismatch! Try again.",
                    "level": "warning"
                };
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(flash));

                // alert("email/password mismatch! try again");
            } else {
                // res.send(doc);
                sess = req.session;
                //In this we are assigning email to sess.email variable.
                //email comes from HTML page.
                sess.email = req.body.email;
                res.end('done');
            }
        });



});

app.get('/admin', function(req, res) {
    sess = req.session;
    if (sess.email) {
        // res.write('<h1>Hello ' + sess.email + '</h1>');
        // res.end('<a href="/logout">Logout</a>');
        res.sendFile(__dirname + '/html/adminLanding.html');
    } else {
        res.write('<h1>Please login first.</h1>');
        res.end('<a href="/">Login</a>');
    }
});

app.get('/logout', function(req, res) {
    req.session.destroy(function(err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    });

});



//END OF EXPRESS TUTORIAL ROUTE STUFF


//Routes for board creation

var Board = require("./models/boardModel.js");

// Route to post our form submission to mongoDB via mongoose
app.post("/submitBoard", function(req, res) {

    // console.log(req.body);

    sess = req.session;
    if (sess.email) {


        var newBoard = {
            boardname: req.body.boardname,
            description: req.body.description,
            owner: sess.email,
            imageLink: req.body.imageLink,
            dataSourceIDs: []

        };

        Board.find({ owner: sess.email })
            .exec(function(err, doc) {

                if (err) {
                    console.log(err);
                } else if (doc.length >= 5) {

                    flash = {
                        "msg": "Too many boards! Board limit is 5.",
                        "level": "warning"
                    };
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(flash));


                } else {
                    console.log("enough boards");

                    // Save the new board we made to mongoDB with mongoose's save function
                    Board.create(newBoard, function(err, doc) {
                        // Log any errors
                        if (err) {
                            console.log(err);
                        }
                        // Or just log the doc we saved
                        else {
                            // console.log(doc);
                            // res.send(doc); 
                            //uncomment above line just to see api stuff for the given board, otherwise the below line just sends you back to 
                            //an updated version of your landing page
                            //should it send you right to the page for that event?
                            console.log("board created");
                            // res.redirect("/admin");
                            res.end('done');
                            // Place the log back in this callback function
                            // so it can be used with other functions asynchronously
                            // cb(doc);
                        }
                    });



                }
            });





    } else {
        res.write('<h1>Please login first.</h1>');
        res.end('<a href="/">Login</a>');
    }


});


// Route to get all of a user's boards
app.get("/myBoards", function(req, res) {

    sess = req.session;

    if (sess.email) {

        Board.find({ owner: sess.email })
            .exec(function(err, doc) {

                if (err) {
                    console.log(err);
                } else {
                    res.send(doc);
                }
            });


    } else {
        res.write('<h1>Please login first.</h1>');
        res.end('<a href="/">Login</a>');
    }
});


//delete a board


app.delete("/eventPage/:id", function(req, res) {

    sess = req.session;

    // first remove all links from the board

    if (sess.email) {

        Link.find({ $and: [{ addedBy: sess.email }, { boardID: req.params.id }] }).remove().exec(function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("links deleted");
            }
        });

        //now delete the empty board

        var boardID = req.params.id;
        console.log("board id: " + boardID);

        Board.find({ $and: [{ owner: sess.email }, { _id: boardID }] }).remove().exec(function(err) {
            if (err) {
                console.log(err);
            } else {
            	console.log("board deleted");
                // res.redirect("/admin");
                res.end('done');
            }
        });


    } else {
        res.write('<h1>Please login first.</h1>');
        res.end('<a href="/">Login</a>');

    }
});




//end of routes for board creation


//routes for individual event page

var Link = require("./models/linkModel.js");

app.get("/eventPage/:id", function(req, res) {

    sess = req.session;
    // console.log(req.params.id);

    if (sess.email) {


        res.sendFile(__dirname + "/html/eventPage.html");


    } else {
        res.write('<h1>Please login first.</h1>');
        res.end('<a href="/">Login</a>');
    }
});


app.get("/eventPage/api/:id", function(req, res) {

    sess = req.session;
    console.log(req.params.id);

    if (sess.email) {

        Board.find({ _id: req.params.id })
            .exec(function(err, doc) {

                if (err) {
                    console.log(err);
                } else {
                    res.send(doc);
                }
            });




    } else {
        res.write('<h1>Please login first.</h1>');
        res.end('<a href="/">Login</a>');
    }
});

app.post("/submitLink", function(req, res) {

    // console.log(req.body);
    // console.log(req.params);

    sess = req.session;
    if (sess.email) {


        var newLink = {
            title: req.body.title,
            rating: req.body.rating,
            addedBy: sess.email,
            url: req.body.url,
            linkType: req.body.linkType,
            boardID: req.body.boardID

        };




        Board.find({ _id: req.body.boardID })
            .exec(function(err, doc) {

                console.log(doc);
                console.log("owner is: " + doc[0].owner);
                console.log("logged in: " + sess.email);

                if (err) {
                    console.log(err);
                } else if (doc[0].owner != sess.email) { //if owner of board is not current user
                    console.log("not your board");
                    flash = {
                        "msg": "Not your board! You can't submit a link here.",
                        "level": "warning"
                    };
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(flash));


                } else {

                    // Save the new link we made to mongoDB with mongoose's save function
                    Link.create(newLink, function(err, doc2) {
                        // Log any errors
                        if (err) {
                            console.log(err);
                        }
                        // Or just log the doc we saved
                        else {
                            console.log(doc2);
                            // res.send(doc); 
                            res.end('done');

                        }
                    });


                }
            });





    } else {
        res.write('<h1>Please login first.</h1>');
        res.end('<a href="/">Login</a>');
    }


});

//get all the links for a particular board belonging to the logged in user

app.get("/eventPage/:id/myLinks", function(req, res) {

    sess = req.session;

    if (sess.email) {

        Link.find({ $and: [{ addedBy: sess.email }, { boardID: req.params.id }] })
            .exec(function(err, doc) {

                if (err) {
                    console.log(err);
                } else {
                    res.send(doc);
                }
            });


    } else {
        res.write('<h1>Please login first.</h1>');
        res.end('<a href="/">Login</a>');
    }
});

//delete a link
app.delete("/link/:linkID", function(req, res) { //pass the linkID as a data attribute to the delete button

    sess = req.session;

    // var id = req.params(id);

    if (sess.email) {

        Link.find({ $and: [{ addedBy: sess.email }, { _id: req.params.linkID }] }).remove().exec(function(err) { //find the link added by current user on current board with given id
            if (err) {
                console.log(err);
            } else {
                // res.redirect("/eventPage/:id");
                console.log("deleted");
                res.end('done');
            }
        });

    } else {
        res.write('<h1>Please login first.</h1>');
        res.end('<a href="/">Login</a>');

    }
});





//end of link-related routes

// Any non API GET routes will be directed to our React App and handled by React Router
//this goes last since routes are evaluated in order, and this is a catch all last resort route!
app.get("*", function(req, res) {
    console.log("last resort");
    sess = req.session;
    if (sess.email) {
        console.log("session found. path is *");
        // res.sendFile(__dirname + '/html/adminLanding.html');
        res.redirect("/admin");
    } else {
        console.log("session not found. path is *");

        res.sendFile(__dirname + "/html/index.html");
    }
});




var PORT = process.env.PORT || 3000;
app.listen(PORT, function() {

    console.log('http://localhost:' + PORT);
});