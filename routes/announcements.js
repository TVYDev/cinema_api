const express = require('express');
const {
    Announcement,
    validateOnCreateAnnoucement,
    validateOnUpdateAnnouncement
} = require('../models/Announcement');
const { createAnnoucement } = require('../controllers/annoucements');
const validateRequestBody = require('../middlewares/validateRequestBody');
const router = express.Router();

router
    .route('/')
    .post(validateRequestBody(validateOnCreateAnnoucement), createAnnoucement);

module.exports = router;
