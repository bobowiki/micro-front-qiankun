const Router = require("koa-router");
const pageController = require("../controllers/page");

const router = new Router({ prefix: "/page" });

router.post("/create", pageController.createPage);
router.get("/list", pageController.getPageList);

module.exports = router;
