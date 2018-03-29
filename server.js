// Dependencies 
var express = require('express');
var exphbs = require("express-handlebars");
var bodyParser = require('body-parser');
var logger = require("morgan");
var mongoose = require("mongoose");

// Initialize Express
var app = express();
var PORT = process.env.PORT || 3000;

// Use morgan logger for logging requests
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));

// Set Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static(__dirname + "/public"));

// If deployed, use the deployed database. Otherwise use the local scrapergsdb database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scrapergsdb";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
  // useMongoClient: true
});

// Create mongoose db connection variable
var db = mongoose.connection;

// if any errors than console errors
db.on("error", function (error) {
  console.log("Mongoose Error: ", error);
});

// display a console message when mongoose has a conn to the db
db.once("open", function () {
  console.log("Mongoose connection successful.");
});

// Require routes from Headlines.js file in controllers folder
require("./controllers/headline.js")(app);

// Listen of Port 3000 and let us know we're connected
app.listen(PORT, function() {
  console.log("App now listening at localhost:" + PORT);
});