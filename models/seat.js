const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let seatSchema = new Schema(
    {
        id:         {type: Number, unique: true},
        seatrowID:  {type: Number},
        reserved:   {type: Boolean},
        booked:     {type: Boolean},
        seatnumber: {type: Number}
    }
);

module.exports = mongoose.model("seat",seatSchema);