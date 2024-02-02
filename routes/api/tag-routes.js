const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint


 // find all tags be sure to include its associated Product data
router.get('/', async (req, res) => {
  Tag.findAll({include: [{model: Product,through: ProductTag}]}) 
  .then(tags => {
    res.status(200).json(tags) 
  })
  .catch(err => {
    res.status(500).json({
      message: 'Error finding tags',
      error: err,
    });
  })
});


  // find a single tag by its `id` be sure to include its associated Product data
router.get('/:id', async (req, res) => {
  Tag.findOne({ where: {id: req.params.id},include: [{model:Product, through: ProductTag}]}) // double check if this is right
  .then(tags => {
    res.status(200).json(tags)
    res.json(tags) 
  })
  .catch(err => {
    res.status(500).json({
      message: 'Error finding tag',
      error: err,
    });
  })
});


  // This is to create a new tag
router.post('/', async (req, res) => {
  Tag.create(req.body)
    .then((tag) => {
      res.status(200).json(tag);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});


 // This is to update a tag's name by its `id` value
router.put('/:id', async (req, res) => {
 Tag.update(req.body, {
    where: {
    id: req.params.id
   }
 })
    .then((tag) => {
      res.status(200).json(tag);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    })
});


 // This is to delete on tag by its `id` value
router.delete('/:id', async (req, res) => {
 Tag.destroy({
   where: {
     id: req.params.id
   }  
 })
   .then((tag) => {
     res.status(200).json(tag);
   })
   .catch((err) => {
     console.log(err);
     res.status(400).json(err);
   })
});


module.exports = router;
