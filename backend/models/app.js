const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const App = sequelize.define(
  "App",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    desc: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
  },
  {
    tableName: "app",
    timestamps: true,
  }
);

module.exports = App;
