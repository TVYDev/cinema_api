const mongoose = require('mongoose');
const Joi = require('joi');

const hallTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        unique: true,
        maxlength: [50, 'Name must not be more than 100 characters'],
        required: [true, 'Please provide a name']
    },
    description: {
        type: String,
        required: [true, 'Please provide some description']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }
});

const validationSchema = {
    name: Joi.string().max(50),
    description: Joi.string()
};

function validateOnCreateHallType(hallType) {
    const tmpValidationSchema = { ...validationSchema };
    tmpValidationSchema.name = tmpValidationSchema.name.required();
    tmpValidationSchema.description = tmpValidationSchema.description.required();
    const schema = Joi.object(tmpValidationSchema);

    return schema.validate(hallType);
}

function validateOnUpdateHallType(hallType) {
    const tmpValidationSchema = { ...validationSchema };
    const schema = Joi.object(tmpValidationSchema);

    return schema.validate(hallType);
}

exports.HallType = mongoose.model('HallType', hallTypeSchema);
exports.validateOnCreateHallType = validateOnCreateHallType;
exports.validateOnUpdateHallType = validateOnUpdateHallType;
