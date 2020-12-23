const asyncHandler = require('../middlewares/asyncHandler');
const { User } = require('../models/User');

/**
 * @swagger
 * /auth/register:
 *  post:
 *    tags:
 *      - 👨‍💻 Authentication
 *    summary: Register a user
 *    description: (Public) Register a user
 *    parameters:
 *      - in: body
 *        name: user
 *        description: User to be registered
 *        schema:
 *          type: object
 *          required:
 *            - name
 *            - email
 *            - password
 *          properties:
 *            name:
 *              type: string
 *              example: tvy
 *            email:
 *              type: string
 *              format: email
 *              example: tvy@mail.com
 *            password:
 *              type: string
 *              example: Abc12345
 *    responses:
 *      200:
 *        description: OK
 *      400:
 *        description: Validation error
 *      500:
 *        description: Internal server error
 */
exports.register = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.standard(200, true, 'User is registered successfully', user);
});
