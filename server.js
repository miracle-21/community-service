//서버를 띄우기 위한 기본 세팅
const express = require('express');
const app = express();

//라이브러리
const methodOverride = require('method-override'); //AJAX
const bodyParser = require('body-parser');
const passport = require('passport');
app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({extended : true}));
app.set('view engine', 'ejs');
require('dotenv').config()

// 미들웨어. 요청과 응답 사이에 작동하는 js.
app.use('/public', express.static('public'));

//쿠키파서 사용할것인가
// var cookieParser = require('cookie-parser')
// app.use(cookieParser('s^&ecret%@coo#kie!'))

//세션활성화
const session = require('express-session');
app.use(
    session({
        secret: 's^&ecret%@coo#kie!', 
        resave: true, /* 매번 세션 저장 */
        saveUninitialized: false /* 빈 값은 저장 안함*/
    })
);
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

//MongoDB
var db;
const MongoClient = require('mongodb').MongoClient;
MongoClient.connect(process.env.DB_URL, function(error, client){
    if(error){return console.log(error)}
    db = client.db('todoapp')
    app.db = db;
    module.exports.db = db;
    app.listen(process.env.PORT, function(){
        console.log('DB연결성공')
    });
})

//페이지네이션
const paginate = require('express-paginate');
app.use(paginate.middleware(10, 50));


function identify(request, response, next){
    if (request.user){
        next()
    } else {
        response.send("<script>alert('로그인이 필요한 기능입니다.'); window.location.replace('/login');</script>");
    }
};


//router
app.use('/', require('./routes/index.js'));
app.use('/mypage', require('./routes/mypage.js'));
app.use('/delete', require('./routes/delete.js'));
app.use('/login', require('./routes/login.js'));
app.use('/signin', require('./routes/signin.js'));
app.use('/edit', require('./routes/edit.js'));
app.use('/write', require('./routes/write.js'));
app.use('/detail', require('./routes/detail.js'));
app.use('/search', require('./routes/search.js'));