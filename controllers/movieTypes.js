const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middlewares/asyncHandler');
const { MovieType } = require('../models/MovieType');

/**
 * @swagger
 * /movie-types:
 *  get:
 *      tags:
 *          - 🎦 Movie Types
 *      summary: Get all movie types
 *      description: (PUBLIC) Retrieve all movie types with filtering, sorting and pagination
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
exports.getMovieTypes = asyncHandler(async (req, res, next) => {
    res.standard(200, true, 'Success', res.listJsonData); 
});

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