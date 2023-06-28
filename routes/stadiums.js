const stadiumrouter = require("express").Router();
const stadium = require("../gui-projekt-uge-26-27-gruppe-6/models/stadium");

// post data
stadiumrouter.post("/", (req, res) => {
  data = req.body;
  stadium
    .insertMany(data)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

// read data /api/products
stadiumrouter.get("/", (req, res) => {
  stadium
    .find()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

// read specifik med id
stadiumrouter.get("/:id", (req, res) => {
  stadium
    .findById(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

// update data with id
stadiumrouter.put("/:id", (req, res) => {
  const id = req.params.id;

  stadium
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

// delete data
stadiumrouter.delete("/:id", (req, res) => {
  const id = req.params.id;

  stadium
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

module.exports = stadiumrouter;
