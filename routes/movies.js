const express = require('express');
const {
    createMovie,
    getMovies,
    getMovie,
    updateMovie,
    deleteMovie
} = require('../controllers/movies');
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

router
    .route('/:id')
    .get(getMovie)
    .put(validateRequestBody(validateOnUpdateMovie), updateMovie)
    .delete(deleteMovie);

module.exports = router;
