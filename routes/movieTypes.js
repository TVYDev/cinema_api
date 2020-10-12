const express = require('express');
const { createMovieType, getMovieTypes } = require('../controllers/movieTypes');
const { MovieType, validateOnCreateMovieType, validateOnUpdateMovieType } = require('../models/MovieType');
const validateRequestBody = require('../middlewares/validateRequestBody');
const listJsonResponse = require('../middlewares/listJsonResponse');
const router = express.Router();

router.route('/')
    .get(listJsonResponse(MovieType), getMovieTypes)
    .post(validateRequestBody(validateOnCreateMovieType), createMovieType);

module.exports = router;