var router = require('express').Router();


// function identify(request, response, next){
//     if (request.user){
//         next()
//     } else {
//         response.send("<script>alert('로그인이 필요한 기능입니다.'); window.location.replace('/login');</script>");
//     }
// }

// router.use(identify);




router.get('/shirts', function(요청, 응답){
   응답.send('셔츠 파는 페이지입니다.');
});

router.get('/pants', function(요청, 응답){
   응답.send('바지 파는 페이지입니다.');
}); 

router.use( function(req, res, next) {
    res.status(404).send('Sorry cant find that!');
});
  
router.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports = router;





















module.exports = router;