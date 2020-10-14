const express = require('express');
const { createMovie } = require('../controllers/movies');
const validateRequestBody = require('../middlewares/validateRequestBody');
const {
    Movie,
    validateOnCreateMovie,
    validateOnUpdateMovie
} = require('../models/Movie');
const router = express.Router();

router.route('/').post(validateRequestBody(validateOnCreateMovie), createMovie);

module.exports = router;
