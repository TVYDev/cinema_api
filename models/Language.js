const mongoose = require('mongoose');
const Joi = require('joi');

const languageSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        trim: true,
        required: [true, 'Please provide a name'],
        maxlength: [50, 'Name must not be more than 50 characters']
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
languageSchema.pre('findOneAndUpdate', function () {
    this.set({ updatedAt: Date.now() });
});

function validateOnCreateLanguage(language) {
    const schema = Joi.object({
        name: Joi.string().max(50).required()
    });

    return schema.validate(language);
}

function validateOnUpdateLanguage(language) {
    const schema = Joi.object({
        name: Joi.string().max(50)
    });

    return schema.validate(language);
}

exports.Language = mongoose.model('Language', languageSchema);
exports.validateOnCreateLanguage = validateOnCreateLanguage;
exports.validateOnUpdateLanguage = validateOnUpdateLanguage;
