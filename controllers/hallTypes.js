const asyncHandler = require('../middlewares/asyncHandler');
const ErrorHandler = require('../utils/ErrorResponse');
const { HallType } = require('../models/HallType');

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
