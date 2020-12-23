const express = require('express');
const {
  validateOnRegisterUser,
  validateOnLoginUser
} = require('../models/User');
const { register, login } = require('../controllers/auth');
const validateRequestBody = require('../middlewares/validateRequestBody');
const router = express.Router();

router.post('/register', validateRequestBody(validateOnRegisterUser), register);
router.post('/login', validateRequestBody(validateOnLoginUser), login);

module.exports = router;
