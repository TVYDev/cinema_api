const express = require('express');
const router = express.Router();
const {
    createHall,
    getHalls,
    getHall,
    updateHall
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
    .post(validateRequestBody(validateOnCreateHall), createHall);

router
    .route('/:id')
    .get(getHall)
    .put(validateRequestBody(validateOnUpdateHall), updateHall);

module.exports = router;
