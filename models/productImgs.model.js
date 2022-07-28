//utils
const { db, DataTypes } = require("../utils/database");

const ProductImgs = db.define("prosuctImg", {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
    unique: true,
  },

  imgUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "active",
  },
});

module.exports = { ProductImgs };
