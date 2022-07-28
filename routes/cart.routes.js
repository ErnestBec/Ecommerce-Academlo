const express = require("express");
//Controllers
const {
  addProductUser,
  updateCart,
  deleteCart,
  newPurchase,
  getAllProduct,
} = require("../controllers/cart.controller");

//Middlewares
const { validateQuantityProduct } = require("../middlewares/cart.middleware");
const { protectSession } = require("../middlewares/auth.middleware");

const cartRouter = express.Router();

//Define Endpoints

cartRouter.use(protectSession);
cartRouter.post("/add-product", validateQuantityProduct, addProductUser);
cartRouter.get("/:id", getAllProduct);
cartRouter.patch("/update-cart", validateQuantityProduct, updateCart);
cartRouter.delete("/:productId", deleteCart);
cartRouter.post("/purchase", newPurchase);

module.exports = { cartRouter };
