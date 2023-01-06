const router = require('express').Router();


router.get('/:id', function(request, response){  
    const ip = request.header["x-forwarded-for"] || request.connection.remoteAddress || request.socket.remoteAddress || request.connection.socket.remoteAddress;
    var data = {"createdAt": new Date(), post_id:parseInt(request.params.id), ip_address:ip}
    request.app.db.collection('view').findOne({post_id : parseInt(request.params.id), ip_address: ip},function(error, result){
        if(!result){
            request.app.db.collection('view').createIndex( { "createdAt": 1 }, { expireAfterSeconds: 86400 } );
            request.app.db.collection('view').insertOne(data);
            request.app.db.collection('post').updateOne({_id: parseInt(request.params.id)},{$inc : {view:1}});
        };
        request.app.db.collection('post').findOne({_id : parseInt(request.params.id)}, function(error, result){
            if(error){
                console.log('bad request')
            } else {
                response.render('detail.ejs', { result : result })
            };
        });
    });
    
});


module.exports = router;