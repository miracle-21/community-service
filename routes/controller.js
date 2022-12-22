exports.identify = (request, response, next) => {
    if (request.user){
        next()
    } else {
        response.send("<script>alert('로그인이 필요한 기능입니다.'); window.location.replace('/login');</script>");
    }
};
