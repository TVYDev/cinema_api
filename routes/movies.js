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
const pathParamsFilter = require('../middlewares/pathParamsFilter');
const {
    Movie,
    validateOnCreateMovie,
    validateOnUpdateMovie
} = require('../models/Movie');
const { Genre } = require('../models/Genre');
const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(
        pathParamsFilter([
            {
                field: 'genres',
                param: 'genreId',
                model: Genre
            }
        ]),
        listJsonResponse(Movie),
        getMovies
    )
    .post(validateRequestBody(validateOnCreateMovie), createMovie);

router
    .route('/:id')
    .get(getMovie)
    .put(validateRequestBody(validateOnUpdateMovie), updateMovie)
    .delete(deleteMovie);

module.exports = router;
