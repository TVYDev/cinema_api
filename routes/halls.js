const express = require('express');
const router = express.Router();
const { createHall } = require('../controllers/halls');
const validateRequestBody = require('../middlewares/validateRequestBody');
const { validateOnCreateHall } = require('../models/Hall');

router.route('/').post(validateRequestBody(validateOnCreateHall), createHall);

module.exports = router;
