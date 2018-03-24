var mongoose = require("mongoose");
var Note = require("./Note");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, this will create a new Schema object
var HeadlineSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    link: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

var Headline = mongoose.model("Headline", HeadlineSchema);

module.exports = Headline;