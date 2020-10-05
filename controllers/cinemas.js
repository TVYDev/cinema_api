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
 *          200:
 *              description: OK
 */
exports.getCinemas = asyncHandler(async (req, res, next) => {
    res.standard(200, true, 'Success', res.listJsonData);
});

/**
 * @swagger
 * /cinemas:
 *  post:
 *      tags:
 *          - 🎥 Cinemas
 *      summary: Create a new cinema
 *      description: Create a new cinema (Admin Only)
 *      parameters:
 *          -   in: body
 *              name: cinema
 *              description: The cinema to create
 *              schema:
 *                  type: object
 *                  required:
 *                      - name
 *                      - address
 *                      - openingHours
 *                  properties:
 *                      name:
 *                          type: string
 *                          example: Delee Cinema
 *                      address:
 *                          type: string
 *                          example: Phnom Penh
 *                      openingHours:
 *                          type: string
 *                          example: 7AM - 9PM
 *      responses:
 *          201:
 *              description: OK
 *          400:
 *              description: Validation Error
 */
exports.createCinema = asyncHandler(async (req, res, next) => {
    const cinema = await Cinema.create(req.body);
    res.standard(201, true, 'Cinema is created successfully', cinema);
});
