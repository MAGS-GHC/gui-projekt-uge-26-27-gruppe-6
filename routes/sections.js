const sectionrouter = require("express").Router();
const section = require("../gui-projekt-uge-26-27-gruppe-6/models/section");

// post data
sectionrouter.post("/", (req, res) => {
  data = req.body;

  section
    .insertMany(data)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

// read data /api/products
sectionrouter.get("/", (req, res) => {
  section
    .find()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

// read specifik med id
sectionrouter.get("/:id", (req, res) => {
  section
    .findById(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

// update data with id
sectionrouter.put("/:id", (req, res) => {
  const id = req.params.id;

  section
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
      res.status(500).send({ message: "cannot find  " + id });
    });
});

// delete data
sectionrouter.delete("/:id", (req, res) => {
  const id = req.params.id;

  section
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
module.exports = sectionrouter;
