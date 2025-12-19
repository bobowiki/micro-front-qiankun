const Router = require('koa-router');
const resourceController = require('../controllers/resource');
const router = new Router({ prefix: '/resource' });

router.post('/create', resourceController.createResource);
router.get('/list', resourceController.getResourceList);
module.exports = router;