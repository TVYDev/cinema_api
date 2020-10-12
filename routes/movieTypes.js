const express = require('express');
const { createMovieType } = require('../controllers/movieTypes');
const { MovieType, validateOnCreateMovieType, validateOnUpdateMovieType } = require('../models/MovieType');
const validateRequestBody = require('../middlewares/validateRequestBody');
const router = express.Router();

router.route('/').post(validateRequestBody(validateOnCreateMovieType), createMovieType);

module.exports = router;