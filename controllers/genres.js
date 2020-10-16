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
 * /genres/{id}:
 *  get:
 *      tags:
 *          - 🎃 Genres
 *      summary: Get a single genre
 *      description: (PUBLIC) Get a single genre by its ID
 *      parameters:
 *          -   in: path
 *              name: id
 *              required: true
 *              description: Object ID of genre
 *              example: 5f85b4bb8be19d2788193471
 *      responses:
 *          200:
 *              description: OK
 *          404:
 *              description: Genre is not found
 *          500:
 *              description: Internal server error
 */
exports.getGenre = asyncHandler(async (req, res, next) => {
    const genre = await Genre.findById(req.params.id);

    res.standard(200, true, 'Success', genre);
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

/**
 * @swagger
 * /genres/{id}:
 *  put:
 *      tags:
 *          - 🎃 Genres
 *      summary: Update a genre
 *      description: (ADMIN) Update information of a genre
 *      parameters:
 *          -   in: path
 *              name: id
 *              required: true
 *              description: Object ID of genre to be updated
 *              example: 5f85b4bb8be19d2788193471
 *          -   in: body
 *              name: genre
 *              description: Genre data to be updated
 *              schema:
 *                  type: object
 *                  properties:
 *                      name:
 *                          type: string
 *                          example: Romance
 *                      description:
 *                          type: string
 *                          example: Love story
 *      responses:
 *          200:
 *              description: OK
 *          400:
 *              description: Validation error
 *          404:
 *              description: Genre is not found
 *          500:
 *              description: Internal server error
 */
exports.updateGenre = asyncHandler(async (req, res, next) => {
    const genre = await Genre.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.standard(200, true, 'Genre is updated successfully', genre);
});

/**
 * @swagger
 * /genres/{id}:
 *  delete:
 *      tags:
 *          - 🎃 Genres
 *      summary: Delete a genre by its ID
 *      description: (ADMIN) Delete a genre by its ID
 *      parameters:
 *          -   in: path
 *              name: id
 *              required: true
 *              description: Object ID of genre
 *              example: 5f85b4bb8be19d2788193471
 *      responses:
 *          200:
 *              description: OK
 *          404:
 *              description: Genre is not found
 *          500:
 *              description: Internal server error
 */
exports.deleteGenre = asyncHandler(async (req, res, next) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);

    res.standard(200, true, 'Genre is deleted successfully', genre);
});
