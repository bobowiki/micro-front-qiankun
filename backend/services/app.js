const { App, Page } = require("../models");

async function createApp(data) {
  const app = await App.create(data);
  return app;
}

async function getApps(data) {
  const { page = 1, pageSize = 10, ...query } = data;
  const apps = await App.findAndCountAll({
    where: {
      ...query,
    },
    limit: data.pageSize,
    offset: (data.page - 1) * data.pageSize,
  });
  return apps;
}

async function getAppDetail(query) {
  const appPage = await App.findOne({
    where: { ...query },
    include: [
      {
        model: Page,
        as: "pages", // 注意必须和 belongsToMany 的 as 一致
        attributes: [
          "id",
          "name",
          "path",
          "resourceId",
          "createdAt",
          "updatedAt",
        ],
        through: {
          attributes: [["createdAt", "bindingCreatedAt"]],
        }, // 可选：取中间表字段
      },
    ],
  });
  return appPage;
}

module.exports = { createApp, getApps, getAppDetail };
