const mongoose = require('mongoose');
const Joi = require('joi');

const countrySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true,
        unique: true,
        maxlength: [100, 'Name must not be more than 100 characters']
    },
    code: {
        type: String,
        required: [true, 'Please provide a code'],
        trim: true,
        unique: true,
        maxlength: [2, 'Code must not be more than 2 characters'],
        uppercase: true
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
countrySchema.pre('findOneAndUpdate', function () {
    this.set({ updatedAt: Date.now() });
});

const validationSchema = {
    name: Joi.string().max(100),
    code: Joi.string().max(2)
};

function validateOnCreateCountry(country) {
    const tmpValidationSchema = { ...validationSchema };
    tmpValidationSchema.name = tmpValidationSchema.name.required();
    tmpValidationSchema.code = tmpValidationSchema.code.required();

    const schema = Joi.object(tmpValidationSchema);

    return schema.validate(country);
}

function validateOnUpdateCountry(country) {
    const tmpValidationSchema = { ...validationSchema };
    const schema = Joi.object(tmpValidationSchema);

    return schema.validate(country);
}

exports.Country = mongoose.model('Country', countrySchema);
exports.validateOnCreateCountry = validateOnCreateCountry;
exports.validateOnUpdateCountry = validateOnUpdateCountry;
