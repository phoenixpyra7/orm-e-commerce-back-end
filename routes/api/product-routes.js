const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products // product declared but not defined? need fix
// find all products
// be sure to include its associated Category and Tag data
router.get('/', async (req, res) => {
  Product.findAll({include: [Category,Tag]})
  .then(products => {
    res.json(products)
  })
  .catch(err => {
    res.status(500).json({
      message: 'Error finding products',
      error: err,
    });
  })
});

// get one product
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
router.get('/:id', async (req, res) => {
  Product.findByPk(req.params.id,{include: [Category, Tag]})
  .then(product => {
    res.json(product)
  })
  .catch(err => {
    res.status(500).json({
      message: "Error finding product",
      error: err,
    });
    })
  });

// create new product
router.post('/', async (req, res) => {
  req.body.price = req.body.price * 100
  {
    Product.create(req.body)
      .then((product) => {
        // This says if there are product tags, then we would need to create pairings to bulk create.
        if (req.body.tagIds.length) {
          const productTagIdArr = req.body.tagIds.map((tag_id) => {
            return {
              product_id: product.id,
              tag_id,
            };
          });
          return ProductTag.bulkCreate(productTagIdArr);
        }
        // This says if no product tags, just respond
        res.status(200).json(product);
      })
      .then((productTagIds) => res.status(200).json(productTagIds))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  }
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  try {
    const product = await Product.create(req.body);
    // if there's product tags, we need to create pairings by using the setTags method
    if (req.body.tagIds) {
      await product.setTags(req.body.tagIds);
      await product.save();
      return res.status(200).json(await product.getTags());
    }
    // if no product tags, just respond
    return res.status(200).json(product);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// update product
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, { 
      include: [Tag],
    });
    // update product data
    product.update(req.body);
    // if there's product tags, we need to create pairings by using the setTags method
    if (req.body.tagIds) {
      await product.setTags(req.body.tagIds);
    }
    await product.save();
    await product.reload();
    return  res.status(200).json(product);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});
// delete one product by its `id` value -- i am guessing i need to match product to the schema to define
router.delete('/:id', async (req, res) => {
    this.delete = await Product.destroy({
      where: {
        id: req.params.id
      }
    }).then((product) => {
      res.json({
        message: 'Product deleted',
    })
    })
});

module.exports = router;
