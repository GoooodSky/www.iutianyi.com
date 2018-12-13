var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs');


var indexRouter = require('./routes');
var usersRouter = require('./routes/users');
var articlesRouter = require('./routes/articles');
var apisRouter = require('./routes/apis');

var accessLogStream = fs.createWriteStream(path.join(__dirname, './log/access.log'), { flags: 'a' })

var app = express();

// 全局连接数据库
require('./database/connect')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('combined',{ stream: accessLogStream }));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/article/images', express.static(path.join(__dirname, 'public/images')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/apis', apisRouter);
app.use('/articles', articlesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;