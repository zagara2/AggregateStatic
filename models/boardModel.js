var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var boardSchema = new Schema({

 boardname: {
    type: String,
    trim: true
  },

  description: {

    type: String

  },

  owner: {
    type: String

  },

  imageLink: {
    type: String
  },

  dataSourceIDs: [{
    type: Schema.Types.ObjectId

  }]

});

var Board = mongoose.model("Board", boardSchema);
module.exports = Board;