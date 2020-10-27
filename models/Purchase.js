const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const purchaseSchema = new mongoose.Schema({
    numberTickets: {
        type: Number,
        required: [true, 'Please provide number of tickets'],
        min: 1
    },
    chosenSeats: {
        type: [String],
        required: true,
        validate: (v) => Array.isArray(v) && v.length > 0
    },
    status: {
        type: String,
        enum: ['initiated', 'created', 'executed'],
        default: 'initiated'
    },
    originalAmount: {
        type: Number,
        required: true
    },
    discount: {
        required: true,
        type: {
            type: String,
            enum: ['flat', 'percent'],
            required: true
        },
        amount: {
            type: Number,
            required: true
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

const validationSchema = {
    numberTickets: Joi.number().min(1).integer(),
    chosenSeats: Joi.array().items(Joi.string()),
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
