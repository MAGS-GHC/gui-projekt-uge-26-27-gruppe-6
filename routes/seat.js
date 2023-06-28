const seatrouter = require("express").Router();
const seat = require("../models/seat");

// Her kan man poste/oprette sæder med den her metode fra fx postman eller thunderclient.
// det gør du ved at udfyld den her i body afdelingen i postman eller thunderclient
//  id:         {type: Number},
//  sectionID:    {type: Number},
//  reservet:   {type: Boolean},
//  booked:     {type: Boolean},
//  seatnumber: {type: Number}
// eller har fundet en mode at oprette med loops fx.
seatrouter.post("/", (req, res) => {
  // data er den som man indtaster fra request.body
  data = req.body;
  seat
    .insertMany(data)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});
// Indlæser data på siden  localhost:4000/api/seat eller localhost:4000/api/sections
//
seatrouter.get("/", (req, res) => {
  seat
    .find()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

// Indlæser data ved at bruge seat.findById(req.params.id) hvor /req.params.id) er object.id i Mongodb
// under Database --> Browse collection --> seat/section ved hjælp af
seatrouter.get("/:id", (req, res) => {
  seat
    .findById(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

//Opdatere allerede eksisterende data ved brug PUT i fx postman eller thunderclient og udflyder den samme som før men med PUT i stedet for POST
// const id = req.params.id er indtastet til sidst i URL'en fx. localhost:4000/api/seat/fnwdigom2ie913990qgmf
// den finder du ved at bruge get command på localhost:4000/api/seat/
seatrouter.put("/:id", (req, res) => {
  const id = req.params.id;

  seat
    .findByIdAndUpdate(id, req.body)
    .then((data) => {
      if (!data) {
        res
          .status(404)
          .send({ message: "cant update, maybe id is not there" + id });
      } else {
        res.send({ message: "update succesfull" });
      }
    })

    .catch((err) => {
      res.status(500).send({ message: "error updating with id " + id });
    });
});

// den her sletter routen eller seat ved hjælp af den førnævnte id
seatrouter.delete("/:id", (req, res) => {
  const id = req.params.id;

  seat
    .findByIdAndDelete(id)
    .then((data) => {
      if (!data) {
        res
          .status(404)
          .send({ message: "cant delete, maybe id is not there" + id });
      } else {
        res.send({ message: "delete succesfull" });
      }
    })

    .catch((err) => {
      res.status(500).send({ message: "cannot delete   " + id });
    });
});
// exporterer
module.exports = seatrouter;
