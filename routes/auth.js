const express = require('express');
const { validateOnRegisterUser } = require('../models/User');
const { register } = require('../controllers/auth');
const validateRequestBody = require('../middlewares/validateRequestBody');
const router = express.Router();

router.post('/register', validateRequestBody(validateOnRegisterUser), register);

module.exports = router;
