const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let venueSchema = new Schema(
    {
        _id:         {type: Number}, 
        town:     {type: String},
        capacity:   {type: Number}
    }
);

module.exports = mongoose.model("venue", venueSchema);