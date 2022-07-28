const { body } = require("express-validator");

const { checkResult } = require("../middlewares/checkResult.middleware");

const userValidator = [
  body("userName").notEmpty().withMessage("username cannot be empty"),
  body("email")
    .isEmail()
    .withMessage("enter a valid email")
    .notEmpty()
    .withMessage("email cannot be empty"),
  body("password")
    .isAlphanumeric()
    .withMessage("the password must contain letters and numbers")
    .notEmpty()
    .withMessage("password cannot be empty")
    .isLength(8)
    .withMessage("the password must contain at least 8 characters"),
  body("role").custom((value) => {
    let role;
    if (value === "admin") {
      role = value;
      return true;
    } else if (value === "normal") {
      return true;
    }
    throw new Error("The role is invalid");
  }),
  checkResult,
];

module.exports = { userValidator };
