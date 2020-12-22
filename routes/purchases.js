const express = require('express');
const {
  Purchase,
  validateOnInitiatePurchase,
  validateOnCreatePurchase
} = require('../models/Purchase');
const { Showtime } = require('../models/Showtime');
const {
  getPurchases,
  getPurchase,
  initiatePurchase,
  createPurchase,
  executePurchase
} = require('../controllers/purchases');
const validateRequestBody = require('../middlewares/validateRequestBody');
const validateReferences = require('../middlewares/validateReferences');
const listJsonResponse = require('../middlewares/listJsonResponse');
const router = express.Router();

router.route('/').get(listJsonResponse(Purchase), getPurchases);

router.route('/:id').get(
  validateReferences([
    {
      model: Purchase,
      field: '_id',
      param: 'id'
    }
  ]),
  getPurchase
);

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

router.put(
  '/:id/execute',
  validateReferences([
    {
      model: Purchase,
      field: '_id',
      param: 'id',
      assignedRefResource: 'purchaseDoc'
    }
  ]),
  executePurchase
);

module.exports = router;
