"use strict"
let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let cors = require('cors')

let indexRouter = require('./routes/index');
let todoRouter = require('./routes/todo');

let app = express();

const mongoose = require('mongoose');
let bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/todos',function (err) {

  if (err) throw err;

});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors())

app.use(logger('dev'));
//app.use(express.json());
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({extended: true}));
//app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/todo', todoRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
