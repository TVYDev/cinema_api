const express = require('express');
const path = require('path');
const app = express();

// Load env variables
require('dotenv').config({ path: './config/.env' });
// Logging
require('./startup/logging')(app);
// Load routes
require('./startup/routes')(app);
// Connect to database
require('./startup/db')();
// Generate API documentation
require('./startup/documentation')(app);
// Set static access
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;
