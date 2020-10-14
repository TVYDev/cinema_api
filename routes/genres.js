const express = require('express');
const router = express.Router();
const {
    Genre,
    validateOnCreateGenre,
    validateOnUpdateGenre
} = require('../models/Genre');
const validateRequestBody = require('../middlewares/validateRequestBody');
const listJsonResponse = require('../middlewares/listJsonResponse');
const { createGenre, getGenres } = require('../controllers/genres');

router
    .route('/')
    .get(listJsonResponse(Genre), getGenres)
    .post(validateRequestBody(validateOnCreateGenre), createGenre);

module.exports = router;
