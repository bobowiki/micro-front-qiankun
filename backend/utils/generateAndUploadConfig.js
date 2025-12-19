const { App, Page, AppPages, Resource } = require("../models");
async function generateAndUploadConfig() {
  const apps = await App.findAll();
  const pages = await Page.findAll();
  const appPages = await AppPages.findAll();
  const resources = await Resource.findAll();

  // 组合好对应的信息，通过app关联页面维度
  const data = appPages.map((it) => {
    // 获取app信息
    const appInfo = apps.find((app) => app.id === it.appId);
    // 获取页面信息
    const pageInfo = pages.find((page) => page.id === it.pageId);
    // 获取资源信息
    const resourceInfo = resources.find((r) => r.id === pageInfo.resourceId);
    return {
      appCode: appInfo.code,
      appInfo,
      pageInfo,
      resourceInfo,
    };
  });

  // 根据resourceId进行分组
  const grouped = data.reduce((acc, item) => {
    const rid = item.resourceInfo && item.resourceInfo.id;
    if (!acc[rid]) {
      acc[rid] = [];
    }
    acc[rid].push(item);
    return acc;
  }, {});

  // 生成 qiankun 注册格式
  const result = Object.values(grouped).map((items) => {
    const first = items[0];
    const jsRaw = first.resourceInfo.jsFileUrl || "";
    const cssRaw = first.resourceInfo.cssFileUrl || "";
    // 拆分可能为逗号分隔的多个 js 地址，并做简单规范化（缺协议时使用 protocol-relative // 前缀）
    const scripts = jsRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => (s.startsWith("http") || s.startsWith("//") ? s : `//${s}`));

    const styles = cssRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => (s.startsWith("http") || s.startsWith("//") ? s : `//${s}`));

    // 去重并生成激活规则：/ + appCode + path（保证 path 以 / 开头）
    const activeRuleSet = new Set(
      items.map((it) => {
        const p = it.pageInfo.path || "";
        const path = p.startsWith("/") ? p : `/${p}`;
        return `/${it.appCode}${path}`;
      })
    );

    return {
      name: first.resourceInfo.name,
      entry: {
        scripts,
        styles,
        // html: `<div id="appsub"></div>`,
      },
      //   container: "#subApp-viewport",
      activeRule: Array.from(activeRuleSet),
    };
  });

  return result;
}

module.exports = { generateAndUploadConfig };
