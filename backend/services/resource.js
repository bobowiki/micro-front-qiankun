const { Resource } = require("../models");

async function createResource(data) {
  const resource = await Resource.create(data);
  return resource;
}

async function getResources(query) {
  const resources = await Resource.findAll({ where: query });
  return resources;
}

module.exports = { createResource, getResources };
