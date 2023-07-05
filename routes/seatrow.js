const seatrowrouter = require("express").Router();
const seatrow = require("../models/seatrow");

seatrowrouter.post("/", (req, res) => {
  data = req.body;
  seatrow.insertMany(data)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

seatrowrouter.get("/", (req, res) => {
  seatrow.find()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

seatrowrouter.get("/:id", (req, res) => {
  seatrow.findById(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

seatrowrouter.put("/:id", (req, res) => {
  const _id = req.params.id;

  seatrow.findByIdAndUpdate(_id, req.body)
    .then((data) => {
      if (!data) {
        res
          .status(404)
          .send({ message: "cant update, maybe id is not there" + _id });
      } else {
        res.send({ message: "update succesfull" });
      }
    })

    .catch((err) => {
      res.status(500).send({ message: "error updating with id " + _id });
    });
});

seatrowrouter.delete("/:id", (req, res) => {
  const _id = req.params.id;

  seatrow.findByIdAndDelete(_id)
    .then((data) => {
      if (!data) {
        res
          .status(404)
          .send({ message: "cant delete, maybe id is not there" + _id });
      } else {
        res.send({ message: "delete succesfull" });
      }
    })

    .catch((err) => {
      res.status(500).send({ message: "cannot delete   " + _id });
    });
});

module.exports = seatrowrouter;
