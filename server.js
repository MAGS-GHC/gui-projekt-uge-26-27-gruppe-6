// en masse dependencies
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
require("dotenv-flow").config();

const cors = require('cors');
app.use(cors({
    origin: '*'
}));

app.use(bodyParser.json());

const PORT = process.env.PORT || 4000;

// her kommer ind i routes
const productRoutes = require("./routes/product");
const seatRoutes = require("./routes/seat");
const seatrowRoutes = require("./routes/seatrow");
const sectionRoutes = require("./routes/section");
const venueRoutes = require("./routes/venue");

// kommer "message: welcome to the jungle" når man kommer ind på api/welocme
app.get("/api/welcome",(req, res) => {    
    res.status(200).send({message: "Welcome to the jungle"})
});

// laver port connection
mongoose.connect(
    process.env.DBHOST,{
        useUnifiedTopology: true,
        useNewUrlParser:true,
    }
)
// catch error 
.catch(error=>console.log("error to db"+error));
mongoose.connection.once("open",()=> console.log('Success'))

// her får vi brugt al de data vi har i de andre filer og laver api endpoints
// for at oprette flere, spørg kasper :D :D :D :D 
app.use("/api/products", productRoutes);
app.use("/api/seats", seatRoutes);
app.use("/api/seatrows", seatrowRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/api/venue", venueRoutes);
 
// holder altid øje med serveren 
app.listen(PORT, function() {
    console.log("server is running " + PORT)
})
module.exports = app;       