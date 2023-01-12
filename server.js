//서버를 띄우기 위한 기본 세팅
const express = require('express');
const app = express();

//라이브러리
const methodOverride = require('method-override');
app.use(methodOverride('_method'))
const bodyParser = require('body-parser'); // request.body에 접근을 도와준다
app.use(bodyParser.urlencoded({extended : true})); // object를 상속받는 qs.parse를 사용
app.set('view engine', 'ejs');
app.use('/public', express.static('public')); // 정적파일 public
app.set('trust proxy', true);

//환경변수
require('dotenv').config()

//쿠키파서 사용할것인가
// var cookieParser = require('cookie-parser')
// app.use(cookieParser('s^&ecret%@coo#kie!'))

//세션활성화
const passport = require('passport');
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

//router
app.use('/', require('./routes/index.js'));
app.use('/login', require('./routes/login.js'));
app.use('/signin', require('./routes/signin.js'));
app.use('/search', require('./routes/search.js'));
