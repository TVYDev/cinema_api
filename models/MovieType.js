const Joi = require('joi');
const mongoose = require('mongoose');

const movieTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        unique: true,
        required: [true, 'Please provide a name'],
        maxlength: [50, 'Name must be more than 50 characters']
    },
    description: {
        type: String,
        required: [true, 'Please provide a description']
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
movieTypeSchema.pre('findOneAndUpdate', function () {
    this.set({ updatedAt: Date.now() });
});

const validationSchema = {
    name: Joi.string().max(50),
    description: Joi.string()
};

function validateOnCreateMovieType(movieType) {
    const tmpValidationSchema = { ...validationSchema };
    tmpValidationSchema.name = tmpValidationSchema.name.required();
    tmpValidationSchema.description = tmpValidationSchema.description.required();

    const schema = Joi.object(tmpValidationSchema);
    return schema.validate(movieType);
}

function validateOnUpdateMovieType(movieType) {
    const tmpValidationSchema = { ...validationSchema };
    
    const schema = Joi.object(tmpValidationSchema);
    return schema.validate(movieType);
}

exports.MovieType = mongoose.model('MovieType', movieTypeSchema);
exports.validateOnCreateMovieType = validateOnCreateMovieType;
exports.validateOnUpdateMovieType = validateOnUpdateMovieType;