const appService = require("../services/app");
const { generateAndUploadConfig } = require("../utils/generateAndUploadConfig");

async function config(ctx) {
  const data = await generateAndUploadConfig();
  ctx.body = { success: true, data };
}
async function createApp(ctx) {
  const data = ctx.request.body;
  const app = await appService.createApp(data);
  ctx.status = 201;
  ctx.body = { success: true, data: app };
}

async function getAppList(ctx) {
  const data = ctx.request.body;
  const apps = await appService.getApps(data);
  ctx.body = { success: true, data: apps };
}

async function getAppDetail(ctx) {
  const query = ctx.request.query;
  const app = await appService.getAppDetail(query);
  ctx.body = { success: true, data: app };
}

module.exports = { createApp, getAppList, getAppDetail, config };
