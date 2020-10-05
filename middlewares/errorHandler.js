const ErrorResponse = require('../utils/ErrorResponse');
const colors = require('colors');

const errorHandler = (err, req, res, next) => {
    let data = {};
    let error = { ...err };
    error.message = err.message;

    // Mongoose bad object ID
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        error = new ErrorResponse('Resource not found', 404);
    }

    // Mongoose duplicated field error
    if (err.code === 11000) {
        error = new ErrorResponse('Duplicated field value provided', 400);
        data.duplicates = err.keyValue;
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((val) => val.message);
        error = new ErrorResponse(message, 400);
    }

    res.standard(
        error.httpStatusCode || 500,
        false,
        error.message || 'Unexpected Internal Server Error',
        data
    );
};

module.exports = errorHandler;
