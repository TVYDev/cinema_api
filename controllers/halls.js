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
 *                  type: number
 *              default: 20
 *              description: Limit numbers of record for a page
 *              example: 10
 *          -   in: query
 *              name: page
 *              default: 1
 *              schema:
 *                  type: number
 *              description: Certain page index for records to be retrieved
 *              example: 1
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
