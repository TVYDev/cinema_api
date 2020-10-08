const asyncHandler = require('../middlewares/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const { Hall } = require('../models/Hall');

/**
 * @swagger
 * /halls:
 *  get:
 *      tags:
 *          - 🎪 Halls
 *      summary: Get all halls
 *      description: (PUBLIC) Retrieve all halls with filtering, sorting & pagination
 *      parameters:
 *          -   in: query
 *              name: select
 *              schema:
 *                  type: string
 *              description: Fields to be selected (Multiple fields separated by comma [,])
 *              example: name,seatRows,seatColumns
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
exports.getHalls = asyncHandler(async (req, res, next) => {
    res.standard(200, true, 'Success', res.listJsonData);
});

/**
 * @swagger
 * /halls/{id}:
 *  get:
 *      tags:
 *          - 🎪 Halls
 *      summary: Get a single hall by id
 *      description: (PUBLIC) Retrieve a single hall from database by hall id
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema: string
 *              required: true
 *              description: Object ID of hall
 *              example: 5f7e6fa36e1f822e0800184a
 *      responses:
 *          200:
 *              description: OK
 *          404:
 *              description: Hall is not found
 *          500:
 *              description: Internal server error
 */
exports.getHall = asyncHandler(async (req, res, next) => {
    const hall = await Hall.findById(req.params.id);

    if (!hall) {
        return next(new ErrorResponse('Hall with given ID is not found', 404));
    }

    res.standard(200, true, 'Success', hall);
});

/**
 * @swagger
 * /halls:
 *  post:
 *      tags:
 *          - 🎪 Halls
 *      summary: Create a new hall
 *      description: (ADMIN) Create a new hall
 *      parameters:
 *          -   in: body
 *              name: hall
 *              description: The hall to be created
 *              required:
 *                  - name
 *                  - seatRows
 *                  - seatColumns
 *              schema:
 *                  type: object
 *                  properties:
 *                      name:
 *                          type: string
 *                          example: Hall one
 *                      seatRows:
 *                          type: array
 *                          items:
 *                              type: string | number
 *                          example: ["A","B","C"]
 *                      seatColumns:
 *                          type: array
 *                          items:
 *                              type: string | number
 *                          example: [1,2,3]
 *      responses:
 *          201:
 *              description: Created
 *          400:
 *              description: Validation error
 *          500:
 *              description: Internal server error
 */
exports.createHall = asyncHandler(async (req, res, next) => {
    const hall = await Hall.create(req.body);

    res.standard(201, true, 'Hall is created successfully', hall);
});
