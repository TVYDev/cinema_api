const express = require('express');
const {
  validateOnRegisterUser,
  validateOnLoginUser,
  validateOnChangeUserPassword
} = require('../models/User');
const { register, login, changePassword } = require('../controllers/auth');
const validateRequestBody = require('../middlewares/validateRequestBody');
const authenticate = require('../middlewares/authenticate');
const router = express.Router();

router.post('/register', validateRequestBody(validateOnRegisterUser), register);
router.post('/login', validateRequestBody(validateOnLoginUser), login);
router.post(
  '/change-password',
  authenticate,
  validateRequestBody(validateOnChangeUserPassword),
  changePassword
);

module.exports = router;
