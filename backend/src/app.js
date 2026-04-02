const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Basic route to check if server is running
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is up and running!',
    timestamp: new Date().toISOString()
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    message: 'Backend API is functional'
  });
});

module.exports = app;
