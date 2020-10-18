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
const validateReferences = require('../middlewares/validateReferences');
const {
    Movie,
    validateOnCreateMovie,
    validateOnUpdateMovie
} = require('../models/Movie');
const { Genre } = require('../models/Genre');
const { MovieType } = require('../models/MovieType');
const { Language } = require('../models/Language');
const { Country } = require('../models/Country');
const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(
        pathParamsFilter([
            {
                field: 'genres',
                param: 'genreId',
                model: Genre
            },
            {
                field: 'movieType',
                param: 'movieTypeId',
                model: MovieType
            }
        ]),
        listJsonResponse(Movie, ['genres', 'movieType']),
        getMovies
    )
    .post(
        validateRequestBody(validateOnCreateMovie),
        validateReferences([
            {
                model: Genre,
                field: '_id',
                property: 'genreIds',
                assignedProperty: 'genres'
            },
            {
                model: MovieType,
                field: '_id',
                property: 'movieTypeId',
                assignedProperty: 'movieType'
            },
            {
                model: Language,
                field: '_id',
                property: 'spokenLanguageId',
                assignedProperty: 'spokenLanguage'
            },
            {
                model: Language,
                field: '_id',
                property: 'subtitleLanguageId',
                assignedProperty: 'subtitleLanguage'
            },
            {
                model: Country,
                field: '_id',
                property: 'countryId',
                assignedProperty: 'country'
            }
        ]),
        createMovie
    );

router
    .route('/:id')
    .get(
        validateReferences([
            {
                model: Movie,
                field: '_id',
                param: 'id'
            }
        ]),
        getMovie
    )
    .put(
        validateRequestBody(validateOnUpdateMovie),
        validateReferences([
            {
                model: Movie,
                field: '_id',
                param: 'id'
            },
            {
                model: Genre,
                field: '_id',
                property: 'genreIds',
                assignedProperty: 'genres'
            },
            {
                model: MovieType,
                field: '_id',
                property: 'movieTypeId',
                assignedProperty: 'movieType'
            }
        ]),
        updateMovie
    )
    .delete(
        validateReferences([
            {
                model: Movie,
                field: '_id',
                param: 'id'
            }
        ]),
        deleteMovie
    );

module.exports = router;
