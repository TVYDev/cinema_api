const express = require('express');
const {
    Membership,
    validateOnCreateMembership,
    validateOnUpdateMembership
} = require('../models/Membership');
const {
    getMemberships,
    getMembership,
    createMembership,
    updateMembership,
    deleteMembership
} = require('../controllers/memberships');
const validateRequestBody = require('../middlewares/validateRequestBody');
const validateReferences = require('../middlewares/validateReferences');
const listJsonResponse = require('../middlewares/listJsonResponse');
const router = express.Router();

router
    .route('/')
    .get(listJsonResponse(Membership), getMemberships)
    .post(validateRequestBody(validateOnCreateMembership), createMembership);

router
    .route('/:id')
    .get(
        validateReferences([
            {
                model: Membership,
                field: '_id',
                param: 'id'
            }
        ]),
        getMembership
    )
    .put(
        validateRequestBody(validateOnUpdateMembership),
        validateReferences([
            {
                model: Membership,
                field: '_id',
                param: 'id'
            }
        ]),
        updateMembership
    )
    .delete(
        validateReferences([
            {
                model: Membership,
                field: '_id',
                param: 'id'
            }
        ]),
        deleteMembership
    );

module.exports = router;
