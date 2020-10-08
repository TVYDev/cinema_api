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
const listJsonResponse = require('../middlewares/listJsonResponse');

router
    .route('/')
    .get(listJsonResponse(Hall), getHalls)
    .post(validateRequestBody(validateOnCreateHall), addHall);

router
    .route('/:id')
    .delete(deleteHall)
    .get(getHall)
    .put(validateRequestBody(validateOnUpdateHall), updateHall);

router.route('/:id/location-image').put(uploadLocationImageHall);

module.exports = router;
