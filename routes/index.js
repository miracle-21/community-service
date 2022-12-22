const router = require('express').Router();


router.get('/', function(request, response){
    request.app.db.collection('counter').findOne({name : 'count'}, function(error, validPost){
        var validPost = validPost
        var pages = parseInt(request.query.pages)
        var limit = parseInt(request.query.limit)
        request.app.db.collection('post').find().sort({created_at : -1 }).skip(limit * (pages-1)).limit(limit).toArray(function(error, result){
            response.render('list.ejs', {result : result, validPost: validPost.validPost, limit:limit});
        });
    })
});


module.exports = router;