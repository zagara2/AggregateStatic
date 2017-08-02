var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var linkSchema = new Schema({
  rating: {type: Number, min:0, max:10},
  url: {type: String, required:true},
  addedBy: {type: String},
  linkType: {type: String},
   title: {
    type: String,
    trim: true
  },
  boardID: {type: Schema.Types.ObjectId}
});

var Link = mongoose.model("Link", linkSchema);
module.exports = Link;