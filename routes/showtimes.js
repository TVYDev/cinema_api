const express = require('express');
const {
    Showtime,
    validateOnCreateShowtime,
    validateOnUpdateShowtime
} = require('../models/Showtime');
const { Movie } = require('../models/Movie');
const { Hall } = require('../models/Hall');
const {
    getShowtimes,
    getShowtime,
    addShowtime,
    updateShowtime,
    deleteShowtime
} = require('../controllers/showtimes');
const validateRequestBody = require('../middlewares/validateRequestBody');
const validateReferences = require('../middlewares/validateReferences');
const listJsonResponse = require('../middlewares/listJsonResponse');
const router = express.Router();

router
    .route('/')
    .get(listJsonResponse(Showtime, ['movie', 'hall']), getShowtimes)
    .post(
        validateRequestBody(validateOnCreateShowtime),
        validateReferences([
            {
                model: Hall,
                field: '_id',
                property: 'hallId',
                assignedProperty: 'hall'
            },
            {
                model: Movie,
                field: '_id',
                property: 'movieId',
                assignedProperty: 'movie'
            }
        ]),
        addShowtime
    );

router
    .route('/:id')
    .get(
        validateReferences([
            {
                model: Showtime,
                field: '_id',
                param: 'id'
            }
        ]),
        getShowtime
    )
    .put(
        validateRequestBody(validateOnUpdateShowtime),
        validateReferences([
            {
                model: Showtime,
                field: '_id',
                param: 'id'
            },
            {
                model: Movie,
                field: '_id',
                property: 'movieId',
                assignedProperty: 'movie'
            },
            {
                model: Hall,
                field: '_id',
                property: 'hallId',
                assignedProperty: 'hall'
            }
        ]),
        updateShowtime
    )
    .delete(
        validateReferences([
            {
                model: Showtime,
                field: '_id',
                param: 'id'
            }
        ]),
        deleteShowtime
    );

module.exports = router;
