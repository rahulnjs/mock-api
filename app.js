const bodyParser = require('body-parser');
const createError = require('http-errors');
const express = require('express');

var indexRouter = require('./routes/index');

require('./db/redis');

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    error: err.message
  })
});

module.exports = app;
