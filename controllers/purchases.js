const { Purchase } = require('../models/Purchase');
const asyncHandler = require('../middlewares/asyncHandler');

/**
 * @swagger
 * /purchases/initiate:
 *  post:
 *      tags:
 *          - 🎫 Purchases
 *      summary: Initiate a purchase
 *      description: (Private) Initiate a purchase (Reserve time for seat selection)
 *      parameters:
 *          -   in: body
 *              name: Purchase
 *              description: Purhase to be initiated
 *              schema:
 *                  type: object
 *                  required:
 *                      - numberTickets
 *                      - showtimeId
 *                  properties:
 *                      numberTickets:
 *                          type: number
 *                          min: 1
 *                          example: 2
 *                      showtimeId:
 *                          type: string
 *                          description: Object ID of showtime
 *                          example: 5f8e536d47915a3dc00eab39
 *      responses:
 *          200:
 *              description: OK
 *          400:
 *              description: Validation error
 *          500:
 *              description: Internal server error
 */
exports.initiatePurchase = asyncHandler(async (req, res, next) => {
    const purchase = await Purchase.create(req.body);

    res.standard(201, true, 'Purchase is initiated successfully', purchase);
});
