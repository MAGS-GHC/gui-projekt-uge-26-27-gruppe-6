const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let stadiumSchema = new Schema(
    {
        id:         {type: Number}, 
        town:     {type: String},
        capacity:   {type: Number}
    }
);

module.exports = mongoose.model("stadium", stadiumSchema);