const express = require('express');
const router = express.Router();
const {
    getCinemas,
    createCinema,
    getCinema,
    updateCinema,
    deleteCinema,
    uploadPhotoCinema,
    uploadLayoutImageCinema
} = require('../controllers/cinemas');
const listJsonResponse = require('../middlewares/listJsonResponse');
const {
    Cinema,
    validateOnCreateCinema,
    validateOnUpdateCinema
} = require('../models/Cinema');
const validateRequestBody = require('../middlewares/validateRequestBody');
const validateReferences = require('../middlewares/validateReferences');
const hallsRouter = require('./halls');

// Re-route to other resource routers
router.use('/:cinemaId/halls', hallsRouter);

router
    .route('/')
    .get(listJsonResponse(Cinema), getCinemas)
    .post(validateRequestBody(validateOnCreateCinema), createCinema);

router
    .route('/:id')
    .get(
        validateReferences([
            {
                model: Cinema,
                field: '_id',
                param: 'id'
            }
        ]),
        getCinema
    )
    .put(
        validateRequestBody(validateOnUpdateCinema),
        validateReferences([
            {
                model: Cinema,
                field: '_id',
                param: 'id'
            }
        ]),
        updateCinema
    )
    .delete(
        validateReferences([
            {
                model: Cinema,
                field: '_id',
                param: 'id'
            }
        ]),
        deleteCinema
    );

router.route('/:id/photo').put(
    validateReferences([
        {
            model: Cinema,
            field: '_id',
            param: 'id'
        }
    ]),
    uploadPhotoCinema
);

router.route('/:id/layout-image').put(
    validateReferences([
        {
            model: Cinema,
            field: '_id',
            param: 'id'
        }
    ]),
    uploadLayoutImageCinema
);

module.exports = router;
