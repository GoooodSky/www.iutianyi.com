var express = require('express');
var router = express.Router();
var marked = require('marked');
var fm = require('front-matter');

var artilcesModel = require('../database/articles');

// Article List
router.get('/', function (req, res, next) {
    res.send('<h1>Article List</h1>');
});

// Article Detail
router.get('/:key', function (req, res, next) {

    var key = req.params.key
    artilcesModel
        .findOne({
            _id: key
        })
        .exec(function (err, data) {

            if (err) {
                res.send('文章不存在')
            }
            var article = data
            article.content = marked(article.content)
            
            data.view = data.view + 1
            data.save()
            res.send(article)
            // res.render('article', {
            //     article: article,
            // });
        })
});


module.exports = router;