const express = require('express');
const router = express.Router();
const {
    getCinemas,
    createCinema,
    getCinema,
    updateCinema
} = require('../controllers/cinemas');
const listJsonResponse = require('../middlewares/listJsonResponse');
const Cinema = require('../models/Cinema');

router
    .route('/')
    .get(listJsonResponse(Cinema, null), getCinemas)
    .post(createCinema);

router.route('/:id').get(getCinema).put(updateCinema);

module.exports = router;
