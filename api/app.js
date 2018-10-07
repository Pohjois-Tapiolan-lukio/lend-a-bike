const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const routeLendings = require('./routes/lendings');
const routeBikes = require('./routes/bikes');
const routeAdmins = require('./routes/admins');
const routeBreakdowns = require('./routes/breakdowns');

const app = express();
const PREFIX = process.env.API_ROUTE_PREFIX;

mongoose.connect(
  `mongodb://admin:${process.env.MONGO_ADMIN_PASSWORD}@database/lendabike`
);
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Define route middleware
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(`${PREFIX}/lendings`, routeLendings);
app.use(`${PREFIX}/bikes`, routeBikes);
app.use(`${PREFIX}/admins`, routeAdmins);
app.use(`${PREFIX}/breakdowns`, routeBreakdowns);

// Throw a new error when the route is not found
app.use((req, res, next) => {
  const error = new Error(`Route not found! \
${req.method} ${req.url} ${PREFIX}`);
  error.status = 404;
  next(error);
});

// Catch (_ is needed)
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
