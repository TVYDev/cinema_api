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
 * /movie-types/{id}:
 *  get:
 *      tags:
 *          - 🎦 Movie Types
 *      summary: Get a single movie type by ID
 *      description: (PUBLIC) Get a single movie type by its ID
 *      parameters:
 *          -   in: path
 *              name: id
 *              require: true
 *              description: Object ID of movie type
 *              example: 5f84030ea795143ed451ddbf
 *      responses:
 *          200:
 *              description: OK
 *          404:
 *              description: Movie type is not found
 *          500:
 *              description: Internal server error
 */
exports.getMovieType = asyncHandler(async (req, res, next) => {
    const movieType = await MovieType.findById(req.params.id);

    if (!movieType) {
        return next(
            new ErrorResponse('Movie type with given ID is not found', 404)
        );
    }

    res.standard(200, true, 'Success', movieType);
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

/**
 * @swagger
 * /movie-types/{id}:
 *  put:
 *      tags:
 *          - 🎦 Movie Types
 *      summary: Update a movie type
 *      description: (ADMIN) Update a movie type by its ID
 *      parameters:
 *          -   in: path
 *              name: id
 *              required: true
 *              description: Object ID of movie type
 *              example: 5f84030ea795143ed451ddbf
 *          -   in: body
 *              name: movieType
 *              description: Movie type data to be updated
 *              schema:
 *                  type: object
 *                  properties:
 *                      name:
 *                          type: string
 *                          example: 2D
 *                      description:
 *                          type: string
 *                          example: Sample description
 *      responses:
 *          200:
 *              description: OK
 *          400:
 *              description: Validation error
 *          404:
 *              description: Movie type is not found
 *          500:
 *              description: Internal server error
 */
exports.updateMovieType = asyncHandler(async (req, res, next) => {
    let movieType = await MovieType.findById(req.params.id);

    if (!movieType) {
        return next(
            new ErrorResponse('Movie type with given ID is not found', 404)
        );
    }

    movieType = await MovieType.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.standard(200, true, 'Movie type is updated successfully', movieType);
});

/**
 * @swagger
 * /movie-types/{id}:
 *  delete:
 *      tags:
 *          - 🎦 Movie Types
 *      summary: Delete a movie type by its ID
 *      description: (ADMIN) Delete a movie type by its ID
 *      parameters:
 *          -   in: path
 *              name: id
 *              required: true
 *              description: Object ID of movie type
 *              example: 5f84030ea795143ed451ddbf
 *      responses:
 *          200:
 *              description: OK
 *          404:
 *              description: Movie type is not found
 *          500:
 *              description: Internal server error
 */
exports.deleteMovieType = asyncHandler(async (req, res, next) => {
    let movieType = await MovieType.findById(req.params.id);

    if (!movieType) {
        return next(
            new ErrorResponse('Movie type with given ID is not found', 404)
        );
    }

    await movieType.remove();

    res.standard(200, true, 'Movie type is deleted successfully', movieType);
});
