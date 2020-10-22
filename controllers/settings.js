const asyncHandler = require('../middlewares/asyncHandler');
const { Setting } = require('../models/Setting');

/**
 * @swagger
 * /settings:
 *  post:
 *      tags:
 *          - 📐 Settings
 *      summary: Create a setting
 *      description: (ADMIN) Create a setting
 *      parameters:
 *          -   in: body
 *              name: setting
 *              description: Setting to be created
 *              schema:
 *                  type: object
 *                  required:
 *                      - key
 *                      - type
 *                      - value
 *                  properties:
 *                      key:
 *                          type: string
 *                          example: min_minutes_interval_showtime
 *                      type:
 *                          type: string
 *                          enum: [number, integer, string, json, boolean]
 *                          example: number
 *                      value:
 *                          type: string
 *                          example: 30
 *      responses:
 *          201:
 *              description: Created
 *          400:
 *              description: Validation error
 *          500:
 *              description: Internal server error
 */
exports.createSetting = asyncHandler(async (req, res, next) => {
    const setting = await Setting.create(req.body);

    res.standard(201, true, 'Setting is created successfully', setting);
});
