//Models
const { Products } = require("../models/products.model");
const { Category } = require("../models/category.model");
const { ProductImgs } = require("../models/productImgs.model");

//Utils
const { AppError } = require("../utils/AppError");
const { catchAsync } = require("../utils/catchAsync");

const productExist = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const product = await Products.findOne({
    where: { status: "active", id },
    include: { model: Category, attributes: ["name"] },
    include: { model: ProductImgs, attributes: ["imgUrl"] },
  });

  if (!product) {
    return next(new AppError("The product not exist!", 400));
  }

  req.product = product;

  next();
});

const categoryExist = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const category = await Category.findOne({ where: { id } });

  if (!category) {
    return next(new AppError("Category not exist!!", 400));
  }

  req.category = category;
  next();
});

const isYourProduct = catchAsync(async (req, res, next) => {
  const { product, userSession } = req;

  if (product.userId != userSession.id) {
    return next(new AppError("you cannot modify this product", 400));
  }

  next();
});
module.exports = { productExist, categoryExist, isYourProduct };
