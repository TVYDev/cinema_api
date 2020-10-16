const express = require('express');
// Set `mergeParams: true` to allow re-route router resource, e.g. from cinemas routes in this case
const router = express.Router({ mergeParams: true });
const {
    addHall,
    getHalls,
    getHall,
    updateHall,
    deleteHall,
    uploadLocationImageHall
} = require('../controllers/halls');
const validateRequestBody = require('../middlewares/validateRequestBody');
const {
    Hall,
    validateOnCreateHall,
    validateOnUpdateHall
} = require('../models/Hall');
const { Cinema } = require('../models/Cinema');
const { HallType } = require('../models/HallType');
const pathParamsFilter = require('../middlewares/pathParamsFilter');
const listJsonResponse = require('../middlewares/listJsonResponse');
const validateReferences = require('../middlewares/validateReferences');

router
    .route('/')
    .get(
        pathParamsFilter([
            { field: 'cinema', param: 'cinemaId', model: Cinema },
            { field: 'hallType', param: 'hallTypeId', model: HallType }
        ]),
        listJsonResponse(Hall),
        getHalls
    )
    .post(
        validateRequestBody(validateOnCreateHall),
        validateReferences([
            {
                model: Cinema,
                field: '_id',
                param: 'cinemaId',
                assignedProperty: 'cinema'
            },
            {
                model: HallType,
                field: '_id',
                property: 'hallTypeId',
                assignedProperty: 'hallType'
            }
        ]),
        addHall
    );

router
    .route('/:id')
    .delete(
        validateReferences([
            {
                model: Hall,
                field: '_id',
                param: 'id'
            }
        ]),
        deleteHall
    )
    .get(
        validateReferences([
            {
                model: Hall,
                field: '_id',
                param: 'id'
            }
        ]),
        getHall
    )
    .put(
        validateRequestBody(validateOnUpdateHall),
        validateReferences([
            {
                model: Hall,
                field: '_id',
                param: 'id'
            },
            {
                model: Cinema,
                field: '_id',
                property: 'cinemaId',
                assignedProperty: 'cinema'
            },
            {
                model: HallType,
                field: '_id',
                property: 'hallTypeId',
                assignedProperty: 'hallType'
            }
        ]),
        updateHall
    );

router.route('/:id/location-image').put(
    validateReferences([
        {
            model: Hall,
            field: '_id',
            param: 'id'
        }
    ]),
    uploadLocationImageHall
);

module.exports = router;
