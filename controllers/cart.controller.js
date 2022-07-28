//Utils
const { AppError } = require("../utils/AppError");
const { catchAsync } = require("../utils/catchAsync");
const { Email } = require("../utils/email.util");

//Models
const { Cart } = require("../models/carts.model");
const { Category } = require("../models/category.model");
const { Orders } = require("../models/orders.model");
const { ProductImgs } = require("../models/productImgs.model");
const { Products } = require("../models/products.model");
const { ProductsInCart } = require("../models/productsInCarts.model");
const { Users } = require("../models/users.model");

const addProductUser = catchAsync(async (req, res, next) => {
  const { productId, quantity } = req.body;
  const { userSession, product } = req;

  //we are looking for a cart
  let cartUser = await Cart.findOne({
    where: { userId: userSession.id, status: "active" },
  });

  if (!cartUser) {
    cartUser = await Cart.create({ userId: userSession.id });
  }

  //Product Exist in Cart
  const productInCart = await ProductsInCart.findOne({
    where: { productId: product.id, cartId: cartUser.id },
  });

  if (!productInCart) {
    const newProductInCart = await ProductsInCart.create({
      cartId: cartUser.id,
      productId,
      quantity,
    });

    res.status(201).json({ status: "added product", newProductInCart });
  } else if (productInCart.status === "active") {
    return next(
      new AppError("the product has already been added to the cart", 400)
    );
  } else if (productInCart.status === "removed") {
    await productInCart.update({ quantity, status: "active" });

    res.status(204).json({ status: "succes" });
  }
});

const getAllProduct = catchAsync(async (req, res, next) => {
  //   const { id } = req.params;
  const cart = ProductsInCart.findAll();
  res.status(201).json({ status: "succes", cart });
});
const updateCart = catchAsync(async (req, res, next) => {
  const { newQty } = req.body;
  const { userSession, product } = req;

  const cartUser = await Cart.findOne({
    where: { userId: userSession.id, status: "active" },
  });
  if (!cartUser) {
    return next(new AppError("the cart not exist", 400));
  }

  const productInCart = await ProductsInCart.findOne({
    where: { productId: product.id, cartId: cartUser.id },
  });

  if (newQty === 0) {
    await productInCart.update({ status: "removed" });
  }
  if (productInCart.status === "removed") {
    await productInCart.update({ quantity: newQty, status: "active" });
  }
  if (productInCart.status === "active") {
    await productInCart.update({ quantity: newQty });
  }
  res.status(204).json({ status: "success!" });
});

const deleteCart = catchAsync(async (req, res, next) => {
  const { productId } = req.params;

  const deletedProduct = await ProductsInCart.findOne({ where: { productId } });

  if (!deletedProduct) {
    return next(new AppError("the product does not exist in your cart", 400));
  }

  await deletedProduct.update({ quantity: 0, status: "removed" });
  res.status(204).json({ status: "success!" });
});

const newPurchase = catchAsync(async (req, res, next) => {
  const { userSession } = req;
  //search cart
  const cartPurchase = await Cart.findOne({
    where: { userId: userSession.id, status: "active" },
    include: { model: ProductsInCart, where: { status: "active" } },
  });
  if (!cartPurchase) {
    return next(new AppError("the purchase has already been made", 400));
  }

  //Subtract quantities to products
  const productsInCart = await ProductsInCart.findAll({
    where: { cartId: cartPurchase.id },
  });
  let totalPrice = 0;
  let products = [];
  await Promise.all(
    productsInCart.map(async (product) => {
      const subProduct = await Products.findOne({
        where: { id: product.productId },
      });

      const totalquantity = subProduct.quantity - product.quantity;

      await subProduct.update({ quantity: totalquantity });

      const totalpriceProduct = product.quantity * subProduct.price;

      totalPrice = totalPrice + totalpriceProduct;

      const productPurc = {};
      productPurc.title = subProduct.title;
      productPurc.quantity = product.quantity;
      productPurc.price = subProduct.price;

      products.push(productPurc);

      await product.update({ status: "purchased" });
    })
  );
  await cartPurchase.update({ status: "purchased" });

  const newOrder = await Orders.create({
    userId: userSession.id,
    cartId: cartPurchase.id,
    totalPrice,
  });

  // Send emal
  new Email(userSession.email).sendPurchase(
    userSession.userName,
    products,
    totalPrice
  );
  res.status(201).json({
    status: "purchases success!",
    newOrder,
  });
});

module.exports = {
  addProductUser,
  updateCart,
  deleteCart,
  newPurchase,
  getAllProduct,
};
