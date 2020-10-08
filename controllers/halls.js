const asyncHandler = require('../middlewares/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const { Hall } = require('../models/Hall');

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
