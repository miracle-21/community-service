const router = require('express').Router();
const controller = require('./controller.js');


router.get('/', controller.identify, function(request, response){
    var userid = { user : request.user._id}
    var username = { user : request.user.id}
    request.app.db.collection('post').find(userid).sort({created_at : -1 }).toArray(function(error, result){
        response.render('mypage.ejs', {result : result, username : username});
    });
});


module.exports = router;