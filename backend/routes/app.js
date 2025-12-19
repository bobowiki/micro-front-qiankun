const Router = require("koa-router");
const appController = require("../controllers/app");

const router = new Router({ prefix: "/app" });

// 后续可以改为静态文件上传，保证稳定性
router.get("/config", appController.config);

router.post("/", appController.getAppList); // 获取所有用户
router.post("/create", appController.createApp); // 根据 ID 获取用户
router.get("/detail", appController.getAppDetail); // 获取应用详情

module.exports = router;
