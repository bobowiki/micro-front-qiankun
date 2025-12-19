const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const App = require("./app");
const Page = require("./page");

const AppPages = sequelize.define(
  "AppPage",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    appId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: App,
        key: "id",
      },
      onUpdate: "CASCADE",
    },
    pageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Page,
        key: "id",
      },
      onUpdate: "CASCADE",
    },
    boundBy: { type: DataTypes.STRING },
  },
  {
    tableName: "app_pages",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["appId", "pageId"], // 防止重复绑定
      },
    ],
  }
);

module.exports = AppPages;
