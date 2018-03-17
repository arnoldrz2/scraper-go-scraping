var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, this will create a new UserSchema object
var HeadlineSchema = new Schema({
    title: {
        type: String,
        required: true 
    },
    summary: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    }
});

var Headline = mongoose.model("Headline", HeadlineSchema);

module.exports = Headline;