const asyncHandler = require('../middlewares/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const { Hall } = require('../models/Hall');

exports.createHall = asyncHandler(async (req, res, next) => {
    const hall = await Hall.create(req.body);

    res.standard(200, true, 'Hall is created successfully', hall);
});
