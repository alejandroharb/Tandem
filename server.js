'use strict';
// Dependencies
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require("body-parser");
var multer = require('multer')

//sessions middleware
const session = require('express-session');
app.use(session({
    secret: "boiling kettle",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false }
}));

//file upload middleware
var mv = require('mv');

//======database connection, models=========
var db = require('./models');

//=========Handlebars Setup============
var exphbr = require('express-handlebars');
app.engine("handlebars", exphbr({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//server port
var PORT = process.env.PORT || 3000;

// BodyParser makes it possible for our server to interpret data sent to it.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Static directory
app.use(express.static("./public"));

//==========importing routes=============
// require('./routes/api-auth-routes.js')(app);
require('./routes/html-routes.js')(app);
// require('./routes/api-home-routes.js')(app);
require('./routes/pictures.js')(app);
// require('./routes/api-matching-routes.js')(app);
// require('./routes/yelp-routes.js')(app);
require('./routes/scores-routes.js')(app);

const routes = require('./routes');
for (let route in routes){
  app.use(route, routes[route]);
}

db.sequelize.sync().then(function () {
    app.listen(PORT, function () {
        console.log("listening on Port: " + PORT);
    })
})
