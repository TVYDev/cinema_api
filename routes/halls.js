const express = require('express');
const router = express.Router();
const { createHall } = require('../controllers/halls');
const validateRequestBody = require('../middlewares/validateRequestBody');
const { validateHall } = require('../models/Hall');

router.route('/').post(validateRequestBody(validateHall), createHall);

module.exports = router;
