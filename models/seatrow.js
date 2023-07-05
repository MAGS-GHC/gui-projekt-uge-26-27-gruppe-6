const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let seatrowSchema = new Schema({
  _id: { type: Number },
  sectionID: { type: Number },
  rownumber: { type: Number },
});

module.exports = mongoose.model("seatrow", seatrowSchema);
