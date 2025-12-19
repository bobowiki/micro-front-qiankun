const pageService = require("../services/page");

async function createPage(ctx) {
  const data = ctx.request.body;
  const page = await pageService.createPage(data);
  ctx.status = 201;
  ctx.body = { success: true, data: page };
}

async function getPageList(ctx) {
  const query = ctx.request.query;
  const pages = await pageService.getPages(query);
  ctx.body = { success: true, data: pages };
}

module.exports = { createPage, getPageList };
