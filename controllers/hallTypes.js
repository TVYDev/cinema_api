const asyncHandler = require('../middlewares/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const { HallType } = require('../models/HallType');
const { MovieType } = require('../models/MovieType');

/**
 * @swagger
 * /hall-types:
 *  get:
 *      tags:
 *          - 🏭 Hall Types
 *      summary: Get all hall types
 *      description: (PUBLIC) Retrieve all hall types from database with filtering, sorting and pagination.
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
 *
 */
/**
 * @swagger
 * /movie-types/{movieTypeId}/compatible-hall-types:
 *  get:
 *      tags:
 *          - 🏭 Hall Types
 *      summary: Get all compatible hall types of a movie type
 *      description: (PUBLIC) Retrieve all compatible hall types of a movie type from database with filtering, sorting and pagination.
 *      parameters:
 *          -   in: path
 *              name: movieTypeId
 *              required: true
 *              description: Object ID of movie type
 *              example: 5f84091350eab4485c327d1d
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
 *          404:
 *              description: Movie type is not found
 *          500:
 *              description: Internal server error
 *
 */
exports.getHallTypes = asyncHandler(async (req, res, next) => {
    res.standard(200, true, 'Success', res.listJsonData);
});

/**
 * @swagger
 * /hall-types/{id}:
 *  get:
 *      tags:
 *          - 🏭 Hall Types
 *      summary: Get a single hall type by ID
 *      description: (PUBLIC) Get a single hall type by its ID
 *      parameters:
 *          -   in: path
 *              name: id
 *              required: true
 *              schema: string
 *              description: Object ID of hall type
 *              example: 5f80169afe932e3d4055d1ea
 *      responses:
 *          200:
 *              description: OK
 *          404:
 *              description: Hall type is not found
 *          500:
 *              description: Internal server error
 */
exports.getHallType = asyncHandler(async (req, res, next) => {
    const hallType = await HallType.findById(req.params.id);

    if (!hallType) {
        return next(
            new ErrorResponse('Hall type with given ID is not found', 404)
        );
    }

    res.standard(200, true, 'Success', hallType);
});

/**
 * @swagger
 * /hall-types:
 *  post:
 *      tags:
 *          - 🏭 Hall Types
 *      summary: Create a new hall type
 *      description: (ADMIN) Create a new hall type
 *      parameters:
 *          -   in: body
 *              name: hallType
 *              description: Hall type to be created
 *              schema:
 *                  type: object
 *                  required:
 *                      - name
 *                      - description
 *                      - compatibleMovieTypeIds
 *                  properties:
 *                      name:
 *                          type: string
 *                          example: 2D/3D Hall
 *                      description:
 *                          type: string
 *                          example: Hall with 2D/3D technology
 *                      compatibleMovieTypeIds:
 *                          type: array
 *                          items:
 *                              type: string
 *                          description: Array of Object Id of movie types
 *                          example: ["5f8409065fc86e09e4752519","5f84030ea795143ed451ddbf"]
 *      responses:
 *          201:
 *              description: Created
 *          400:
 *              description: Validation error
 *          500:
 *              description: Internal server error
 */
exports.createHallType = asyncHandler(async (req, res, next) => {
    const compatibleMovieTypeIds = req.body.compatibleMovieTypeIds;
    let movieType;
    for (id of compatibleMovieTypeIds) {
        movieType = await MovieType.findById(id);

        if (!movieType) {
            return next(
                new ErrorResponse(
                    `Movie type with given ID (${id}) is not found`,
                    404
                )
            );
        }
    }
    req.body.compatibleMovieTypes = compatibleMovieTypeIds;

    const hallType = await HallType.create(req.body);

    res.standard(201, true, 'Hall type is created successfully', hallType);
});

/**
 * @swagger
 * /hall-types/{id}:
 *  put:
 *      tags:
 *          - 🏭 Hall Types
 *      summary: Update a hall type
 *      description: (ADMIN) Update a hall type by its ID
 *      parameters:
 *          -   in: path
 *              name: id
 *              required: true
 *              schema: string
 *              description: Object ID of hall type to be updated
 *              example: 5f80169afe932e3d4055d1ea
 *          -   in: body
 *              name: hallType
 *              description: Hall type data to be updated
 *              schema:
 *                  type: object
 *                  properties:
 *                      name:
 *                          type: string
 *                          example: 2D/3D Hall
 *                      description:
 *                          type: string
 *                          example: Hall with 2D/3D technology
 *      responses:
 *          200:
 *              description: OK
 *          400:
 *              description: Validation error
 *          404:
 *              description: Hall type is not found
 *          500:
 *              description: Internal server error
 */
exports.updateHallType = asyncHandler(async (req, res, next) => {
    let hallType = await HallType.findById(req.params.id);

    if (!hallType) {
        return next(
            new ErrorResponse('Hall type with given ID is not found', 404)
        );
    }

    hallType = await HallType.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.standard(200, true, 'Hall type is updated successfully', hallType);
});

/**
 * @swagger
 * /hall-types/{id}:
 *  delete:
 *      tags:
 *          - 🏭 Hall Types
 *      summary: Delete a hall type
 *      description: (ADMIN) Delete a hall type
 *      parameters:
 *          -   in: path
 *              name: id
 *              required: true
 *              schema: string
 *              description: Object ID of hall type to be deleted
 *              example: 5f80169afe932e3d4055d1ea
 *      responses:
 *          200:
 *              description: OK
 *          404:
 *              description: Hall type is not found
 *          500:
 *              description: Internal server error
 */
exports.deleteHallType = asyncHandler(async (req, res, next) => {
    const hallType = await HallType.findById(req.params.id);

    if (!hallType) {
        return next(
            new ErrorResponse('Hall type with given ID is not found', 404)
        );
    }

    await hallType.remove();

    res.standard(200, true, 'Hall type is deleted succesfully', hallType);
});
