const express = require('express');
const {
    Announcement,
    validateOnCreateAnnoucement,
    validateOnUpdateAnnouncement
} = require('../models/Announcement');
const {
    getAnnouncements,
    getAnnouncement,
    createAnnoucement,
    updateAnnouncement,
    deleteAnnouncement
} = require('../controllers/annoucements');
const listJsonResponse = require('../middlewares/listJsonResponse');
const validateRequestBody = require('../middlewares/validateRequestBody');
const validateReferences = require('../middlewares/validateReferences');
const router = express.Router();

router
    .route('/')
    .get(listJsonResponse(Announcement), getAnnouncements)
    .post(validateRequestBody(validateOnCreateAnnoucement), createAnnoucement);

router
    .route('/:id')
    .get(
        validateReferences([
            {
                model: Announcement,
                field: '_id',
                param: 'id'
            }
        ]),
        getAnnouncement
    )
    .put(
        validateRequestBody(validateOnUpdateAnnouncement),
        validateReferences([
            {
                model: Announcement,
                field: '_id',
                param: 'id'
            }
        ]),
        updateAnnouncement
    )
    .delete(
        validateReferences([
            {
                model: Announcement,
                field: '_id',
                param: 'id'
            }
        ]),
        deleteAnnouncement
    );

module.exports = router;
