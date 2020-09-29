const Cinema = require('../models/Cinema');
const asyncHandler = require('../middlewares/asyncHandler');

/**
 * @swagger
 * /cinemas:
 *  get:
 *      tags:
 *          - 🎥 Cinemas
 *      summary: Get all cinemas
 *      description: Retrieve all cinemas with filtering, sorting & pagination
 *      responses:
 *          '200':
 *              description: Successful response
 */
exports.getCinemas = (req, res, next) => {
    res.standard(200, true, 'success');
};

/**
 * @swagger
 * /cinemas:
 *  post:
 *      tags:
 *          - 🎥 Cinemas
 *      summary: Create a new cinema
 *      description: Create a new cinema (Admin Only)
 *      responses:
 *          '201':
 *              description: Successful operation
 *          '400':
 *              description: Validation error response
 */
exports.createCinema = asyncHandler(async (req, res, next) => {
    const cinema = await Cinema.create(req.body);
    res.standard(201, true, 'Cinema is created successfully', cinema);
});
