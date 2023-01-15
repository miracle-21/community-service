const router = require('express').Router();
const controller = require('./controller');

router.get('/', function(req, res){
    res.render('signin.ejs')
});

router.post('/', controller.createUser);

module.exports = router;