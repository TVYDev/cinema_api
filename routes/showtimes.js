const express = require('express');
const {
    Showtime,
    validateOnCreateShowtime,
    validateOnUpdateShowtime
} = require('../models/Showtime');
const { Movie } = require('../models/Movie');
const { Hall } = require('../models/Hall');
const { addShowTime } = require('../controllers/showtimes');
const validateRequestBody = require('../middlewares/validateRequestBody');
const validateReferences = require('../middlewares/validateReferences');
const router = express.Router();

router.route('/').post(
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
    addShowTime
);

module.exports = router;
