const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const jsonResponse = require('./middlewares/jsonResponse');
const errorHandler = require('./middlewares/errorHandler');
const swagger = require('./config/swagger');

// Load env variables
dotenv.config({ path: './config/.env' });

// Load route files
const cinemas = require('./routes/cinemas');

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// HTTP Request logger middleware
app.use(morgan('tiny'));

// Add standard response
app.use(jsonResponse);

// Mount routes
app.use('/api/v1/cinemas', cinemas);

// Add error handler
app.use(errorHandler);

// Generate API documentation
swagger(app);

const port = process.env.PORT || 5000;

const server = app.listen(port, () =>
    console.log(
        `Server is running in ${process.env.NODE_ENV} mode on port ${port}`.cyan
            .inverse
    )
);

// Global handler of unhandled promise rejection
process.on('unhandledRejection', (error) => {
    console.log(`Error: ${error.message}`.red);

    // Close the server and exit process with failure (Prevent the server to crash)
    server.close(() => process.exit(1));
});
