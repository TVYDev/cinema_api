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
        required: [true, 'Please define rows of hall seats'],
        validate: (v) => Array.isArray(v) && v.length > 0
    },
    seatColumns: {
        type: [String],
        required: [true, 'Please define columns of hall seats'],
        validate: (v) => Array.isArray(v) && v.length > 0
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

// Create `updatedAt` field
hallSchema.pre('findOneAndUpdate', function () {
    this.set({ updatedAt: Date.now() });
});

const validationSchema = {
    name: Joi.string().min(5).max(100),
    seatRows: Joi.array().items(
        Joi.alternatives().try(Joi.string(), Joi.number())
    ),
    seatColumns: Joi.array().items(
        Joi.alternatives().try(Joi.string(), Joi.number())
    ),
    locationImage: Joi.string()
};

function validateOnCreateHall(hall) {
    const tmpValidationSchema = { ...validationSchema };
    tmpValidationSchema.name = tmpValidationSchema.name.required();
    tmpValidationSchema.seatRows = tmpValidationSchema.seatRows.required();
    tmpValidationSchema.seatColumns = tmpValidationSchema.seatColumns.required();
    const schema = Joi.object(tmpValidationSchema);

    return schema.validate(hall);
}

function validateOnUpdateHall(hall) {
    const tmpValidationSchema = { ...validationSchema };
    const schema = Joi.object(tmpValidationSchema);

    return schema.validate(hall);
}

exports.Hall = mongoose.model('Hall', hallSchema);
exports.validateOnCreateHall = validateOnCreateHall;
exports.validateOnUpdateHall = validateOnUpdateHall;
