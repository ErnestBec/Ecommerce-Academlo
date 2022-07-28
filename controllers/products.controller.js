const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");
//Utils
const { AppError } = require("../utils/AppError");
const { catchAsync } = require("../utils/catchAsync");
const { storage } = require("../utils/firebase.util");

//Models
const { Cart } = require("../models/carts.model");
const { Category } = require("../models/category.model");
const { Orders } = require("../models/orders.model");
const { ProductImgs } = require("../models/productImgs.model");
const { Products } = require("../models/products.model");
const { ProductsInCart } = require("../models/productsInCarts.model");
const { Users } = require("../models/users.model");

const newProduct = catchAsync(async (req, res, next) => {
  const { userSession } = req;
  const { title, description, price, categoryId, quantity } = req.body;

  const newProduct = await Products.create({
    title,
    description,
    price,
    categoryId,
    quantity,
    userId: userSession.id,
  });

  if (req.files.length > 0) {
    const filesPromises = req.files.map(async (file) => {
      const imgRef = ref(
        storage,
        `imgProducts/${Date.now()}_${file.originalname}`
      );
      const imgRes = await uploadBytes(imgRef, file.buffer);
      return await ProductImgs.create({
        imgUrl: imgRes.metadata.fullPath,
        productId: newProduct.id,
      });
    });
    await Promise.all(filesPromises);
  }

  res.status(201).json({
    status: "Succes!!",
    newProduct,
  });
});
const getAvailableProducts = catchAsync(async (req, res, next) => {
  const products = await Products.findAll({
    where: { status: "active" },
    include: { model: Users, attributes: ["userName"] },
    include: { model: ProductImgs, attributes: ["imgUrl"] },
  });
  if (!products) {
    return next(new AppError("there are no products at this time", 400));
  }
  res.status(201).json({
    status: "Succes!!",
    products,
  });
});
const getProductById = catchAsync(async (req, res, next) => {
  const { product } = req;

  const productImgsPromises = product.prosuctImgs.map(async (productImg) => {
    const imgRef = ref(storage, productImg.imgUrl);

    const imgFullPath = await getDownloadURL(imgRef);

    productImg.imgUrl = imgFullPath;
  });

  await Promise.all(productImgsPromises);

  res.status(201).json({
    status: "Succes!!",
    product,
  });
});
const updateProduct = catchAsync(async (req, res, next) => {
  const { product } = req;
  const { title, description, price, quantity } = req.body;

  await product.update({ title, description, price, quantity });

  res.status(204).json({
    status: "Succes!!",
  });
});
const deleteProduct = catchAsync(async (req, res, next) => {
  const { product } = req;

  await product.update({ status: "deleted" });

  res.status(204).json({
    status: "Succes!!",
  });
});

const getAllCategoriesActives = catchAsync(async (req, res, next) => {
  const categories = await Category.findAll({
    where: { status: "active" },
  });

  if (!categories) {
    return next(new AppError("Category not exist", 400));
  }
  res.status(201).json({
    status: "Succes!!",
    categories,
  });
});

const newCategory = catchAsync(async (req, res, next) => {
  const { name } = req.body;

  const newCategory = await Category.create({ name });

  res.status(201).json({
    status: "success!",
    newCategory,
  });
});

const updateCategory = catchAsync(async (req, res, next) => {
  const { category } = req;
  const { name } = req.body;

  await category.update({ name });

  res.status(204).json({
    status: "success!",
  });
});

module.exports = {
  newProduct,
  getAvailableProducts,
  getProductById,
  updateCategory,
  deleteProduct,
  updateProduct,
  getAllCategoriesActives,
  newCategory,
};
