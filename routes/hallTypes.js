const express = require('express');
const {
    createHallType,
    getHallTypes,
    getHallType
} = require('../controllers/hallTypes');
const validateRequestBody = require('../middlewares/validateRequestBody');
const { HallType, validateOnCreateHallType } = require('../models/HallType');
const listJsonResponse = require('../middlewares/listJsonResponse');
const router = express.Router();

router
    .route('/')
    .get(listJsonResponse(HallType), getHallTypes)
    .post(validateRequestBody(validateOnCreateHallType), createHallType);

router.route('/:id').get(getHallType);

module.exports = router;
