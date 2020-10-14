const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middlewares/asyncHandler');
const { Genre } = require('../models/Genre');

/**
 * @swagger
 * /genres:
 *  get:
 *      tags:
 *          - 🎃 Genres
 *      summary: Get all genres
 *      description: (PUBLIC) Retrieve all genres from database with filtering, sorting & pagination
 *      parameters:
 *          -   in: query
 *              name: select
 *              schema:
 *                  type: string
 *              description: Fields to be selected (Multiple fields separated by comma [,])
 *              example: name,description
 *          -   in: query
 *              name: sort
 *              schema:
 *                  type: string
 *              description: Sort by field (Prefix the field with minus [-] for descending ordering)
 *              example: name,-createdAt
 *          -   in: query
 *              name: limit
 *              schema:
 *                  type: string
 *              default: 20
 *              description: Limit numbers of record for a page
 *              example: 10
 *          -   in: query
 *              name: page
 *              default: 1
 *              schema:
 *                  type: string
 *              description: Certain page index for records to be retrieved
 *              example: 1
 *          -   in: query
 *              name: paging
 *              default: true
 *              schema:
 *                  type: string
 *              description: Define whether need records in pagination
 *              example: false
 *      responses:
 *          200:
 *              description: OK
 *          500:
 *              description: Internal server error
 */
exports.getGenres = asyncHandler(async (req, res, next) => {
    res.standard(200, true, 'Success', res.listJsonData);
});

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
