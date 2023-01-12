exports.identify = (req, res, next) => {
    if (req.user){
        next()
    } else {
        res.send("<script>alert('로그인이 필요한 기능입니다.'); window.location.replace('/login');</script>");
    }
};

exports.indexHandler = (req, res) => {
    req.app.db.collection('counter').findOne({name : 'count'}, function(error, validPost){
        var validPost = validPost
        var pages = parseInt(req.query.pages)
        var limit = parseInt(req.query.limit)
        const ip = req.header["x-forwarded-for"] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
        req.app.db.collection('post').find().sort({created_at : -1 }).skip(limit * (pages-1)).limit(limit).toArray(function(error, result){
            res.render('list.ejs', {result : result, validPost: validPost.validPost, limit:limit});
        });
    })
};

exports.detailHandler = (req, res) => {
    const ip = req.header["x-forwarded-for"] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    var data = {"createdAt": new Date(), post_id:parseInt(req.params.id), ip_address:ip}
    req.app.db.collection('view').findOne({post_id : parseInt(req.params.id), ip_address: ip},function(error, result){
        if(!result){
            req.app.db.collection('view').createIndex( { "createdAt": 1 }, { expireAfterSeconds: 86400 } );
            req.app.db.collection('view').insertOne(data);
            req.app.db.collection('post').updateOne({_id: parseInt(req.params.id)},{$inc : {view:1}});
        };
        req.app.db.collection('post').findOne({_id : parseInt(req.params.id)}, function(error, result){
            if(error){
                console.log('bad req')
            } else {
                res.render('detail.ejs', { result : result })
            };
        });
    });
};

exports.mypageHandler = (req, res) => {
    var userid = { user : req.user._id}
    var username = { user : req.user.id}
    req.app.db.collection('post').find(userid).sort({created_at : -1 }).toArray(function(error, result){
        res.render('mypage.ejs', {result : result, username : username});
    });
};

exports.deleteHandler = (req, res) => {
    req.app.db.collection('post').findOne({_id: parseInt(req.params.id), user: req.user._id}, function(error, result){
        if(!result){
            res.send("<script>alert('작성자 본인만 삭제 가능합니다.'); javascript:history.back();</script>");
        } else {
            req.app.db.collection('post').deleteOne({_id: parseInt(req.params.id), user: req.user._id})
            req.app.db.collection('counter').updateOne({name:'count'},{$inc : {validPost: -1}})
            res.send("<script>alert('삭제완료'); window.location.replace('/');</script>");
        };
    })
};

exports.editPage = (req, res) => {
    req.app.db.collection('post').findOne({_id: parseInt(req.params.id), user: req.user._id}, function(error, result){
        if (!result){
            res.send("<script>alert('작성자 본인만 수정 가능합니다.'); javascript:history.back();</script>");
        } else {
            res.render('edit.ejs', { result : result })
        }
    }) 
};

exports.editHandler = (req, res) => {
    req.app.db.collection('post').updateOne({_id: parseInt(req.body.id)},{$set : {title: req.body.title, content: req.body.content}}, function(error, result){
        if(error){
            console.log('bad req')
        } else {
            res.redirect('/detail/' + req.body.id)
        };
    })
};

exports.writePage = (req, res) => {
    res.render('write.ejs')
}

exports.writeHandler = (req, res) => {
    req.app.db.collection('counter').findOne({name : 'count'}, function(error, result){
        var countPost = result.totalPost;
        var date = new Date();
        var timestamp = date.getFullYear()+"/"+((date.getMonth()+1).toString().padStart(2, "0"))+"/"+date.getDate().toString().padStart(2, "0")+" "+date.getHours().toString().padStart(2, "0")+":"+date.getMinutes().toString().padStart(2, "0")+":"+date.getSeconds().toString().padStart(2, "0");
        var data = {_id: countPost,title:req.body.title, content:req.body.content, created_at:timestamp, user:req.user._id, username:req.user.id, view:0}
        req.app.db.collection('post').insertOne(data, function(error, result){
            req.app.db.collection('counter').updateOne({name:'count'},{$inc : {totalPost:1, validPost:1}}, function(error, result){
                if(error){
                    return console.log(error)
                } else{
                    res.redirect('/detail/' + countPost)
                };
            });
        });
    });
};