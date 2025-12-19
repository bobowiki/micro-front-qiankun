const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Resource = require("./resource");

const Page = sequelize.define(
  "Page",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    path: { type: DataTypes.STRING, allowNull: false },
    resourceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Resource,
        key: "id",
      },
      onUpdate: "CASCADE",
    },
  },
  {
    tableName: "page",
    timestamps: true,
  }
);

module.exports = Page;
