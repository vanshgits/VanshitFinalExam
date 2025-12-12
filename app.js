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



module.exports = app;






// Swagger UI
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const yaml = require('js-yaml');
const fs = require('fs');

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














// 404 Handler (JSON)
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    path: req.originalUrl
  });
});

// Error Handler (JSON)
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    error: err.name || 'Internal Server Error',
    message: err.message,
    // Only show stack in development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});