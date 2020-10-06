const Cinema = require('../models/Cinema');
const asyncHandler = require('../middlewares/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');

/**
 * @swagger
 * /cinemas:
 *  get:
 *      tags:
 *          - 🎥 Cinemas
 *      summary: Get all cinemas
 *      description: (PUBLIC) Retrieve all cinemas with filtering, sorting & pagination
 *      responses:
 *          200:
 *              description: OK
 *          500:
 *              description: Internal server error
 */
exports.getCinemas = asyncHandler(async (req, res, next) => {
    res.standard(200, true, 'Success', res.listJsonData);
});

/**
 * @swagger
 * /cinemas/{id}:
 *  get:
 *      tags:
 *          - 🎥 Cinemas
 *      summary: Get a single cinema by id
 *      description: (PUBLIC) Retrieve a single cinema by its ID
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema: string
 *              required: true
 *              description: Object ID of cinema
 *              example: 5f7ae01bc3c24b4c6c328d03
 *      responses:
 *          200:
 *              description: OK
 *          404:
 *              description: Cinema is not found
 *          500:
 *              description: Internal server error
 */
exports.getCinema = asyncHandler(async (req, res, next) => {
    const cinema = await Cinema.findById(req.params.id);

    if (!cinema) {
        return next(
            new ErrorResponse('Cinema with given ID is not found', 404)
        );
    }

    res.standard(200, true, 'Success', cinema);
});

/**
 * @swagger
 * /cinemas:
 *  post:
 *      tags:
 *          - 🎥 Cinemas
 *      summary: Create a new cinema
 *      description: (ADMIN) Create a new cinema
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
 *          500:
 *              description: Internal server error
 */
exports.createCinema = asyncHandler(async (req, res, next) => {
    const cinema = await Cinema.create(req.body);
    res.standard(201, true, 'Cinema is created successfully', cinema);
});

/**
 * @swagger
 * /cinemas/{id}:
 *  put:
 *      tags:
 *          - 🎥 Cinemas
 *      summary: Update a cinema
 *      description: (ADMIN) Update a cinema
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema: string
 *              required: true
 *              description: Object ID of cinema
 *              example: 5f7ae01bc3c24b4c6c328d03
 *          -   in: body
 *              name: cinema
 *              description: The cinema data to be updated
 *              schema:
 *                  type: object
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
 *          200:
 *              description: OK
 *          400:
 *              description: Validation Error
 *          404:
 *              description: Cinema is not found
 *          500:
 *              description: Internal server error
 */
exports.updateCinema = asyncHandler(async (req, res, next) => {
    let cinema = await Cinema.findById(req.params.id);

    if (!cinema) {
        return next(
            new ErrorResponse('Cinema with given ID is not found', 404)
        );
    }

    cinema = await Cinema.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.standard(200, true, 'Cinema is updated successfully', cinema);
});

/**
 * @swagger
 * /cinemas/{id}:
 *  delete:
 *      tags:
 *          - 🎥 Cinemas
 *      summary: Delete a cinema
 *      description: (ADMIN) Delete a cinema from database by its ID
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema: string
 *              required: true
 *              description: Object ID of cinema
 *              example: 5f7ae01bc3c24b4c6c328d03
 *      responses:
 *          200:
 *              description: OK
 *          404:
 *              description: Cinema is not found
 *          500:
 *              description: Internal server error
 */
exports.deleteCinema = asyncHandler(async (req, res, next) => {
    let cinema = await Cinema.findById(req.params.id);

    if (!cinema) {
        return next(
            new ErrorResponse('Cinema with given ID is not found', 404)
        );
    }

    await cinema.remove();

    res.standard(200, true, 'Cinema is deleted successfully', cinema);
});
