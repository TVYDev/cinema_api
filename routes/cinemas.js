const express = require('express');
const router = express.Router();
const {
    getCinemas,
    createCinema,
    getCinema,
    updateCinema,
    deleteCinema,
    uploadPhotoCinema,
    uploadLayoutImageCinema
} = require('../controllers/cinemas');
const listJsonResponse = require('../middlewares/listJsonResponse');
const Cinema = require('../models/Cinema');

router
    .route('/')
    .get(listJsonResponse(Cinema, null), getCinemas)
    .post(createCinema);

router.route('/:id').get(getCinema).put(updateCinema).delete(deleteCinema);

router.route('/:id/photo').put(uploadPhotoCinema);

router.route('/:id/layout-image').put(uploadLayoutImageCinema);

module.exports = router;
