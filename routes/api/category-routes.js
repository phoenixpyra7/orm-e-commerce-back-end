const router = require("express").Router();
const { Category, Product } = require("../../models");

// The `/api/categories` endpoint

// find all categories be sure to include its associated Products
router.get("/", async (req, res) => {
  Category.findAll({ include: [Product] })
    .then((categories) => {
      res.json(categories);
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error finding categories",
        error: err,
      });
    });
});



// find one category by its `id` value be sure to include its associated Products
router.get("/:id", async (req, res) => {
  Category.findOne(req.params.id, { include: [Product] })
    .then((category) => {
      res.json(category);
    })
    .catch((err) => {
      res.status(400).json({
        message: "Error finding category",
        error: err,
      });
    });
});


// create a new category
router.post("/", async (req, res) => {
  Category.create(req.body)
    .then((category) => {
      res.status(200).json(category);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});




// update a category by its `id` value
router.put("/:id", async (req, res) => {
  Category.update(
    req.body,
    {
      where: {
        id: req.params.id,
      },
    }
      .then((category) => {
        res.status(200).json(category);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      })
  );
});



// delete a category by its `id` value
router.delete("/:id", async (req, res) => {
  Category.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((category) => {
      res.status(200).json(category);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});


module.exports = router;
