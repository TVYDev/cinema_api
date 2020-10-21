const asyncHandler = require('../middlewares/asyncHandler');
const { Showtime } = require('../models/Showtime');

/**
 * @swagger
 * /showtimes:
 *  post:
 *      tags:
 *          - ⌚ Showtimes
 *      summary: Add a showtime
 *      description: (ADMIN) Add a showtime
 *      parameters:
 *          -   in: body
 *              name: showtime
 *              description: Showtime to be created
 *              schema:
 *                  type: object
 *                  required:
 *                      - startedDateTime
 *                      - movieId
 *                      - hallId
 *                  properties:
 *                      startedDateTime:
 *                          type: string
 *                          example: 2020-10-20 17:30
 *                          description: Date with ISO format
 *                      movieId:
 *                          type: string
 *                          example: 5f867f6526b4c50090a9cf83
 *                          descripion: Object ID of movie
 *                      hallId:
 *                          type: string
 *                          example: 5f7e6fa36e1f822e0800184a
 *                          description: Object ID of hall
 *      responses:
 *          200:
 *              description: Created
 *          400:
 *              description: Validation error
 *          500:
 *              description: Internal server error
 */
exports.addShowtime = asyncHandler(async (req, res, next) => {
    const showtime = await Showtime.create(req.body);

    res.standard(201, true, 'Showtime is added successfully', showtime);
});

/**
 * @swagger
 * /showtimes/{id}:
 *  put:
 *      tags:
 *          - ⌚ Showtimes
 *      summary: Update a showtime
 *      description: (ADMIN) Update a showtime by its ID
 *      parameters:
 *          -   in: path
 *              name: id
 *              required: true
 *              description: Object Id of showtime
 *              example: 5f8e536d47915a3dc00eab39
 *          -   in: body
 *              name: showtime
 *              description: Showtime to be created
 *              schema:
 *                  type: object
 *                  properties:
 *                      startedDateTime:
 *                          type: string
 *                          example: 2020-10-20 17:30
 *                          description: Date with ISO format
 *                      movieId:
 *                          type: string
 *                          example: 5f867f6526b4c50090a9cf83
 *                          descripion: Object ID of movie
 *                      hallId:
 *                          type: string
 *                          example: 5f7e6fa36e1f822e0800184a
 *                          description: Object ID of hall
 *      responses:
 *          200:
 *              description: OK
 *          400:
 *              description: Validation error
 *          404:
 *              description: Showtime is not found
 *          500:
 *              description: Internal server error
 */
exports.updateShowtime = asyncHandler(async (req, res, next) => {
    const showtime = await Showtime.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.standard(200, true, 'Showtime is updated successfully', showtime);
});
