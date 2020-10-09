const express = require('express');
const { createHallType } = require('../controllers/hallTypes');
const validateRequestBody = require('../middlewares/validateRequestBody');
const { validateOnCreateHallType } = require('../models/HallType');
const router = express.Router();

router
    .route('/')
    .post(validateRequestBody(validateOnCreateHallType), createHallType);

module.exports = router;
