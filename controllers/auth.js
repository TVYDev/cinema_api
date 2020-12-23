const asyncHandler = require('../middlewares/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const { User, ROLE_CUSTOMER } = require('../models/User');

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

/**
 * @swagger
 * /auth/login:
 *  post:
 *    tags:
 *      - 👨‍💻 Authentication
 *    summary: Log in a user
 *    description: (Public) Log in a user
 *    parameters:
 *      - in: body
 *        name: user
 *        description: User to be logged in
 *        schema:
 *          type: object
 *          required:
 *            - email
 *            - password
 *          properties:
 *            email:
 *              type: string
 *              format: email
 *              example: tvy@mail.com
 *            password:
 *              type: string
 *              example: 123456
 *    responses:
 *      200:
 *        description: OK
 *      400:
 *        description: Validation error
 *      500:
 *        description: Internal server error
 */
exports.login = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
    role: ROLE_CUSTOMER
  });

  const incorrectUserMessage = 'Email or password is incorrect';

  if (!user) {
    return next(new ErrorResponse(incorrectUserMessage, 400));
  }

  const isPasswordCorrect = await user.compareHashedPassword(req.body.password);
  if (!isPasswordCorrect) {
    return next(new ErrorResponse(incorrectUserMessage, 400));
  }

  const token = user.generateJwtToken();
  const expiresInSeconds = parseInt(process.env.JWT_EXPIRES_IN_SECONDS);
  const tokenExpiresAt = new Date();
  tokenExpiresAt.setSeconds(tokenExpiresAt.getSeconds() + expiresInSeconds);
  const data = { token, tokenExpiresAt: new Date(tokenExpiresAt) };

  res.standard(200, true, 'User is logged in successfully', data);
});
