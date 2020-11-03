const mongoose = require('mongoose');
const Joi = require('joi');
const ErrorResponse = require('../utils/ErrorResponse');
Joi.objectId = require('joi-objectid')(Joi);

const purchaseSchema = new mongoose.Schema({
    numberTickets: {
        type: Number,
        required: [true, 'Please provide number of tickets'],
        min: 1
    },
    chosenSeats: {
        type: [String]
    },
    status: {
        type: String,
        enum: ['initiated', 'created', 'executed'],
        default: 'initiated'
    },
    originalAmount: {
        type: Number
    },
    discount: {
        type: {
            type: String,
            enum: ['flat', 'percent'],
            required: true,
            default: 'flat'
        },
        amount: {
            type: Number,
            required: true,
            default: 0
        }
    },
    paymentAmount: {
        type: Number
    },
    paymentDate: {
        type: Date
    },
    qrcodeImage: {
        type: String,
        default: 'no-photo.png'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    },
    showtime: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Showtime',
        required: true
    }
});

// Create `updatedAt` field
purchaseSchema.pre('findOneAndUpdate', function () {
    this.set({ updatedAt: Date.now() });
});

purchaseSchema.pre('save', async function (next) {
    // Update `originalAmount` field
    const showtime = await this.model('Showtime').findById(this.showtime);
    const movie = await this.model('Movie').findById(showtime.movie);
    this.originalAmount = movie.ticketPrice * this.numberTickets;

    // Check for remaining seats for initiation
    const hall = await this.model('Hall').findById(showtime.hall);
    const numberTotalSeats = hall.seatRows.length * hall.seatColumns.length;

    // -- Find number of seats, seat label already selected
    const existingPurchases = await this.constructor.aggregate([
        {
            $group: {
                _id: '$showtime',
                numberTotalTickets: { $sum: '$numberTickets' },
                seats: { $push: '$chosenSeats' }
            }
        },
        {
            $project: {
                _id: '$showtime',
                numberTotalTickets: '$numberTotalTickets',
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

    if (numberTotalSeats - existingPurchases[0].numberTotalTickets < 0) {
        return next(
            new ErrorResponse(
                'Not enough remaining seats in this showtime',
                400
            )
        );
    }

    // If there are available seats, set chosenSeats with random remaining seats based on number of tickets
    const tmpReservedSeats = [];
    let tmpSeat;
    let tmpNumberTickets = this.numberTickets;
    for (row of hall.seatRows) {
        for (col of hall.seatColumns) {
            if (tmpNumberTickets == 0) {
                break;
            }

            tmpSeat = `${row}${col}`;
            if (!existingPurchases[0].chosenSeats.includes(tmpSeat)) {
                tmpReservedSeats.push(tmpSeat);
                tmpNumberTickets--;
            }
        }
    }
    this.chosenSeats = tmpReservedSeats;
});

const validationSchema = {
    numberTickets: Joi.number().min(1).integer(),
    chosenSeats: Joi.array().items(Joi.string()).min(1),
    showtimeId: Joi.objectId()
};

function validateOnInitiatePurchase(purchase) {
    const tmpValidationSchema = { ...validationSchema };
    tmpValidationSchema.numberTickets = tmpValidationSchema.numberTickets.required();
    tmpValidationSchema.showtimeId = tmpValidationSchema.showtimeId.required();
    delete tmpValidationSchema.chosenSeats;

    const schema = Joi.object(tmpValidationSchema);

    return schema.validate(purchase);
}

function validateOnCreatePurchase(purchase) {
    const tmpValidationSchema = { ...validationSchema };
    tmpValidationSchema.chosenSeats = tmpValidationSchema.chosenSeats.required();
    delete tmpValidationSchema.numberTickets;
    delete tmpValidationSchema.showtimeId;

    const schema = Joi.object(tmpValidationSchema);

    return schema.validate(purchase);
}

exports.Purchase = mongoose.model('Purchase', purchaseSchema);
exports.validateOnInitiatePurchase = validateOnInitiatePurchase;
exports.validateOnCreatePurchase = validateOnCreatePurchase;
