const router = require('express').Router();
const controller = require('./controller.js');

router.get('/:id', controller.identify, function(request, response){
    request.app.db.collection('post').findOne({_id: parseInt(request.params.id), user: request.user._id}, function(error, result){
        if (!result){
            response.send("<script>alert('작성자 본인만 수정 가능합니다.'); javascript:history.back();</script>");
        } else {
            response.render('edit.ejs', { result : result })
        }
    }) 
})


router.put('/', controller.identify, function(request, response){
    request.app.db.collection('post').updateOne({_id: parseInt(request.body.id)},{$set : {title: request.body.title, content: request.body.content}}, function(error, result){
        if(error){
            console.log('bad request')
        } else {
            response.redirect('/detail/' + request.body.id)
        };
    })
})

module.exports = router;