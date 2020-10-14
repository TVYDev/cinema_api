const express = require('express');
const { createMovie, getMovies, getMovie } = require('../controllers/movies');
const validateRequestBody = require('../middlewares/validateRequestBody');
const listJsonResponse = require('../middlewares/listJsonResponse');
const {
    Movie,
    validateOnCreateMovie,
    validateOnUpdateMovie
} = require('../models/Movie');
const router = express.Router();

router
    .route('/')
    .get(listJsonResponse(Movie), getMovies)
    .post(validateRequestBody(validateOnCreateMovie), createMovie);

router.route('/:id').get(getMovie);

module.exports = router;
