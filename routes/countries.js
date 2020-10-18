const express = require('express');
const {
    Country,
    validateOnCreateCountry,
    validateOnUpdateCountry
} = require('../models/Country');
const { createCountry } = require('../controllers/countries');
const validateRequestBody = require('../middlewares/validateRequestBody');
const router = express.Router();

router
    .route('/')
    .post(validateRequestBody(validateOnCreateCountry), createCountry);

module.exports = router;
