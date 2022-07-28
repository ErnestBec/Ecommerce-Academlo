//Models
const { Cart } = require("./carts.model");
const { Category } = require("./category.model");
const { Orders } = require("./orders.model");
const { ProductImgs } = require("./productImgs.model");
const { Products } = require("./products.model");
const { ProductsInCart } = require("./productsInCarts.model");
const { Users } = require("./users.model");

//Relations
const initModels = () => {
  // 1 User <--> M Product
  Users.hasMany(Products);
  Products.belongsTo(Users);

  // 1 User <--> M Order
  Users.hasMany(Orders);
  Orders.belongsTo(Users);

  // 1 User <--> 1 Cart
  Users.hasOne(Cart);
  Cart.belongsTo(Users);

  // 1 Product <--> M ProductImg
  Products.hasMany(ProductImgs);
  ProductImgs.belongsTo(Products);

  // 1 Category <--> 1 Product
  Category.hasOne(Products);
  Products.belongsTo(Category);

  // 1 Cart <--> M ProductInCart
  Cart.hasMany(ProductsInCart);
  ProductsInCart.belongsTo(Cart);

  // 1 Product <--> 1 ProductInCart
  Products.hasOne(ProductsInCart);
  ProductsInCart.belongsTo(Products);

  // 1 Order <--> 1 Cart
  Cart.hasOne(Orders);
  Orders.belongsTo(Cart);
};

module.exports = { initModels };
