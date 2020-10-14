const mongoose = require('mongoose');
const Joi = require('joi');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        trim: true,
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
genreSchema.pre('findOneAndUpdate', function () {
    this.set({ updatedAt: Date.now() });
});

const validationSchema = {
    name: Joi.string().max(50),
    description: Joi.string()
};

function validateOnCreateGenre(genre) {
    const tmpValidationSchema = { ...validationSchema };
    tmpValidationSchema.name = tmpValidationSchema.name.required();
    tmpValidationSchema.description = tmpValidationSchema.description.required();

    const schema = Joi.object(tmpValidationSchema);

    return schema.validate(genre);
}

function validateOnUpdateGenre(genre) {
    const tmpValidationSchema = { ...validationSchema };
    const schema = Joi.object(tmpValidationSchema);

    return schema.validate(genre);
}

exports.Genre = mongoose.model('Genre', genreSchema);
exports.validateOnCreateGenre = validateOnCreateGenre;
exports.validateOnUpdateGenre = validateOnUpdateGenre;
