const mongoose = require('mongoose');
const Joi = require('joi');
const ErrorResponse = require('../utils/ErrorResponse');

const annoucementSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please provide a title'],
        maxlength: [250, 'Title must not be more than 250 characters']
    },
    description: {
        type: String,
        required: [true, 'Please provide some description']
    },
    image: {
        type: String,
        default: 'no-photo.png'
    },
    startedDateTime: {
        type: Date,
        default: Date.now
    },
    endedDateTime: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }
});

// Validate 'endedDateTime` field
annoucementSchema.pre('save', function (next) {
    if (this.endedDateTime < this.startedDateTime) {
        return next(
            new ErrorResponse(
                'endedDateTime must be greater or equal to startedDateTime',
                400
            )
        );
    }
    next();
});

// Validate `startedDateTime`, `endedDateTime` fields when updating
annoucementSchema.pre('findOneAndUpdate', async function (next) {
    const announcementObj = await this.findOne(this.getFilter());
    const updates = this.getUpdate();
    let isValid = true;
    if (updates.startedDateTime && updates.endedDateTime) {
        if (
            new Date(updates.endedDateTime) < new Date(updates.startedDateTime)
        ) {
            isValid = false;
        }
    } else {
        if (
            new Date(announcementObj.endedDateTime) <
                new Date(updates.startedDateTime) ||
            new Date(announcementObj.startedDateTime) >
                new Date(updates.endedDateTime)
        ) {
            isValid = false;
        }
    }

    if (!isValid) {
        return next(
            new ErrorResponse(
                'endedDateTime must be greater or equal to startedDateTime',
                400
            )
        );
    }
    next();
});

// Create `updatedAt` field
annoucementSchema.pre('findOneAndUpdate', function () {
    this.set({ updatedAt: Date.now() });
});

const validationSchema = {
    title: Joi.string().trim().max(250),
    description: Joi.string(),
    image: Joi.string(),
    startedDateTime: Joi.date().iso().min('now'),
    endedDateTime: Joi.date().iso().min('now')
};

function validateOnCreateAnnoucement(annoucement) {
    const tmpValidationSchema = { ...validationSchema };
    tmpValidationSchema.title = tmpValidationSchema.title.required();
    tmpValidationSchema.description = tmpValidationSchema.description.required();

    const schema = Joi.object(tmpValidationSchema);

    return schema.validate(annoucement);
}

function validateOnUpdateAnnouncement(announcement) {
    const tmpValidationSchema = { ...validationSchema };

    const schema = Joi.object(tmpValidationSchema);

    return schema.validate(announcement);
}

exports.Announcement = mongoose.model('Announcement', annoucementSchema);
exports.validateOnCreateAnnoucement = validateOnCreateAnnoucement;
exports.validateOnUpdateAnnouncement = validateOnUpdateAnnouncement;
