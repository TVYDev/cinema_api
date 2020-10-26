const asyncHandler = require('../middlewares/asyncHandler');
const { User } = require('../models/User');

/**
 * @swagger
 * /users:
 *  post:
 *      tags:
 *          - 😀 Users
 *      summary: Create a user
 *      description: (ADMIN) Create a user
 *      parameters:
 *          -   in: body
 *              name: User
 *              description: User to be created
 *              schema:
 *                  type: object
 *                  required:
 *                      - name
 *                      - email
 *                      - password
 *                      - role
 *                      - membershipId
 *                  properties:
 *                      name:
 *                          type: string
 *                          example: Vannyou
 *                      email:
 *                          type: string
 *                          format: email
 *                          example: vannyou@mail.com
 *                      password:
 *                          type: string
 *                          example: Abc1234
 *                      role:
 *                          type: string
 *                          enum: [customer, staff]
 *                          example: customer
 *                      membershipId:
 *                          type: string
 *                          description: Object Id of membership
 *                          example: 5f9630d827bad03854c8cdfd
 *      responses:
 *          201:
 *              description: Created
 *          400:
 *              description: Validation error
 *          500:
 *              description: Internal server error
 *
 */
exports.createUser = asyncHandler(async (req, res, next) => {
    const user = await User.create(req.body);

    res.standard(201, true, 'User is created successfully', user);
});
