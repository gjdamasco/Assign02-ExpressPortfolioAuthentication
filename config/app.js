let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

// database setup
let mongoose = require('mongoose');
let DB = require('./db');

// point mongoose to DB URI
mongoose.connect(DB.URI);

// create an event to connect to dbase 
let mongoDB = mongoose.connection;
mongoDB.on('error',console.error.bind(console, 'Connection Error: ')) // an event for db error
mongoDB.once('open', ()=>{                                            // an event for online connection
  console.log('Connected to MongoDB...');
})  


let indexRouter = require('../routes/index');  //update indexRoute path
let usersRouter = require('../routes/users');  //update usersRoute path

let app = express();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');   // ejs -e

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public'))); //update public folder path

// static path to join all node_modules folders inside the index.ejs
app.use(express.static(path.join(__dirname, '../node_modules')));  //update public folder path

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
