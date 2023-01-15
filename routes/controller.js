//DB모델
const postModel = require('../models/post');
const counterModel = require('../models/counter');
const viewModel = require('../models/view');
const userModel = require('../models/user');

//비밀번호 암호화
const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.getPosts = async (req, res, next) => {
    try {
        res.status(200);
        const counter = await counterModel.findOne().select("validPost");
        const validPost = counter.validPost;
        const pages = parseInt(req.query.pages);
        const limit = parseInt(req.query.limit);
        const post = await postModel.find().sort({created_at : -1 }).skip(limit * (pages-1)).limit(limit);
        res.status(200).render('list.ejs', {result:post, validPost:validPost, limit:limit});
    } catch (error) {
        next(error);
    }
}

exports.getDetailPost = async (req, res, next) => {
    try {
        res.status(200);
        const ip = req.header["x-forwarded-for"] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
        const data = {post_id:parseInt(req.params.id), ip_address:ip}
        const view = await viewModel.findOne({post_id : parseInt(req.params.id), ip_address: ip});
        if (!view) {
            await viewModel.create(data);
            await postModel.findByIdAndUpdate(req.params.id,{$inc : {view:1}});
        }
        const post = await postModel.findById(req.params.id);
        res.status(200).render('detail.ejs', {result : post});
    } catch (error) {
        next(error)
    }
}

exports.createUser = async (req, res, next) => {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(String(req.body.pw), parseInt(salt));
        const data = {id: req.body.id, pw: hashedPassword};
        await userModel.create(data);
        res.status(201).send("<script>alert('회원가입 완료'); window.location.replace('/');</script>");
    } catch (error) {
        if (error.code === 11000) {
            res.status(403).send("<script>alert('중복 id입니다'); javascript:history.back();</script>");
        }
        next(error);
    }
};

exports.getMypage = async (req, res, next) => {
    try {
        const mypage = await postModel.find({user:req.user._id}).sort({created_at : -1 });
        res.status(200).render('mypage.ejs', {result : mypage, username : req.user.id});
    } catch (error) {
        console.log(error);
        next(error);
    }
};

exports.postPage = (req, res, next) => {
    try {
        res.status(200).render('write.ejs');
    } catch (error) {
        next(error);
    }
};

exports.createPost = async (req, res, next) => {
    try {
        const counter = await counterModel.findOne({name: 'count'});
        const countPost = counter.totalPost;
        const date = new Date();
        const timestamp = date.getFullYear()+"/"+((date.getMonth()+1).toString().padStart(2, "0"))+"/"+date.getDate().toString().padStart(2, "0")+" "+date.getHours().toString().padStart(2, "0")+":"+date.getMinutes().toString().padStart(2, "0")+":"+date.getSeconds().toString().padStart(2, "0");
        const data = {_id: countPost,title:req.body.title, content:req.body.content, created_at:timestamp, user:req.user._id, username:req.user.id, view:0}
        await postModel.create(data);
        await counterModel.updateOne({name:"count"}, {$inc : {totalPost:1, validPost:1}})
        res.status(201).redirect('/detail/' + countPost)
    } catch (error) {   
        next(error);
    }
};

exports.updatePage = async (req, res, next) => {
    try {
        const post = await postModel.findOne({_id: parseInt(req.params.id), user: req.user._id})
        if (!post) {
            res.status(401).send("<script>alert('작성자 본인만 수정 가능합니다.'); javascript:history.back();</script>");
        } else {
            res.status(200).render('edit.ejs', { result : post });
        }
    } catch (error) {
        next(error);
    }
};

exports.updatePost = async (req, res, next) => {
    try {
        await postModel.updateOne({_id: parseInt(req.body.id)},{$set : {title: req.body.title, content: req.body.content}})
        res.status(200).redirect('/detail/' + req.body.id);
    } catch (error) {
        next(error);
    }
};

exports.deletePost = async (req, res, next) => {
    try {
        const post = await postModel.findOne({_id: parseInt(req.params.id), user: req.user._id});
        if (!post) {
            res.status(401).send("<script>alert('작성자 본인만 삭제 가능합니다.'); javascript:history.back();</script>");
        } else {
            await postModel.deleteOne({_id: parseInt(req.params.id), user: req.user._id});
            await counterModel.updateOne({name:'count'}, {$inc : {validPost: -1}});
            res.status(200).send("<script>alert('삭제완료'); window.location.replace('/');</script>");
        }
    } catch (error) {
        next(error);
    }
};

exports.searchPosts = async (req, res, next) => {
    try {
        const search_requirement = [
            {
              $search: {
                index: 'titleSearch',
                text: {
                  query: req.query.value,
                  path: 'title'
                }
              }
            },
            {
              $sort: {created_at : -1}
            }
          ]
          
          const result = await postModel.aggregate(search_requirement)
          res.render('search.ejs', {result : result});
    } catch (error) {
        next(error);
    }
};

// exports.detailHandler = (req, res) => {
//     const ip = req.header["x-forwarded-for"] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
//     var data = {"createdAt": new Date(), post_id:parseInt(req.params.id), ip_address:ip}
//     req.app.db.collection('view').findOne({post_id : parseInt(req.params.id), ip_address: ip},function(error, result){
//         if(!result){
//             req.app.db.collection('view').createIndex( { "createdAt": 1 }, { expireAfterSeconds: 86400 } );
//             req.app.db.collection('view').insertOne(data);
//             req.app.db.collection('post').updateOne({_id: parseInt(req.params.id)},{$inc : {view:1}});
//         };
//         req.app.db.collection('post').findOne({_id : parseInt(req.params.id)}, function(error, result){
//             if(error){
//                 console.log('bad req')
//             } else {
//                 res.render('detail.ejs', { result : result })
//             };
//         });
//     });
// };

// exports.mypageHandler = (req, res) => {
//     var userid = { user : req.user._id}
//     var username = { user : req.user.id}
//     req.app.db.collection('post').find(userid).sort({created_at : -1 }).toArray(function(error, result){
//         res.render('mypage.ejs', {result : result, username : username});
//     });
// };

// exports.deleteHandler = (req, res) => {
//     req.app.db.collection('post').findOne({_id: parseInt(req.params.id), user: req.user._id}, function(error, result){
//         if(!result){
//             res.send("<script>alert('작성자 본인만 삭제 가능합니다.'); javascript:history.back();</script>");
//         } else {
//             req.app.db.collection('post').deleteOne({_id: parseInt(req.params.id), user: req.user._id})
//             req.app.db.collection('counter').updateOne({name:'count'},{$inc : {validPost: -1}})
//             res.send("<script>alert('삭제완료'); window.location.replace('/');</script>");
//         };
//     })
// };

// exports.editPage = (req, res) => {
//     req.app.db.collection('post').findOne({_id: parseInt(req.params.id), user: req.user._id}, function(error, result){
//         if (!result){
//             res.send("<script>alert('작성자 본인만 수정 가능합니다.'); javascript:history.back();</script>");
//         } else {
//             res.render('edit.ejs', { result : result })
//         }
//     }) 
// };

// exports.editHandler = (req, res) => {
//     req.app.db.collection('post').updateOne({_id: parseInt(req.body.id)},{$set : {title: req.body.title, content: req.body.content}}, function(error, result){
//         if(error){
//             console.log('bad req')
//         } else {
//             res.redirect('/detail/' + req.body.id)
//         };
//     })
// };

// exports.writePage = (req, res) => {
//     res.render('write.ejs')
// }

// exports.writeHandler = (req, res) => {
//     req.app.db.collection('counter').findOne({name : 'count'}, function(error, result){
//         var countPost = result.totalPost;
//         var date = new Date();
//         var timestamp = date.getFullYear()+"/"+((date.getMonth()+1).toString().padStart(2, "0"))+"/"+date.getDate().toString().padStart(2, "0")+" "+date.getHours().toString().padStart(2, "0")+":"+date.getMinutes().toString().padStart(2, "0")+":"+date.getSeconds().toString().padStart(2, "0");
//         var data = {_id: countPost,title:req.body.title, content:req.body.content, created_at:timestamp, user:req.user._id, username:req.user.id, view:0}
//         req.app.db.collection('post').insertOne(data, function(error, result){
//             req.app.db.collection('counter').updateOne({name:'count'},{$inc : {totalPost:1, validPost:1}}, function(error, result){
//                 if(error){
//                     return console.log(error)
//                 } else{
//                     res.redirect('/detail/' + countPost)
//                 };
//             });
//         });
//     });
// };



exports.identify = (req, res, next) => {
    if (req.user){
        next()
    } else {
        res.send("<script>alert('로그인이 필요한 기능입니다.'); window.location.replace('/login');</script>");
    }
};