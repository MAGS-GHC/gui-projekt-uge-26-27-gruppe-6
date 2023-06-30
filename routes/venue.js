const venuerouter = require("express").Router();
const venue = require("../models/venue");

// post data
venuerouter.post("/", (req, res) => {
  data = req.body;
  venue.insertMany(data)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

// read data /api/products
venuerouter.get("/", (req, res) => {
  venue.find()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

// read specifik med id
venuerouter.get("/:id", (req, res) => {
  venue.findById(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

// update data with id
venuerouter.put("/:id", (req, res) => {
  const id = req.params.id;

  venue.findByIdAndUpdate(id, req.body)
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

// delete data
venuerouter.delete("/:id", (req, res) => {
  const id = req.params.id;

  venue.findByIdAndDelete(id)
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

module.exports = venuerouter;
