const express = require('express');
const {
    Setting,
    validateOnCreateSetting,
    validateOnUpdateSetting
} = require('../models/Setting');
const { createSetting } = require('../controllers/settings');
const validateRequestBody = require('../middlewares/validateRequestBody');
const router = express.Router();

router
    .route('/')
    .post(validateRequestBody(validateOnCreateSetting), createSetting);

module.exports = router;
