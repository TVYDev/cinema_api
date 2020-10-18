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
const moviesRouter = require('./movies');
const router = express.Router();

// Re-route to other route resouces
router.use('/spoken/:spokenLanguageId/movies', moviesRouter);
router.use('/subtitle/:subtitleLanguageId/movies', moviesRouter);

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
