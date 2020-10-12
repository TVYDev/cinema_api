const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middlewares/asyncHandler');
const { MovieType } = require('../models/MovieType');

/**
 * @swagger
 * /movie-types:
 *  post:
 *      tags: 
 *          - 🎦 Movie Types
 *      summary: Create a new movie type
 *      description: (ADMIN) Create a new movie type
 *      parameters:
 *          -   in: body
 *              name: movieType
 *              description: movie type to be created
 *              schema: 
 *                  type: object
 *                  required:
 *                      - name
 *                      - description
 *                  properties:
 *                      name: 
 *                          type: string
 *                          example: 2D
 *                      description:
 *                          type: string
 *                          example: Simple 2D technology
 *      responses: 
 *          201:
 *              description: Created
 *          400:
 *              description: Validation Error
 *          500: 
 *              description: Internal server error
 */
exports.createMovieType = asyncHandler(async (req, res, next) => {
    const movieType = await MovieType.create(req.body);

    res.standard(201, true, 'Movie type is created successfully', movieType);
});