const express = require('express');
const {
    createMovieType,
    getMovieTypes,
    getMovieType,
    updateMovieType,
    deleteMovieType
} = require('../controllers/movieTypes');
const {
    MovieType,
    validateOnCreateMovieType,
    validateOnUpdateMovieType
} = require('../models/MovieType');
const validateRequestBody = require('../middlewares/validateRequestBody');
const listJsonResponse = require('../middlewares/listJsonResponse');
const router = express.Router();
const hallTypesRouter = require('./hallTypes');
const moviesRouter = require('./movies');

// Re-route to other route resources
router.use('/:movieTypeId/compatible-hall-types', hallTypesRouter);
router.use('/:movieTypeId/movies', moviesRouter);

router
    .route('/')
    .get(listJsonResponse(MovieType), getMovieTypes)
    .post(validateRequestBody(validateOnCreateMovieType), createMovieType);

router
    .route('/:id')
    .get(getMovieType)
    .put(validateRequestBody(validateOnUpdateMovieType), updateMovieType)
    .delete(deleteMovieType);

module.exports = router;
