const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let sectionSchema = new Schema(
    {
        id:         {type: Number}, 
        letter:     {type: String},
        capacity:   {type: Number},
        available:  {type: Boolean},
        standing:   {type: Boolean},
        stadiumID:  {type: Number},
    }
);

module.exports = mongoose.model("section", sectionSchema);
