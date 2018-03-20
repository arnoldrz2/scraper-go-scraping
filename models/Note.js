var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NoteSchema = new Schema({
    body: {
        type: String
    },
    headline: {
        type: Schema.Types.ObjectId,
        ref: "Headline"
    }
});

var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;