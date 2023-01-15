const router = require('express').Router();
const passport = require('passport');


router.get('/', (req, res, next) => {
    try {
        res.render('login.ejs');
    } catch (error) {
        next(error);
    }
})

router.post('/', passport.authenticate('local', {failureRedirect: '/login/error'}), (req, res, next) => {
    try {
        res.redirect('/');
    } catch (error) {
        next(error);
    }
})

router.get('/error', (req, res, next) => {
    try {
        res.send("<script>alert('아이디/비밀번호 재확인 필요'); window.location.replace('/login');</script>");
    } catch (error) {
        next(error);
    }  
})

module.exports = router;