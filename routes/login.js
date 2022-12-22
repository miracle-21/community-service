const router = require('express').Router();
const passport = require('passport');


router.get('/', function(request, response){
    response.render('login.ejs')
})

router.post('/', passport.authenticate('local', {failureRedirect: '/login/error'}), function(request, response) {
    response.redirect('/');
})

router.get('/error', function(request, response) {
    response.send("<script>alert('아이디/비밀번호 재확인 필요'); window.location.replace('/login');</script>");
})

module.exports = router;