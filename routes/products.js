const router = require("express").Router();
const product = require("../gui-projekt-uge-26-27-gruppe-6/models/products");

// Her kan man poste/oprette sæder med den her metode fra fx postman eller thunderclient.
router.post("/", (req, res) => {
  data = req.body;
  product
    .insertMany(data)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});
// read data /api/products
router.get("/", (req, res) => {
  product
    .find()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

// read specifik
router.get("/:id", (req, res) => {
  product
    .findById(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

// update data with id
router.put("/:id", (req, res) => {
  const id = req.params.id;

  product
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
router.delete("/:id", (req, res) => {
  const id = req.params.id;

  product
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
module.exports = router;
