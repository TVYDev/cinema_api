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
const validateReferences = require('../middlewares/validateReferences');
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
    .get(
        validateReferences([
            {
                model: MovieType,
                field: '_id',
                param: 'id'
            }
        ]),
        getMovieType
    )
    .put(
        validateRequestBody(validateOnUpdateMovieType),
        validateReferences([
            {
                model: MovieType,
                field: '_id',
                param: 'id'
            }
        ]),
        updateMovieType
    )
    .delete(
        validateReferences([
            {
                model: MovieType,
                field: '_id',
                param: 'id'
            }
        ]),
        deleteMovieType
    );

module.exports = router;
