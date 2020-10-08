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
const {
    Cinema,
    validateOnCreateCinema,
    validateOnUpdateCinema
} = require('../models/Cinema');
const validateRequestBody = require('../middlewares/validateRequestBody');
const hallsRouter = require('./halls');

// Re-route to other resource routers
router.use('/:cinemaId/halls', hallsRouter);

router
    .route('/')
    .get(listJsonResponse(Cinema), getCinemas)
    .post(validateRequestBody(validateOnCreateCinema), createCinema);

router
    .route('/:id')
    .get(getCinema)
    .put(validateRequestBody(validateOnUpdateCinema), updateCinema)
    .delete(deleteCinema);

router.route('/:id/photo').put(uploadPhotoCinema);

router.route('/:id/layout-image').put(uploadLayoutImageCinema);

module.exports = router;
