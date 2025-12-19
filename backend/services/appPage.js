const { AppPages, Page, App } = require("../models");

async function createAppPage(data) {
  const appPage = await AppPages.create(data);
  return appPage;
}

async function getAppPages(query) {
  const appPages = await AppPages.findAll({ where: query });
  return appPages;
}

module.exports = { createAppPage, getAppPages };
