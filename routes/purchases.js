const express = require('express');
const {
    Purchase,
    validateOnInitiatePurchase,
    validateOnCreatePurchase
} = require('../models/Purchase');
const { Showtime } = require('../models/Showtime');
const {
    initiatePurchase,
    createPurchase
} = require('../controllers/purchases');
const validateRequestBody = require('../middlewares/validateRequestBody');
const validateReferences = require('../middlewares/validateReferences');
const listJsonResponse = require('../middlewares/listJsonResponse');
const router = express.Router();

router.post(
    '/initiate',
    validateRequestBody(validateOnInitiatePurchase),
    validateReferences([
        {
            model: Showtime,
            field: '_id',
            property: 'showtimeId',
            assignedProperty: 'showtime'
        }
    ]),
    initiatePurchase
);

router.put(
    '/:id/create',
    validateRequestBody(validateOnCreatePurchase),
    validateReferences([
        {
            model: Purchase,
            field: '_id',
            param: 'id',
            assignedRefResource: 'purchaseDoc'
        }
    ]),
    createPurchase
);

module.exports = router;
