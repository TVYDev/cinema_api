const ErrorResponse = require('../utils/ErrorResponse');
const jwt = require('jsonwebtoken');
const { User } = require('../models/User');

const authenticate = async (req, res, next) => {
  try {
    let token = req.headers['authorization'];
    if (!token) {
      throw new ErrorResponse('Token is not provided', 400);
    }

    token = token.replace(/^Bearer\s+/, '');

    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);

    const user = await User.findById(decoded.id);
    if (!user) {
      throw new ErrorResponse('Token is invalid', 400);
    }

    req.user = user;

    return next();
  } catch (error) {
    return next(new ErrorResponse(error.message, 400));
  }
};

module.exports = authenticate;
