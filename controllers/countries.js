const asyncHandler = require('../middlewares/asyncHandler');
const { Country } = require('../models/Country');

/**
 * @swagger
 * /countries:
 *  post:
 *      tags:
 *          - 🚩 Countries
 *      summary: Create a country
 *      description: (ADMIN) Create a country
 *      parameters:
 *          -   in: body
 *              name: Country
 *              description: Country to be created
 *              schema:
 *                  type: object
 *                  required:
 *                      - name
 *                      - code
 *                  properties:
 *                      name:
 *                          type: string
 *                          example: Cambodia
 *                      code:
 *                          type: string
 *                          example: KH
 *      responses:
 *          201:
 *              description: Created
 *          400:
 *              description: Validation error
 *          500:
 *              description: Internal server error
 */
exports.createCountry = asyncHandler(async (req, res, next) => {
    const country = await Country.create(req.body);

    res.standard(201, true, 'Country is created successfully', country);
});
