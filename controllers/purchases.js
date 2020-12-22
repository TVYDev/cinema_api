const mongoose = require('mongoose');
const {
  Purchase,
  STATUS_INITIATED,
  STATUS_CREATED,
  STATUS_EXECUTED
} = require('../models/Purchase');
const { Showtime } = require('../models/Showtime');
const { Hall } = require('../models/Hall');
const asyncHandler = require('../middlewares/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');

/**
 * @swagger
 * /purchases:
 *  get:
 *      tags:
 *          - 🎫 Purchases
 *      summary: Get all purchases
 *      description: (PUBLIC) Retrieve all purchases with filtering, sorting & pagination
 *      parameters:
 *          -   in: query
 *              name: select
 *              schema:
 *                  type: string
 *              description: Fields to be selected (Multiple fields separated by comma [,])
 *              example: status, numberTickets
 *          -   in: query
 *              name: sort
 *              schema:
 *                  type: string
 *              description: Sort by field (Prefix the field with minus [-] for descending ordering)
 *              example: name,-createdAt
 *          -   in: query
 *              name: limit
 *              schema:
 *                  type: string
 *              default: 20
 *              description: Limit numbers of record for a page
 *              example: 10
 *          -   in: query
 *              name: page
 *              default: 1
 *              schema:
 *                  type: string
 *              description: Certain page index for records to be retrieved
 *              example: 1
 *          -   in: query
 *              name: paging
 *              default: true
 *              schema:
 *                  type: string
 *              description: Define whether need records in pagination
 *              example: false
 *      responses:
 *          200:
 *              description: OK
 *          500:
 *              description: Internal server error
 */
exports.getPurchases = asyncHandler(async (req, res, next) => {
  res.standard(200, true, 'Success', res.listJsonData);
});

/**
 * @swagger
 * /purchases/initiate:
 *  post:
 *      tags:
 *          - 🎫 Purchases
 *      summary: Initiate a purchase
 *      description: (Private) Initiate a purchase (Reserve time for seat selection)
 *      parameters:
 *          -   in: body
 *              name: Purchase
 *              description: Purhase to be initiated
 *              schema:
 *                  type: object
 *                  required:
 *                      - numberTickets
 *                      - showtimeId
 *                  properties:
 *                      numberTickets:
 *                          type: number
 *                          min: 1
 *                          example: 2
 *                      showtimeId:
 *                          type: string
 *                          description: Object ID of showtime
 *                          example: 5f8e536d47915a3dc00eab39
 *      responses:
 *          200:
 *              description: OK
 *          400:
 *              description: Validation error
 *          404:
 *              description: Showtime is not found
 *          500:
 *              description: Internal server error
 */
exports.initiatePurchase = asyncHandler(async (req, res, next) => {
  const purchase = await Purchase.create(req.body);

  res.standard(201, true, 'Purchase is initiated successfully', purchase);
});

/**
 * @swagger
 * /purchases/{id}/create:
 *  put:
 *      tags:
 *          - 🎫 Purchases
 *      summary: Create a purchase
 *      description: (Private) Create a purchase (For confirmation screen)
 *      parameters:
 *          -   in: path
 *              name: id
 *              required: true
 *              description: Object ID of purchase
 *              example: 5fa251844a60234de83080de
 *          -   in: body
 *              name: Purchase
 *              description: Purchase information for creation
 *              schema:
 *                  type: object
 *                  required:
 *                      - chosenSeats
 *                  properties:
 *                      chosenSeats:
 *                          type: array
 *                          items:
 *                              type: string
 *                          example: ["A1", "A2"]
 *      responses:
 *          200:
 *              description: OK
 *          400:
 *              description: Validation error
 *          404:
 *              description: Purchase is not found
 *          500:
 *              description: Internal server error
 */
exports.createPurchase = asyncHandler(async (req, res, next) => {
  const { purchaseDoc, chosenSeats } = req.body;

  if (purchaseDoc.status !== STATUS_INITIATED) {
    return next(
      new ErrorResponse(
        'Purchase with given ID is not in initiated status',
        400
      )
    );
  }

  const expiredSelectionDateTime = new Date(purchaseDoc.expiredSeatSelectionAt);
  if (expiredSelectionDateTime.getTime() < new Date().getTime()) {
    return next(
      new ErrorResponse('Seats selection period had been already expired', 400)
    );
  }

  if (req.body.chosenSeats.length !== purchaseDoc.chosenSeats.length) {
    return next(
      new ErrorResponse('Number of chosen seats is not correct', 400)
    );
  }

  // -- Find seat label already selected
  const existingPurchases = await Purchase.aggregate([
    {
      $match: { _id: { $ne: new mongoose.Types.ObjectId(req.params.id) } }
    },
    {
      $group: {
        _id: '$showtime',
        seats: { $push: '$chosenSeats' }
      }
    },
    {
      $project: {
        _id: '$showtime',
        chosenSeats: {
          $reduce: {
            input: '$seats',
            initialValue: [],
            in: {
              $concatArrays: ['$$this', '$$value']
            }
          }
        }
      }
    }
  ]);
  if (
    existingPurchases.length > 0 &&
    chosenSeats.some(
      (cs) => existingPurchases[0].chosenSeats.indexOf(cs) !== -1
    )
  ) {
    return next(new ErrorResponse('Seat is already selected', 400));
  }

  // Check if seats label is correct
  const showtime = await Showtime.findById(purchaseDoc.showtime);
  const hall = await Hall.findById(showtime.hall);
  let numberCorrectSeatLabel = 0;
  for (row of hall.seatRows) {
    for (col of hall.seatColumns) {
      for (seats of chosenSeats) {
        if (seats === `${row}${col}`) {
          numberCorrectSeatLabel++;
        }
      }
    }
  }
  if (numberCorrectSeatLabel !== purchaseDoc.numberTickets) {
    return next(new ErrorResponse('Seat label is invalid', 400));
  }

  const purchase = await Purchase.findByIdAndUpdate(
    req.params.id,
    { status: STATUS_CREATED, chosenSeats: req.body.chosenSeats },
    { new: true, runValidators: true }
  );

  res.standard(200, true, 'Purchase is created successfully', purchase);
});

/**
 * @swagger
 * /purchases/{id}/execute:
 *  put:
 *      tags:
 *          - 🎫 Purchases
 *      summary: Execute a purchase
 *      description: (Private) Execute a purchase
 *      parameters:
 *          -   in: path
 *              name: id
 *              required: true
 *              description: Object ID of purchase
 *              example: 5fa251844a60234de83080de
 *      responses:
 *          200:
 *              description: OK
 *          404:
 *              description: Purchase is not found
 *          500:
 *              description: Internal server error
 */
exports.executePurchase = asyncHandler(async (req, res, next) => {
  const { purchaseDoc } = req.body;

  if (purchaseDoc.status !== STATUS_CREATED) {
    return next(
      new ErrorResponse('Purchase with given ID is not in created status', 400)
    );
  }

  const qrCode = await purchaseDoc.generateQrCode();
  if (!qrCode) {
    return next(new ErrorResponse('Unable to create QR code', 500));
  }

  const purchase = await Purchase.findByIdAndUpdate(
    req.params.id,
    {
      status: STATUS_EXECUTED,
      paymentAmount: purchaseDoc.originalAmount,
      paymentDateTime: Date.now(),
      qrCodeImage: qrCode
    },
    { new: true, runValidators: true }
  );

  res.standard(200, true, 'Purchase is executed successfully', purchase);
});
