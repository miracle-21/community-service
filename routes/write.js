const router = require('express').Router();
const controller = require('./controller.js');


router.get('/', controller.identify, function(request, response){
    response.render('write.ejs')
});

router.post('/add', function(request, response){
    request.app.db.collection('counter').findOne({name : 'count'}, function(error, result){
        var countPost = result.totalPost;
        var date = new Date();
        var timestamp = date.getFullYear()+"/"+((date.getMonth()+1).toString().padStart(2, "0"))+"/"+date.getDate().toString().padStart(2, "0")+" "+date.getHours().toString().padStart(2, "0")+":"+date.getMinutes().toString().padStart(2, "0")+":"+date.getSeconds().toString().padStart(2, "0");
        var data = {_id: countPost,title:request.body.title, content:request.body.content, created_at:timestamp, user:request.user._id, username:request.user.id}
        request.app.db.collection('post').insertOne(data, function(error, result){
            request.app.db.collection('counter').updateOne({name:'count'},{$inc : {totalPost:1, validPost:1}}, function(error, result){
                if(error){
                    return console.log(error)
                } else{
                    response.redirect('/detail/' + countPost)
                };
            });
        });
    });
});

module.exports = router;