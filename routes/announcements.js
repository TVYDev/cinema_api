const express = require('express');
const {
    Announcement,
    validateOnCreateAnnoucement,
    validateOnUpdateAnnouncement
} = require('../models/Announcement');
const {
    createAnnoucement,
    updateAnnouncement
} = require('../controllers/annoucements');
const validateRequestBody = require('../middlewares/validateRequestBody');
const validateReferences = require('../middlewares/validateReferences');
const router = express.Router();

router
    .route('/')
    .post(validateRequestBody(validateOnCreateAnnoucement), createAnnoucement);

router.route('/:id').put(
    validateRequestBody(validateOnUpdateAnnouncement),
    validateReferences([
        {
            model: Announcement,
            field: '_id',
            param: 'id'
        }
    ]),
    updateAnnouncement
);

module.exports = router;
