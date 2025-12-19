const appRoutes = require("./routes/app");
const resourceRoutes = require("./routes/resource");
const pageRoutes = require("./routes/page");
const appPageRoutes = require("./routes/appPage");
const bodyParser = require("koa-bodyparser");
const sequelize = require("./config/db");
const errorHandle = require("./middlewares/errorHandle");
const Koa = require("koa");

const app = new Koa();

app.use(errorHandle);
app.use(async (ctx, next) => {
  ctx.set("Access-Control-Allow-Origin", "*"); // 允许所有域名访问
  ctx.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  ctx.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (ctx.method === "OPTIONS") {
    ctx.status = 204; // 对预检请求直接返回
  } else {
    await next();
  }
});
app.use(bodyParser()); // ✅ 必须加
app.use(appRoutes.routes()).use(appRoutes.allowedMethods());
app.use(resourceRoutes.routes()).use(resourceRoutes.allowedMethods());
app.use(pageRoutes.routes()).use(pageRoutes.allowedMethods());
app.use(appPageRoutes.routes()).use(appPageRoutes.allowedMethods());

(async () => {
  try {
    await sequelize.sync({ alter: true }); // alter: true 比 force: true 更安全s
    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  } catch (err) {
    console.error("Database sync failed:", err);
  }
})();
