var express = require('express');
var router = express.Router();
var path = require('path');

var artilcesModel = require('../db/articles');

router.get('/', function (req, res, next) {

  if (req.session.user) {
    res.sendFile(path.join(__dirname, '../pages/admin.html'));
  } else {
    res.redirect('/login')
  }
});

router.post('/postArticle', function (req, res, next) {
  let article = req.body.params
   artilcesModel
    .create({
      title: article.title,
      date: article.date,
      viewer: [],
      lover: [],
      tag: article.tag,
      pinned: article.pinned,
      img: article.img,
      content: article.content
    }, function (err, data) {
      if (err) {
        res.send({
          status: false
        })
        return
      } else {
        res.send({
          status: true
        })
      }
    })
});

module.exports = router;