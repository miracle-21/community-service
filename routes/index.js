const router = require('express').Router();
const controller = require('./controller');

router.get('/', controller.getPosts);
router.get('/detail/:id', controller.getDetailPost);
router.get('/mypage', controller.identify, controller.getMypage);
router.get('/write', controller.identify, controller.postPage);
router.post('/write/add', controller.createPost);
router.put('/edit', controller.updatePost);
router.get('/edit/:id', controller.identify, controller.updatePage);
router.get('/delete/:id', controller.identify, controller.deletePost);
router.get('/search', controller.searchPosts);

module.exports = router;