var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var restaurantsRouter = require('./routes/restaurants');

const connectDB = require('./config/db');

var app = express();

// Connect to DB
connectDB();

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/restaurants', restaurantsRouter);

// 404
app.use(function(req, res, next) {
  next(require('http-errors')(404));
});

// Error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;






// Swagger UI
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

try {
  const spec = yaml.load(fs.readFileSync(path.join(__dirname, 'openapi.yaml'), 'utf8'));
  const swaggerSpec = swaggerJSDoc({
    swaggerDefinition: spec,
    apis: [], 
  });
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('Swagger UI available at http://localhost:3000/api-docs');
} catch (err) {
  console.warn('Swagger UI failed to load:', err.message);
}