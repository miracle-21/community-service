const router = require('express').Router();


router.get('/:id', function(request, response){
    request.app.db.collection('post').findOne({_id : parseInt(request.params.id)}, function(error, result){
        if(error){
            console.log('bad request')
        } else {
            response.render('detail.ejs', { result : result })
        };
    })
});

module.exports = router;