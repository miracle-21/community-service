//서버를 띄우기 위한 기본 세팅
const express = require('express');
const app = express();

//router
// app.use('/shop', require('./routes/identify.js'))

//라이브러리
const methodOverride = require('method-override'); //AJAX
const bcrypt = require('bcrypt');
const saltRounds = 10;
const bodyParser = require('body-parser');
app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({extended : true}));
app.set('view engine', 'ejs');
require('dotenv').config()


// 미들웨어. 요청과 응답 사이에 작동하는 js.
app.use('/public', express.static('public'));

//로그인기능
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
app.use(session({secret: '비밀코드', resave: true, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());

function identify(request, response, next){
    if (request.user){
        next()
    } else {
        response.send("<script>alert('로그인이 필요한 기능입니다.'); window.location.replace('/login');</script>");
    }
}


//MongoDB
var db;
const MongoClient = require('mongodb').MongoClient;
MongoClient.connect(process.env.DB_URL, function(error, client){
    if(error){return console.log(error)}
    db = client.db('todoapp')

    app.listen(8080, function(){
        console.log('DB연결성공')
    });
})

//페이지네이션
const paginate = require('express-paginate');
app.use(paginate.middleware(8, 50));

//에러핸들링
// app.get('/api', (req, res) => {
//     throw new Error('BROKEN1');
//   });
  
//   app.get('/api2', (req, res) => {
//     throw new Error('BROKEN2');
//   });
  
//   app.use((err, req, res, next) => {
//     res.status(500);
//     res.json({message: '뭔가가 잘못됐소...'});
//   });

////////////////////////////////////////////////////////////////////////////////////////////////////////////////



app.get('/', function(request, response){
    db.collection('counter').findOne({name : 'count'}, function(error, validPost){
        var validPost = validPost
        var pages = parseInt(request.query.pages)
        var limit = parseInt(request.query.limit)
        db.collection('post').find().sort({created_at : -1 }).skip(limit * (pages-1)).limit(limit).toArray(function(error, result){
            response.render('list.ejs', {result : result, validPost: validPost.validPost, limit:limit});
        });
    })
});

app.get('/mypage', identify, function(request, response){
    var userid = { user : request.user._id}
    var username = { user : request.user.id}
    db.collection('post').find(userid).sort({created_at : -1 }).toArray(function(error, result){
        response.render('mypage.ejs', {result : result, username : username});
    });
});

app.get('/detail/:id', function(request, response){
    db.collection('post').findOne({_id : parseInt(request.params.id)}, function(error, result){
        if(error){
            console.log('bad request')
        } else {
            response.render('detail.ejs', { result : result })
        };
    })
});

app.get('/write', identify, function(request, response){
    response.render('write.ejs')
});

app.post('/add', function(request, response){
    db.collection('counter').findOne({name : 'count'}, function(error, result){
        var countPost = result.totalPost;
        var date = new Date();
        var timestamp = date.getFullYear()+"/"+((date.getMonth()+1).toString().padStart(2, "0"))+"/"+date.getDate().toString().padStart(2, "0")+" "+date.getHours().toString().padStart(2, "0")+":"+date.getMinutes().toString().padStart(2, "0")+":"+date.getSeconds().toString().padStart(2, "0");
        var data = {_id: countPost,title:request.body.title, content:request.body.content, created_at:timestamp, user:request.user._id, username:request.user.id}
        db.collection('post').insertOne(data, function(error, result){
            db.collection('counter').updateOne({name:'count'},{$inc : {totalPost:1, validPost:1}}, function(error, result){
                if(error){
                    return console.log(error)
                } else{
                    response.redirect('/detail/' + countPost)
                };
            });
        });
    });
});


app.delete('/delete', identify, function(request, response){
    request.body._id = parseInt(request.body._id);
    // var data = { _id : request.body._id, user : request.user._id}
    db.collection('post').deleteOne(request.body, function(error, result){
        if(error){
            return console.log('실패!')
        } else {
            db.collection('counter').updateOne({name:'count'},{$inc : {validPost:-1}})
            response.status(200).send({message : '삭제완료'});
        };
    })
})

app.get('/delete/:id', identify, function(request, response){
    db.collection('post').findOne({_id: parseInt(request.params.id), user: request.user._id}, function(error, result){
        if(!result){
            response.send("<script>alert('작성자 본인만 삭제 가능합니다.'); javascript:history.back();</script>");
        } else {
            db.collection('post').deleteOne({_id: parseInt(request.params.id), user: request.user._id})
            db.collection('counter').updateOne({name:'count'},{$inc : {validPost: -1}})
            response.send("<script>alert('삭제완료'); window.location.replace('/');</script>");
        };
    })
});

app.get('/edit/:id', identify, function(request, response){
    db.collection('post').findOne({_id: parseInt(request.params.id), user: request.user._id}, function(error, result){
        if (!result){
            response.send("<script>alert('작성자 본인만 수정 가능합니다.'); javascript:history.back();</script>");
        } else {
            response.render('edit.ejs', { result : result })
        }
    }) 
})


app.put('/edit', identify, function(request, response){
    var date = new Date();
    var timestamp = date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();

    db.collection('post').updateOne({_id: parseInt(request.body.id)},{$set : {title: request.body.title, content: request.body.content, created_at: timestamp}}, function(error, result){
        if(error){
            console.log('bad request')
        } else {
            response.redirect('/detail/' + request.body.id)
        };
    })
})

app.get('/signin', function(request, response){
    response.render('signin.ejs')
})


app.post('/signin', function(request, response){
    // var hash = bcrypt.hashSync(request.body.pw, parseInt(saltRounds));
    bcrypt.genSalt(saltRounds, function (err, salt) {
        if (err) return next(err);
        bcrypt.hash(request.body.pw, salt, function (err, hashedPassword) {
            if (err) return next(err);
            db.collection('user').insertOne({id: request.body.id, pw: hashedPassword}, function(error, result){
                response.send("<script>alert('회원가입 완료'); window.location.replace('/');</script>");
            })
        })
    })
})

app.get('/login', function(request, response){
    response.render('login.ejs')
})

// app.post('/login', passport.authenticate('local', {successRedirect: '/', failureRedirect: '/login'}))
app.post('/login', passport.authenticate('local', {failureRedirect: '/loginerror'}), function(request, response) {
    response.redirect('/mypage');
  })

app.get('/loginerror', function(request, response) {
    response.send("<script>alert('아이디/비밀번호 재확인 필요'); window.location.replace('/login');</script>");
})

app.get('/search', function(request, response){
    var 검색조건 = [
        {
          $search: {
            index: 'titleSearch',
            text: {
              query: request.query.value,
              path: 'title'
            }
          }
        }
      ] 
    db.collection('post').aggregate(검색조건).sort({created_at : -1 }).toArray(function(error, result){
        console.log(result.length)
        response.render('search.ejs', {result : result});
    });
});








// passport 라이브러리 사용
passport.use(new LocalStrategy({
    usernameField: 'id',    //<input type="text" class="form-control", name="id">
    passwordField: 'pw',    //<input type="text" class="form-control", name="pw">
    session: true,  //세션 정보를 저장한다.
    passReqToCallback: false, //아이디 비번 외 다른 정보 검증시 사용.
  }, function (username, password, done) {
    db.collection('user').findOne({ id: username }, function (error, result) {
        bcrypt.compare(password, result.pw, function(err, match) {
            if (error) return done(error)
            if (!result) return done(null, false, { message: '존재하지 않는 아이디' })
            if (match) {
                return done(null, result)
            } else {
                return done(null, false, { message: '비밀번호가 틀립니다' })
            }
        });
    })
  })
);


//로그인 성공 시 세션 저장. user에 결과가 들어간다.
passport.serializeUser(function (user, done) {
    done(null, user.id)
});

//해당 세션 데이터를 가진 사람을 db에서 찾기(마이페이지 접속 등에 발동)
passport.deserializeUser(function (아이디, done) {
    db.collection('user').findOne({id: 아이디}, function(error, result){
        done(null, result)
    })
    
});