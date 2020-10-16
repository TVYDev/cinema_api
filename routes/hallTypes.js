const express = require('express');
const {
    createHallType,
    getHallTypes,
    getHallType,
    deleteHallType,
    updateHallType
} = require('../controllers/hallTypes');
const validateRequestBody = require('../middlewares/validateRequestBody');
const {
    HallType,
    validateOnCreateHallType,
    validateOnUpdateHallType
} = require('../models/HallType');
const { MovieType } = require('../models/MovieType');
const listJsonResponse = require('../middlewares/listJsonResponse');
const pathParamFilters = require('../middlewares/pathParamsFilter');
const validateReferences = require('../middlewares/validateReferences');
const router = express.Router({ mergeParams: true });
const hallsRouter = require('./halls');

// Re-route to other resource routers
router.use('/:hallTypeId/halls', hallsRouter);

router
    .route('/')
    .get(
        pathParamFilters([
            {
                field: 'compatibleMovieTypes',
                param: 'movieTypeId',
                model: MovieType
            }
        ]),
        listJsonResponse(HallType),
        getHallTypes
    )
    .post(
        validateRequestBody(validateOnCreateHallType),
        validateReferences([
            {
                model: MovieType,
                field: '_id',
                property: 'compatibleMovieTypeIds',
                assignedProperty: 'compatibleMovieTypes'
            }
        ]),
        createHallType
    );

router
    .route('/:id')
    .get(
        validateReferences([
            {
                model: HallType,
                field: '_id',
                param: 'id'
            }
        ]),
        getHallType
    )
    .delete(
        validateReferences([
            {
                model: HallType,
                field: '_id',
                param: 'id'
            }
        ]),
        deleteHallType
    )
    .put(
        validateRequestBody(validateOnUpdateHallType),
        validateReferences([
            {
                model: HallType,
                field: '_id',
                param: 'id'
            },
            {
                model: MovieType,
                field: '_id',
                property: 'compatibleMovieTypeIds',
                assignedProperty: 'compatibleMovieTypes'
            }
        ]),
        updateHallType
    );

module.exports = router;
