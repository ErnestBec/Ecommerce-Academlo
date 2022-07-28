const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

//Utils
const { AppError } = require("../utils/AppError");
const { catchAsync } = require("../utils/catchAsync");
//Models
const { Users } = require("../models/users.model");

const protectSession = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("Invalid token", 403));
  }

  const decode = jwt.verify(token, process.env.JWT_SECRET);

  //User Session
  const userSession = await Users.findOne({
    where: { id: decode.id, status: "active" },
  });

  if (!userSession) {
    return next(
      new AppError("The owner of this token doesnt exist anymore", 403)
    );
  }

  req.userSession = userSession;

  next();
});

const protectedAcount = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { userSession } = req;

  if (userSession.id != id) {
    return next(new AppError("Can you only modify your account"), 403);
  }
  next();
});

module.exports = { protectSession, protectedAcount };
