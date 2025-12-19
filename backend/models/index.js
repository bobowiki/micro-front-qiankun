const App = require("./app");
const Page = require("./page");
const AppPages = require("./appPage");
const Resource = require("./resource");

App.belongsToMany(Page, {
  through: AppPages,
  foreignKey: "appId",
  otherKey: "pageId",
  as: "pages",
});

Page.belongsToMany(App, {
  through: AppPages,
  foreignKey: "pageId",
  otherKey: "appId",
  as: "apps",
});

module.exports = { App, Page, AppPages, Resource };
