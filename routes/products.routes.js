const express = require("express");
//Middlewares
const {
  protectSession,
  protectedAcount,
} = require("../middlewares/auth.middleware");
//Utils
const { upload } = require("../utils/upload.utils");
const {
  productValidator,
} = require("../middlewares/productsValidator.middleware");
const {
  productExist,
  isYourProduct,
  categoryExist,
} = require("../middlewares/product.middlewares");
//Controllers
const {
  newProduct,
  getAvailableProducts,
  getProductById,
  updateCategory,
  deleteProduct,
  updateProduct,
  getAllCategoriesActives,
  newCategory,
} = require("../controllers/products.controller");

const productsRouter = express.Router();

//Define Endpoints
productsRouter.get("/", getAvailableProducts);
productsRouter.get("/categories", getAllCategoriesActives);
productsRouter.get("/:id", productExist, getProductById);

productsRouter.use(protectSession);

productsRouter.post("/", upload.array("img", 5), newProduct);
productsRouter.post("/categories", newCategory);
productsRouter.patch("/:id", productExist, isYourProduct, updateProduct);
productsRouter.delete("/:id", productExist, isYourProduct, deleteProduct);
productsRouter.patch("/categories/:id", categoryExist, updateCategory);

module.exports = { productsRouter };
