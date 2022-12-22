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
        }
      ]
      request.app.db.collection('post').aggregate(search_requirement).sort({created_at : -1 }).toArray(function(error, result){
        response.render('search.ejs', {result : result});
    });
});


module.exports = router;
