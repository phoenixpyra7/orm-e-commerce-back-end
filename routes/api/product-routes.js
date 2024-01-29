const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products // product declared but not defined? need fix
// find all products
// be sure to include its associated Category and Tag data
router.get('/', async (req, res) => {
  const products = await Product.findAll().catch((err) => {
    res.status(500).json({
      message: 'Error finding products',
      error: err,
      include: [Tag],
    });
  }).then((products) => {
    products.forEach((product) => {
    product.getTags().then((tags) => {
    product.tags = tags;
  });
  res.json(products);
  });
    
  })  
  
});

// get one product
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
router.get('/:id', async (req, res) => {
  const product = await Product.findByPk(req.params.id).catch((err) => {
    res.status(500).json({
      message: 'Error finding product',
      error: err,
      include: [Tag],
    });
  })
    .then((product) => {
      product.getTags().then((tags) => {
        product.tags = tags;
      });
      res.json(product);
    })
});

// create new product
router.post('/', async (req, res) => {
  req.body.price = req.body.price * 100
  {
    Product.create(req.body)
      .then((product) => {
        // if there's product tags, we need to create pairings to bulk create
        if (req.body.tagIds.length) {
          const productTagIdArr = req.body.tagIds.map((tag_id) => {
            return {
              product_id: product.id,
              tag_id,
            };
          });
          return ProductTag.bulkCreate(productTagIdArr);
        }
        // if no product tags, just respond
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
// delete one product by its `id` value -- i am guessing i need to match product to the schema to define it?
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
