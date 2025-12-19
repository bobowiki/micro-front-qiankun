const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Resource = sequelize.define(
  "Resource",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    mark: { type: DataTypes.STRING, allowNull: false },
    version: { type: DataTypes.STRING, allowNull: false },
    jsFileUrl: { type: DataTypes.STRING, allowNull: false },
    cssFileUrl: { type: DataTypes.STRING, allowNull: true },
  },
  {
    tableName: "resource",
    timestamps: true,
  }
);

module.exports = Resource;
