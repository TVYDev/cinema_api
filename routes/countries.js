const express = require('express');
const {
    Country,
    validateOnCreateCountry,
    validateOnUpdateCountry
} = require('../models/Country');
const {
    createCountry,
    getCountries,
    getCountry,
    updateCountry,
    deleteCountry
} = require('../controllers/countries');
const validateRequestBody = require('../middlewares/validateRequestBody');
const listJsonResponse = require('../middlewares/listJsonResponse');
const validateReferences = require('../middlewares/validateReferences');
const router = express.Router();

router
    .route('/')
    .get(listJsonResponse(Country), getCountries)
    .post(validateRequestBody(validateOnCreateCountry), createCountry);

router
    .route('/:id')
    .get(
        validateReferences([
            {
                model: Country,
                field: '_id',
                param: 'id'
            }
        ]),
        getCountry
    )
    .put(
        validateRequestBody(validateOnUpdateCountry),
        validateReferences([
            {
                model: Country,
                field: '_id',
                param: 'id'
            }
        ]),
        updateCountry
    )
    .delete(
        validateReferences([
            {
                model: Country,
                field: '_id',
                param: 'id'
            }
        ]),
        deleteCountry
    );

module.exports = router;
