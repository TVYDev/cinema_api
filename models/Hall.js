const Joi = require('joi');
const mongoose = require('mongoose');

const hallSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true,
        unique: true,
        minlength: [5, 'Name must not be less than 5 characters'],
        maxlength: [100, 'Name must not be more than 100 characters']
    },
    seatRows: {
        type: [String],
        required: [true, 'Please define rows of hall seats']
    },
    seatColumns: {
        type: [String],
        required: [true, 'Please define columns of hall seats']
    },
    locationImage: {
        type: String,
        default: 'no-photo.jpg'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }
});

async function validateHall(hall) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(100).required(),
        seatRows: Joi.array().items(
            Joi.alternatives().try(Joi.string(), Joi.number())
        ),
        seatColumns: Joi.array().items(
            Joi.alternatives().try(Joi.string(), Joi.number())
        ),
        locationImage: Joi.string()
    });

    return schema.validate(hall);
}

exports.Hall = mongoose.model('Hall', hallSchema);
exports.validateHall = validateHall;
