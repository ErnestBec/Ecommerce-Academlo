//Utils
const { AppError } = require("../utils/AppError");
const { catchAsync } = require("../utils/catchAsync");
//Models
const { Products } = require("../models/products.model");

const validateQuantityProduct = catchAsync(async (req, res, next) => {
  const { quantity, productId, newQty } = req.body;

  const product = await Products.findOne({ where: { id: productId } });

  if (!product) {
    return next(new AppError("product not exist", 400));
  }

  if (quantity != undefined) {
    if (quantity > product.quantity) {
      return next(new AppError("It is not possible to add that amount", 400));
    }
  }

  if (newQty != undefined) {
    if (newQty > product.quantity) {
      return next(new AppError("It is not possible to add that amount", 400));
    }
  }
  req.product = product;
  next();
});

module.exports = { validateQuantityProduct };
