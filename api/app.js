const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const routeLendings = require('./routes/lendings');
const routeBikes = require('./routes/bikes');

const app = express();
const PREFIX = process.env.API_ROUTE_PREFIX;

mongoose.connect('mongodb://memoadmin:salasana@database/posts');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Define route middleware
app.use(`${PREFIX}/lendings`, routeLendings);
app.use(`${PREFIX}/bikes`, routeBikes);

// Throw a new error when the route is not found
app.use((req, res, next) => {
  const error = new Error(`Route not found! \
${req.method} ${req.url} ${PREFIX}`);
  error.status = 404;
  next(error);
});

// Catch
app.use((err, req, res, _) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
    },
  });
});

module.exports = app;

// vim: et ts=2 sw=2 :
