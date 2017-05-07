'use strict';
// Dependencies
var express = require('express');
var exphbr = require('express-handlebars');
var path = require('path');
var bodyParser = require("body-parser");
var multer = require('multer')
var logger = require('morgan');
var cookieParser = require('cookie-parser');
// var passport = require('passport');

var session = require('express-session');
//file upload middleware
var mv = require('mv');

var app = express();
//=========Handlebars Setup============
app.engine("handlebars", exphbr({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//======database connection, models=========
var db = require('./models');

// =======middleware=======
app.use(logger('dev'));
// BodyParser makes it possible for our server to interpret data sent to it.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
app.use(express.static('public'));
app.use(session({
    secret: "boiling kettle",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
// app.use(passport.initialize());
// app.use(passport.session());

// app.use(cookieParser());
//sessions
//file upload middleware
var mv = require('mv');

//server port
var PORT = process.env.PORT || 3000;





//==========importing routes=============
// require('./routes/api-auth-routes.js')(app);
require('./routes/html-routes.js')(app);
// require('./routes/api-home-routes.js')(app);
require('./routes/pictures.js')(app);
// require('./routes/api-matching-routes.js')(app);
require('./routes/yelp-routes.js')(app);
// require('./routes/scores-routes.js')(app);

const routes = require('./routes');
for (let route in routes){
  app.use(route, routes[route]);
}

db.sequelize.sync().then(function () {
    app.listen(PORT, function () {
        console.log("listening on Port: " + PORT);
    })
})
