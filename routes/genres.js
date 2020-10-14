const express = require('express');
const router = express.Router();
const {
    Genre,
    validateOnCreateGenre,
    validateOnUpdateGenre
} = require('../models/Genre');
const validateRequestBody = require('../middlewares/validateRequestBody');
const listJsonResponse = require('../middlewares/listJsonResponse');
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
    .get(getGenre)
    .put(validateRequestBody(validateOnUpdateGenre), updateGenre)
    .delete(deleteGenre);

module.exports = router;
