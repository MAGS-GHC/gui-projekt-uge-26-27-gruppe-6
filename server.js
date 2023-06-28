// en masse dependencies
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
require("dotenv-flow").config();

app.use(bodyParser.json());

const PORT = process.env.PORT || 4000;

// her kommer ind i routes
const productRoutes = require("./routes/products");
const seatsRoutes = require("./routes/seats");
const sectionsRoutes = require("./routes/sections");
const stadiumRoutes = require("./routes/stadium");

// kommer "message: welcome to the jungle" når man kommer ind på api/welocme
app.get("/api/welcome",(req,res) => {    
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
mongoose.connection.once("open",()=> console.log('hejmeddig'))

// her får vi brugt al de data vi har i de andre filer og laver api endpoints
// for at oprette flere, spørg kasper :D :D :D :D 
app.use("/api/products", productRoutes);
app.use("/api/seats", seatsRoutes);
app.use("/api/sections", sectionsRoutes);
app.use("/api/stadium", stadiumRoutes);
 




// holder altid øje med serveren 
app.listen(PORT, function() {
    console.log("server is running "+ PORT)
})
module.exports = app;       