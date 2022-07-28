const { body } = require("express-validator");

//Middleware
const { checkResult } = require("../middlewares/checkResult.middleware");

const productValidator = [
  body("title").notEmpty().withMessage("title it cant be empty"),
  body("description").notEmpty().withMessage("description it cant be empty"),
  body("price")
    .notEmpty()
    .withMessage("price it cant be empty")
    .isNumeric("price must be numeric"),
  body("categoryId")
    .notEmpty()
    .withMessage("category  it cant be empty")
    .isNumeric("categoryId must be numeric"),
  body("quantity")
    .notEmpty()
    .withMessage("quantity  it cant be empty")
    .isNumeric("quantity must be numeric"),
  checkResult,
];

module.exports = { productValidator };
