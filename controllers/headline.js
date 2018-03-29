// Scraping tools
var request = require("request");
var cheerio = require("cheerio");
// Requiring our Note and Headline models
var Note = require("../models/Note.js");
var Headline = require("../models/Headline.js");

module.exports = function (app) {

// Routes
app.get("/", function(req, res){
  res.redirect("/headlines");
});


// A GET route for scraping the echojs website
app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with request
    request("https://www.nytimes.com/", function(error, response, html) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(html);
  
      // Now, we grab every article, and do the following:
      $("article").each(function(i, element) {
        // Save an empty result object
        var result = {};
  
        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this).children("h2").text();
        result.link = $(this).children("h2").children("a").attr("href");
        result.summary = $(this).children(".summary").text();
  
        // Create a new Headline using the `result` object built from scraping
        Headline.create(result, function(err, doc) {
          if (err) {
            console.log(err);
          } else {
            console.log(doc);
          }
        });
      });
    });
    // If we were able to successfully scrape and save an Article, send a message to the client
    // res.send("Scrape Complete");
    res.redirect("/");
  });
  
  // Route for getting all Articles from the db
  app.get("/headlines", function(req, res) {
    // Grab every document in the Articles collection
    Headline.find({}, function (error, doc){
      if (error) {
        console.log(error);
      } else {
        res.render("index", {result: doc});
      }
    })
    .sort({'_id': -1});
  });
  
  // Route for grabbing a specific Headline by id, populate it with it's note
  app.get("/headlines/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    Headline.findOne({ "_id": req.params.id })
      // ..and populate all of the notes associated with it
      .populate("note")
      .exec(function(error, doc) {
        if (error) {
          console.log(error);
        } else {
          res.render("saved", {result: doc});
        }
      });
  });
  
  // Route for saving/updating an Article's associated Note
  app.post("/headlines/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    Note.create(req.body, function (error, doc) {
      if (error) {
        console.log(error);
      } else {
        Headline.findOneAndUpdate({
          "_id": req.params.id
        }, {
          $push: {
            "note": doc._id
          }
        }, {
          safe: true,
          upsert: true,
          new: true
        })
        .exec(function(err, doc){
          if(err) {
            console.log(err);
          } else {
            res.redirect('back');
          }
        });
      }
    });
  });

};