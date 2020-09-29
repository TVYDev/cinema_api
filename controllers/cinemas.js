const Cinema = require('../models/Cinema');
const asyncHandler = require('../middlewares/asyncHandler');

// @desc    Get all cinemas
// @route   GET /api/v1/cinemas
// @access  Public
exports.getCinemas = (req, res, next) => {
    res.standard(200, true, 'success');
};

// @desc    Create a new cinema
// @route   POST /api/v1/cinemas
// @access  Admin
exports.createCinema = asyncHandler(async (req, res, next) => {
    const cinema = await Cinema.create(req.body);
    res.standard(201, true, 'Cinema is created successfully', cinema);
});
