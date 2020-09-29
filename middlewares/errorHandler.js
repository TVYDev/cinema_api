const ErrorResponse = require('../utils/ErrorResponse');

const errorHandler = (err, req, res, next) => {
    let data = {};
    let error = { ...err };

    // Mongoose duplicated field error
    if (err.code === 11000) {
        error = new ErrorResponse('Duplicated field value provided', 400);
        data.duplicates = err.keyValue;
    }

    res.standard(
        error.httpStatusCode || 500,
        false,
        error.message || 'Unexpected Internal Server Error',
        data
    );
};

module.exports = errorHandler;
