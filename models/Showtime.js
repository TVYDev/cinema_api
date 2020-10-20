const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const validateAvailabilityOfShowtime = require('../helpers/validateAvailabilityOfShowtime');
const ErrorResponse = require('../utils/ErrorResponse');

const showtimeSchema = new mongoose.Schema({
    startedDateTime: {
        type: Date,
        required: [true, 'Please provide a started datetime for showtime'],
        min: Date.now
    },
    endedDateTime: {
        type: Date
    },
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        required: true
    },
    hall: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hall',
        required: true
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
showtimeSchema.pre('findOneAndUpdate', function () {
    this.set({ updatedAt: Date.now() });
});

// Added `endedDateTime` field
showtimeSchema.pre('save', async function (next) {
    try {
        const movie = await this.model('Movie').findById(this.movie);
        const startDateTimeObj = new Date(this.startedDateTime);
        this.endedDateTime = new Date(
            startDateTimeObj.setMinutes(
                startDateTimeObj.getMinutes() + movie.durationInMinutes
            )
        );

        const isAvailable = await validateAvailabilityOfShowtime(this);

        if (!isAvailable) {
            return next(
                new ErrorResponse(
                    'There is no available time for this showtime',
                    400
                )
            );
        }

        next();
    } catch (error) {
        next(error);
    }
});

const validationSchema = {
    startedDateTime: Joi.date().iso().min('now'),
    movieId: Joi.objectId(),
    hallId: Joi.objectId()
};

function validateOnCreateShowtime(showtime) {
    const tmpValidationSchema = { ...validationSchema };
    tmpValidationSchema.startedDateTime = tmpValidationSchema.startedDateTime.required();
    tmpValidationSchema.movieId = tmpValidationSchema.movieId.required();
    tmpValidationSchema.hallId = tmpValidationSchema.hallId.required();

    const schema = Joi.object(tmpValidationSchema);
    return schema.validate(showtime);
}

function validateOnUpdateShowtime(showtime) {
    const tmpValidationSchema = { ...validationSchema };

    const schema = Joi.object(tmpValidationSchema);

    return schema.validate(showtime);
}

exports.Showtime = mongoose.model('Showtime', showtimeSchema);
exports.validateOnCreateShowtime = validateOnCreateShowtime;
exports.validateOnUpdateShowtime = validateOnUpdateShowtime;
