const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const userModel = require('../models/user');

const validation = async (username, password, done) => {
    try {
        const result = await userModel.findOne({ id: username });
        bcrypt.compare(password, result.pw, function(error, match) {
            if (error) return done(error)
            if (match) {
                return done(null, result)
            } else {
                return done(null, false, console.log('비밀번호 재확인'))
            }
        });
    } catch {
        return done(null, false, console.log('아이디/비번 재확인'))
    }
};

module.exports = (passport) => {
    // passport 라이브러리 사용
    passport.use(new LocalStrategy({
        usernameField: 'id',    //<input type="text" class="form-control", name="id">
        passwordField: 'pw',    //<input type="text" class="form-control", name="pw">
        session: true,  //세션 정보를 저장한다.
        passReqToCallback: false, //아이디 비번 외 다른 정보 검증시 사용.
        }, validation)
    );
    //로그인 성공 시 세션 저장. user에 결과가 들어간다.
    passport.serializeUser(function (user, done) {
        done(null, user.id)
    });

    //해당 세션 데이터를 가진 사람을 db에서 찾기(마이페이지 접속 등에 발동)
    passport.deserializeUser((userId, done) => {
        userModel.findOne({id: userId}, function(error, result){
            done(null, result)
        });
    }); 
};