const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let sectionSchema = new Schema({
  _id: { type: Number },
  name: { type: String },
  capacity: { type: Number },
  available: { type: Boolean },
  standing: { type: Boolean },
  venueID: { type: Number },
});

module.exports = mongoose.model("section", sectionSchema);
