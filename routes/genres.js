const express = require('express');
const router = express.Router();
const {
    Genre,
    validateOnCreateGenre,
    validateOnUpdateGenre
} = require('../models/Genre');
const validateRequestBody = require('../middlewares/validateRequestBody');
const listJsonResponse = require('../middlewares/listJsonResponse');
const validateReferences = require('../middlewares/validateReferences');
const {
    createGenre,
    getGenres,
    getGenre,
    updateGenre,
    deleteGenre
} = require('../controllers/genres');
const moviesRouter = require('./movies');

// Re-route to other route resources
router.use('/:genreId/movies', moviesRouter);

router
    .route('/')
    .get(listJsonResponse(Genre), getGenres)
    .post(validateRequestBody(validateOnCreateGenre), createGenre);

router
    .route('/:id')
    .get(
        validateReferences([
            {
                model: Genre,
                field: '_id',
                param: 'id'
            }
        ]),
        getGenre
    )
    .put(
        validateRequestBody(validateOnUpdateGenre),
        validateReferences([
            {
                model: Genre,
                field: '_id',
                param: 'id'
            }
        ]),
        updateGenre
    )
    .delete(
        validateReferences([
            {
                model: Genre,
                field: '_id',
                param: 'id'
            }
        ]),
        deleteGenre
    );

module.exports = router;
