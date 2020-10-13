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
    .post(validateRequestBody(validateOnCreateHallType), createHallType);

router
    .route('/:id')
    .get(getHallType)
    .delete(deleteHallType)
    .put(validateRequestBody(validateOnUpdateHallType), updateHallType);

module.exports = router;
