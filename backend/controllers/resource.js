const resourceService = require("../services/resource");

async function createResource(ctx) {
  const data = ctx.request.body;
  const resource = await resourceService.createResource(data);
  ctx.status = 201;
  ctx.body = { success: true, data: resource };
}

async function getResourceList(ctx) {
  const query = ctx.request.query;
  const resources = await resourceService.getResources(query);
  ctx.body = { success: true, data: resources };
}

module.exports = { createResource, getResourceList };
