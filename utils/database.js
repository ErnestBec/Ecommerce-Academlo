const { Sequelize, DataTypes } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const db = new Sequelize({
  dialect: "postgres",
  username: process.env.USER_DB,
  host: process.env.HOST_DB,
  password: process.env.PASSWORD_DB,
  port: process.env.PORT_DB,
  database: process.env.DB,
  logging: false,
  dialectOptions:
    process.env.NODE_ENV === "production"
      ? {
          ssl: {
            required: true,
            rejectUnauthorized: false,
          },
        }
      : {},
});

module.exports = { db, DataTypes };
