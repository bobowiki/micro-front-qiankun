const { Page } = require("../models");

async function createPage(data) {
  const page = await Page.create(data);
  return page;
}

async function getPages(query) {
  const pages = await Page.findAll({ where: query });
  return pages;
}

module.exports = { createPage, getPages };
