const express = require('express');
const validateRequestBody = require('../middlewares/validateRequestBody');
const validateReferences = require('../middlewares/validateReferences');
const listJsonResponse = require('../middlewares/listJsonResponse');
const {
    Language,
    validateOnCreateLanguage,
    validateOnUpdateLanguage
} = require('../models/Language');
const {
    createLanguage,
    getLanguages,
    getLanguage,
    updateLanguage,
    deleteLanguage
} = require('../controllers/languages');
const router = express.Router();

router
    .route('/')
    .get(listJsonResponse(Language), getLanguages)
    .post(validateRequestBody(validateOnCreateLanguage), createLanguage);

router
    .route('/:id')
    .get(
        validateReferences([
            {
                model: Language,
                field: '_id',
                param: 'id'
            }
        ]),
        getLanguage
    )
    .put(
        validateRequestBody(validateOnUpdateLanguage),
        validateReferences([
            {
                model: Language,
                field: '_id',
                param: 'id'
            }
        ]),
        updateLanguage
    )
    .delete(
        validateReferences([
            {
                model: Language,
                field: '_id',
                param: 'id'
            }
        ]),
        deleteLanguage
    );

module.exports = router;
