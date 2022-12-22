const router = require('express').Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.get('/', function(request, response){
    response.render('signin.ejs')
})


router.post('/', function(request, response){
    bcrypt.genSalt(saltRounds, function (err, salt) {
        if (err) return next(err);
        bcrypt.hash(request.body.pw, salt, function (err, hashedPassword) {
            if (err) return next(err);
            request.app.db.collection('user').insertOne({id: request.body.id, pw: hashedPassword}, function(error, result){
                response.send("<script>alert('회원가입 완료'); window.location.replace('/');</script>");
            })
        })
    })
})

module.exports = router;