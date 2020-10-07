const ErrorResponse = require('../utils/ErrorResponse');

const validateRequestBody = (validateFn) => async (req, res, next) => {
    const { error } = await validateFn(req.body);
    if (error) {
        return next(new ErrorResponse(error.message, 400));
    }

    next();
};

module.exports = validateRequestBody;
