const router = require('express').Router();


router.get('/', function(request, response){
    var search_requirement = [
        {
          $search: {
            index: 'titleSearch',
            text: {
              query: request.query.value,
              path: 'title'
            }
          }
        },
        {
          $sort: {created_at : -1}
        }
      ]
      
      request.app.db.collection('post').aggregate(search_requirement)
      .toArray(function(error, result){
        response.render('search.ejs', {result : result});
    });
});



module.exports = router;
