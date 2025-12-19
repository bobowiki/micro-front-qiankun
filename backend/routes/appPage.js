const Router = require("koa-router");
const appPageController = require("../controllers/appPage");

const router = new Router({ prefix: "/appPage" });

router.post("/create", appPageController.createAppPage);
router.get("/list", appPageController.getAppPageList);
router.post("/byAppId", appPageController.getAppPageByAppId);

module.exports = router;
