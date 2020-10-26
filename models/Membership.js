const mongoose = require('mongoose');
const Joi = require('joi');

const membershipSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        unique: true,
        required: [true, 'Please provide a name'],
        maxlength: [50, 'Name must not be more than 50 characters']
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

// Create `updatedAt` field
membershipSchema.pre('findOneAndUpdate', function () {
    this.set({ updatedAt: Date.now() });
});

const validationSchema = {
    name: Joi.string().trim().max(50),
    description: Joi.string()
};

function validateOnCreateMembership(membership) {
    const tmpValidationSchema = { ...validationSchema };
    tmpValidationSchema.name = tmpValidationSchema.name.required();
    tmpValidationSchema.description = tmpValidationSchema.description.required();

    const schema = Joi.object(tmpValidationSchema);

    return schema.validate(membership);
}

function validateOnUpdateMembership(membership) {
    const tmpValidationSchema = { ...validationSchema };

    const schema = Joi.object(tmpValidationSchema);

    return schema.validate(membership);
}

exports.Membership = mongoose.model('Membership', membershipSchema);
exports.validateOnCreateMembership = validateOnCreateMembership;
exports.validateOnUpdateMembership = validateOnUpdateMembership;
