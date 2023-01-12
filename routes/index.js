const router = require('express').Router();
const controller = require('./controller');

router.get('/', controller.indexHandler);
router.get('/mypage', controller.identify, controller.mypageHandler);
router.get('/detail/:id', controller.detailHandler);
router.get('/write', controller.identify, controller.writePage);
router.post('/write/add', controller.writeHandler);
router.put('/edit', controller.editHandler);
router.get('/edit/:id', controller.editPage);
router.delete('/delete/:id', controller.identify, controller.deleteHandler);

module.exports = router;