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

showtimeSchema.pre('findOneAndUpdate', async function (next) {
    try {
        const docToUpdate = await this.model.findOne(this.getFilter());
        const updates = this.getUpdate();
        for (key in updates) {
            docToUpdate[key] = updates[key];
        }

        const endedDateTime = await validateDateTimeBeforeSaveOrUpdate(
            docToUpdate,
            next
        );
        this.set({ updatedAt: Date.now(), endedDateTime });
    } catch (error) {
        next(error);
    }
});

showtimeSchema.pre('save', async function (next) {
    await validateDateTimeBeforeSaveOrUpdate(this, next);
});

async function validateDateTimeBeforeSaveOrUpdate(showtimeObj, next) {
    const movie = await showtimeObj.model('Movie').findById(showtimeObj.movie);
    const startDateTimeObj = new Date(showtimeObj.startedDateTime);
    showtimeObj.endedDateTime = new Date(
        startDateTimeObj.setMinutes(
            startDateTimeObj.getMinutes() + movie.durationInMinutes
        )
    );

    const isAvailable = await validateAvailabilityOfShowtime(showtimeObj);

    if (!isAvailable) {
        return next(
            new ErrorResponse(
                'There is no available time for this showtime',
                400
            )
        );
    }

    return showtimeObj.endedDateTime;
}

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
