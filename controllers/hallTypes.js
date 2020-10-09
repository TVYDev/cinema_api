const asyncHandler = require('../middlewares/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const { HallType } = require('../models/HallType');

/**
 * @swagger
 * /hall-types:
 *  get:
 *      tags:
 *          - 🏙 Hall Types
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
exports.getHallTypes = asyncHandler(async (req, res, next) => {
    res.standard(200, true, 'Success', res.listJsonData);
});

/**
 * @swagger
 * /hall-types/{id}:
 *  get:
 *      tags:
 *          - 🏙 Hall Types
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
 *          - 🏙 Hall Types
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
 *                  properties:
 *                      name:
 *                          type: string
 *                          example: 2D/3D Hall
 *                      description:
 *                          type: string
 *                          example: Hall with 2D/3D technology
 *      responses:
 *          201:
 *              description: Created
 *          400:
 *              description: Validation error
 *          500:
 *              description: Internal server error
 */
exports.createHallType = asyncHandler(async (req, res, next) => {
    const hallType = await HallType.create(req.body);

    res.standard(201, true, 'Hall type is created successfully', hallType);
});
