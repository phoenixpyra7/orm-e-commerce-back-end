// imported models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// Products belongsTo Category
Prodeuct.belongsTo(Category, {
  
})

// Categories have many Products
Category.hasMany(Product, {
  
})


// Products belongToMany Tags (through ProductTag)
Product.belongsToMany(Tag, {
  
})




// Tags belongToMany Products (through ProductTag)
Tag.belongToMany(Product, {
  
})




module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
