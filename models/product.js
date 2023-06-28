const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// PRODUKT SKEMA ER EN TEST, DEM VI SKAL BRUGE ER SEATS, SECTION OG STADIUM INDTIL VIDERE.
// definering af hvordan datasættet skal være, 
// hvis i har behov for at ændre det, er i velkommen

let ProductSchema = new Schema(
    {
        name: {type: String},
        description: {type: String},
        price: {type: Number},
        inStock: {type: Boolean}
    }
);


module.exports = mongoose.model("product",ProductSchema);



