const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

//Utils
const { AppError } = require("../utils/AppError");
const { catchAsync } = require("../utils/catchAsync");
const { Email } = require("../utils/email.util");

//Models
const { Cart } = require("../models/carts.model");
const { Orders } = require("../models/orders.model");
const { ProductImgs } = require("../models/productImgs.model");
const { Products } = require("../models/products.model");
const { ProductsInCart } = require("../models/productsInCarts.model");
const { Users } = require("../models/users.model");
const { Category } = require("../models/category.model");

const newUser = catchAsync(async (req, res, next) => {
  const { userName, email, password, role } = req.body;

  const salt = await bcryptjs.genSalt(12);
  const hasPassword = await bcryptjs.hash(password, salt);

  const user = await Users.create({
    userName,
    email,
    password: hasPassword,
    role,
  });

  user.password = undefined;

  //Send welcome email
  await new Email(email).sendWelcome(userName);

  res.status(201).json({
    status: "created success!!",
    user,
  });
});

const getProductsUser = catchAsync(async (req, res, next) => {
  const { userSession } = req;

  const products = await Products.findAll({
    where: { userId: userSession.id },
    include: { model: Users, attributes: ["userName"] },
    include: { model: Category, attributes: ["name"] },
  });

  res.status(200).json({
    status: "Succes!!",
    products,
  });
});

const updateProfileUser = catchAsync(async (req, res, next) => {
  const { userSession } = req;
  const { userName, email } = req.body;

  await userSession.update({ userName, email });

  res.status(204).json({
    status: "success!",
  });
});

const deletedAcountUser = catchAsync(async (req, res, next) => {
  const { userSession } = req;

  await userSession.update({ status: "deleted" });

  res.status(204).json({
    status: "success!",
  });
});

const getAllOrdersUser = catchAsync(async (req, res, next) => {
  const { userSession } = req;

  const orders = await Orders.findAll({
    where: { userId: userSession.id, status: "purchased" },
    include: { model: Cart },
  });

  res.status(200).json({
    status: "Success",
    orders,
  });
});

const getOrderById = catchAsync(async (req, res, next) => {
  const { userSession } = req;
  const { id } = req.params;

  const order = await Orders.findOne({
    where: { id, userId: userSession.id, status: "purchased" },
    include: { model: Cart },
  });

  if (!order) {
    return next(new AppError("order not exist", 400));
  }

  res.status(200).json({
    status: "Success",
    order,
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await Users.findOne({ where: { email, status: "active" } });

  if (!user) {
    return next(new AppError("Credentials Invalid", 400));
  }

  const decodePassword = await bcryptjs.compare(password, user.password);

  if (!decodePassword) {
    return next(new AppError("credentials Invalid"), 400);
  }

  //Generate JWT
  const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "5d",
  });

  res.status(201).json({
    status: "Success!",
    token,
  });
});

module.exports = {
  newUser,
  getProductsUser,
  updateProfileUser,
  deletedAcountUser,
  getAllOrdersUser,
  getOrderById,
  login,
};
