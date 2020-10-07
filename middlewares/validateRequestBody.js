const ErrorResponse = require('../utils/ErrorResponse');

const validateRequestBody = (validateFn) => (req, res, next) => {
    const { error } = validateFn(req.body);
    if (error) {
        return next(new ErrorResponse(error.message, 400));
    }

    next();
};

module.exports = validateRequestBody;
