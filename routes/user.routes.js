const express = require("express");
//Middlewares
const { userValidator } = require("../middlewares/usersValidators.middleware");
const {
  protectSession,
  protectedAcount,
} = require("../middlewares/auth.middleware");
//Controllers
const {
  newUser,
  getProductsUser,
  updateProfileUser,
  deletedAcountUser,
  getAllOrdersUser,
  getOrderById,
  login,
} = require("../controllers/users.controllers");

const userRouter = express.Router();

//Define Endpoints

userRouter.post("/", userValidator, newUser);
userRouter.post("/login", login);

userRouter.use(protectSession);

userRouter.get("/me", getProductsUser);
userRouter.patch("/:id", protectedAcount, updateProfileUser);
userRouter.delete("/:id", protectedAcount, deletedAcountUser);
userRouter.get("/orders", getAllOrdersUser);
userRouter.get("/orders/:id", getOrderById);

module.exports = { userRouter };
