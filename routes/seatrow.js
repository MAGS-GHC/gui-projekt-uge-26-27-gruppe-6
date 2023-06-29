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
  const id = req.params.id;

  seatrow.findByIdAndUpdate(id, req.body)
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

seatrowrouter.delete("/:id", (req, res) => {
  const id = req.params.id;

  seatrow.findByIdAndDelete(id)
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

module.exports = seatrowrouter;
