const asyncHandler = require('../middlewares/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const { User, ROLE_CUSTOMER } = require('../models/User');
const { Membership } = require('../models/Membership');
const { response } = require('express');

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

/**
 * @swagger
 * /auth/change-password:
 *  post:
 *    tags:
 *      - 👨‍💻 Authentication
 *    summary: Change a user password
 *    description: (Private) Change a user password
 *    parameters:
 *      - in: header
 *        name: Authorization
 *        schema:
 *          type: string
 *          format: Bearer token
 *        required: true
 *        example: Bearer TOKEN
 *      - in: body
 *        name: password
 *        description: Password to be changed
 *        schema:
 *          type: object
 *          required:
 *            - oldPassword
 *            - newPassword
 *          properties:
 *            oldPassword:
 *              type: string
 *              example: 123456
 *            newPassword:
 *              type: string
 *              example: 123457
 *    responses:
 *      200:
 *        description: OK
 *      400:
 *        description: Validation error
 *      500:
 *        description: Internal server error
 */
exports.changePassword = asyncHandler(async (req, res, next) => {
  const { user } = req;

  const isOldPasswordCorrect = await user.compareHashedPassword(
    req.body.oldPassword
  );
  if (!isOldPasswordCorrect) {
    return next(new ErrorResponse('Incorrect password', 400));
  }

  user.password = req.body.newPassword;
  await user.save();

  res.standard(200, true, 'Password is changed successfully', null);
});

/**
 * @swagger
 * /api/v1/auth/me:
 *  get:
 *    tags:
 *      - 👨‍💻 Authentication
 *    summary: Get user profile
 *    description: (Private) Get user profile
 *    parameters:
 *      - in: header
 *        name: Authorization
 *        schema:
 *          type: string
 *          format: Bearer token
 *        required: true
 *        example: Bearer TOKEN
 *    responses:
 *      200:
 *        description: OK
 *      400:
 *        description: Validation error
 *      500:
 *        description: Internal server error
 */
exports.me = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate('membership');
  res.standard(200, true, 'Success', user);
});
