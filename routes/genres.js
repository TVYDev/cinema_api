const express = require('express');
const router = express.Router();
const {
    Genre,
    validateOnCreateGenre,
    validateOnUpdateGenre
} = require('../models/Genre');
const validateRequestBody = require('../middlewares/validateRequestBody');
const { createGenre } = require('../controllers/genres');

router.route('/').post(validateRequestBody(validateOnCreateGenre), createGenre);

module.exports = router;
