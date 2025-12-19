const appPageService = require("../services/appPage");

async function createAppPage(ctx) {
  const data = ctx.request.body;
  console.log(data, "data");
  const appPage = await appPageService.createAppPage(data);
  ctx.status = 201;
  ctx.body = { success: true, data: appPage };
}

async function getAppPageList(ctx) {
  const query = ctx.request.query;
  const appPages = await appPageService.getAppPages(query);
  ctx.body = { success: true, data: appPages };
}

async function getAppPageByAppId(ctx) {
  const data = ctx.request.body;
  const appPage = await appPageService.getPageByAppId(data);
  ctx.body = { success: true, data: appPage };
}

module.exports = { createAppPage, getAppPageList, getAppPageByAppId };
