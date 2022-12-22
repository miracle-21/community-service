const router = require('express').Router();
const controller = require('./controller.js');


router.delete('/', controller.identify, function(request, response){
    request.body._id = parseInt(request.body._id);
    // var data = { _id : request.body._id, user : request.user._id}
    request.app.db.collection('post').deleteOne(request.body, function(error, result){
        if(error){
            return console.log('실패!')
        } else {
            request.app.db.collection('counter').updateOne({name:'count'},{$inc : {validPost:-1}})
            response.status(200).send({message : '삭제완료'});
        };
    })
})

router.get('/:id', controller.identify, function(request, response){
    request.app.db.collection('post').findOne({_id: parseInt(request.params.id), user: request.user._id}, function(error, result){
        if(!result){
            response.send("<script>alert('작성자 본인만 삭제 가능합니다.'); javascript:history.back();</script>");
        } else {
            request.app.db.collection('post').deleteOne({_id: parseInt(request.params.id), user: request.user._id})
            request.app.db.collection('counter').updateOne({name:'count'},{$inc : {validPost: -1}})
            response.send("<script>alert('삭제완료'); window.location.replace('/');</script>");
        };
    })
});


module.exports = router;