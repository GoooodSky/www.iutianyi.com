var express = require('express');
var router = express.Router();
var path = require('path')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.sendFile(path.join(__dirname, '../public/pages/home/index.html'));
});

router.get('/admin', function (req, res, next) {
  res.sendFile(path.join(__dirname, '../public/pages/admin/index.html'));
});

module.exports = router;