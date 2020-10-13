const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middlewares/asyncHandler');
const { Genre } = require('../models/Genre');

/**
 * @swagger
 * /genres:
 *  post:
 *      tags:
 *          - 🎃 Genres
 *      summary: Create a new genre
 *      description: (ADMIN) Create a new genre
 *      parameters:
 *          -   in: body
 *              name: genre
 *              description: Genre to be created
 *              schema:
 *                  type: object
 *                  requried:
 *                      - name
 *                      - description
 *                  properties:
 *                      name:
 *                          type: string
 *                          example: Action
 *                      description:
 *                          type: string
 *                          example: Fighting scenes
 *      responses:
 *          201:
 *              description: Created
 *          400:
 *              description: Validation error
 *          500:
 *              description: Internal server error
 */
exports.createGenre = asyncHandler(async (req, res, next) => {
    const genre = await Genre.create(req.body);

    res.standard(201, true, 'Genre is created successfully', genre);
});
