//서버를 띄우기 위한 기본 세팅
const express = require('express');
const app = express();

//라이브러리
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
const bodyParser = require('body-parser'); // request.body에 접근을 도와준다
app.use(bodyParser.urlencoded({extended : true})); // object를 상속받는 qs.parse를 사용
app.use(express.json());
app.set('view engine', 'ejs');
app.use('/public', express.static('public')); // 정적파일 public
app.set('trust proxy', true);

//환경변수
require('dotenv').config()

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
const mongoose = require('mongoose');
mongoose.set("strictQuery", false);
mongoose.connect(process.env.DB_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        app.listen(process.env.PORT);
        // console.log('MongoDb Connected...');
    })
    .catch(err => console.log(err));
    

//페이지네이션
const paginate = require('express-paginate');
app.use(paginate.middleware(10, 50));

//router
app.use('/', require('./routes/index.js'));
app.use('/login', require('./routes/login.js'));
app.use('/signin', require('./routes/signin.js'));

//에러핸들러
app.use((error, req, res, next) => {
    res.status(500).json({ message: error.message })
})


// const server = app.listen(process.env.PORT, () => console.log(`Listening at port ${process.env.PORT}`));
// server.close();

module.exports = app;