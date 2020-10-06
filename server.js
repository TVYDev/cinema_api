const app = require('./app');

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

module.exports = server;
