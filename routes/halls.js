const express = require('express');
const router = express.Router();
const { createHall, getHalls, getHall } = require('../controllers/halls');
const validateRequestBody = require('../middlewares/validateRequestBody');
const { Hall, validateOnCreateHall } = require('../models/Hall');
const listJsonResponse = require('../middlewares/listJsonResponse');

router
    .route('/')
    .get(listJsonResponse(Hall), getHalls)
    .post(validateRequestBody(validateOnCreateHall), createHall);

router.route('/:id').get(getHall);

module.exports = router;
