const mongoose = require('mongoose');
const Joi = require('joi');

const settingSchema = new mongoose.Schema({
    key: {
        type: String,
        trim: true,
        unique: true,
        required: [true, 'Please provide a key'],
        maxlength: [50, 'Key must not be more than 50 characters'],
        lowercase: true
    },
    value: {
        type: mongoose.Schema.Types.Mixed,
        required: [true, 'Please provide a value']
    },
    type: {
        type: String,
        enum: ['number', 'string', 'json'],
        required: [true, 'Please define type of value']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }
});

// Get setting value
settingSchema.statics.getValue = async function (key) {
    const setting = await this.findOne({ key });
    if (!setting) {
        return undefined;
    }

    let value;
    switch (setting.type) {
        case 'number':
            value = Number(setting.value);
            break;
        case 'json':
            value = JSON.parse(setting.value);
            break;
        case 'string':
        default:
            value = String(setting.value);
            break;
    }

    return value;
};

// Create `updatedAt` field
settingSchema.pre('findOneAndUpdate', function () {
    this.set({ updatedAt: Date.now() });
});

const validationSchema = {
    key: Joi.string()
        .max(50)
        .trim()
        .pattern(/^[^\s]+$/)
        .lowercase(),
    value: Joi.alternatives().try(Joi.string(), Joi.number()),
    type: Joi.any().allow('number', 'string', 'json')
};

function validateOnCreateSetting(setting) {
    const tmpValidationSchema = { ...validationSchema };
    tmpValidationSchema.key = tmpValidationSchema.key.required();
    tmpValidationSchema.value = tmpValidationSchema.value.required();
    tmpValidationSchema.type = tmpValidationSchema.type.required();

    const schema = Joi.object(tmpValidationSchema);

    return schema.validate(setting);
}

function validateOnUpdateSetting(setting) {
    const tmpValidationSchema = { ...validationSchema };
    const schema = Joi.object(tmpValidationSchema);

    return schema.validate(setting);
}

exports.Setting = mongoose.model('Setting', settingSchema);
exports.validateOnCreateSetting = validateOnCreateSetting;
exports.validateOnUpdateSetting = validateOnUpdateSetting;
