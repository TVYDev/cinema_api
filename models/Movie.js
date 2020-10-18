const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title'],
        trim: true,
        unique: true,
        maxlength: [100, 'Name must not be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please provide some description']
    },
    ticketPrice: {
        type: Number,
        required: [true, 'Please provide a ticket price'],
        min: [0, 'Ticket price must not be less than zero']
    },
    durationInMinutes: {
        type: Number,
        required: [true, 'Please provide duration in minutes'],
        min: [0, 'Duration in minutes must not be less than zero']
    },
    releasedDate: {
        type: Date,
        required: [true, 'Please provide released date of this movie']
    },
    trailerUrl: {
        type: String,
        match: /(https?:\/\/)?([\w\-])+\.{1}([a-zA-Z]{2,63})([\/\w-]*)*\/?\??([^#\n\r]*)?#?([^\n\r]*)/
    },
    posterUrl: {
        type: String,
        match: /(https?:\/\/)?([\w\-])+\.{1}([a-zA-Z]{2,63})([\/\w-]*)*\/?\??([^#\n\r]*)?#?([^\n\r]*)/
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    },
    genres: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Genre',
            required: true
        }
    ],
    movieType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MovieType',
        required: true
    },
    spokenLanguage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Language',
        required: true
    },
    subtitleLanguage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Language',
        required: true
    },
    country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country',
        required: true
    }
});

// Create `updatedAt` field
movieSchema.pre('findOneAndUpdate', function () {
    this.set({ updatedAt: Date.now() });
});

const validationSchema = {
    title: Joi.string().max(100),
    description: Joi.string(),
    ticketPrice: Joi.number().positive().precision(2),
    durationInMinutes: Joi.number().integer().positive(),
    releasedDate: Joi.date().iso(),
    trailerUrl: Joi.string(),
    posterUrl: Joi.string(),
    genreIds: Joi.array().items(Joi.objectId()).min(1),
    movieTypeId: Joi.objectId(),
    spokenLanguageId: Joi.objectId(),
    subtitleLanguageId: Joi.objectId(),
    countryId: Joi.objectId()
};

function validateOnCreateMovie(movie) {
    const tmpValidationSchema = { ...validationSchema };
    tmpValidationSchema.title = tmpValidationSchema.title.required();
    tmpValidationSchema.description = tmpValidationSchema.description.required();
    tmpValidationSchema.ticketPrice = tmpValidationSchema.ticketPrice.required();
    tmpValidationSchema.durationInMinutes = tmpValidationSchema.durationInMinutes.required();
    tmpValidationSchema.releasedDate = tmpValidationSchema.releasedDate.required();
    tmpValidationSchema.genreIds = tmpValidationSchema.genreIds.required();
    tmpValidationSchema.movieTypeId = tmpValidationSchema.movieTypeId.required();
    tmpValidationSchema.spokenLanguageId = tmpValidationSchema.spokenLanguageId.required();
    tmpValidationSchema.subtitleLanguageId = tmpValidationSchema.subtitleLanguageId.required();
    tmpValidationSchema.countryId = tmpValidationSchema.countryId.required();

    const schema = Joi.object(tmpValidationSchema);

    return schema.validate(movie);
}

function validateOnUpdateMovie(movie) {
    const tmpValidationSchema = { ...validationSchema };
    const schema = Joi.object(tmpValidationSchema);

    return schema.validate(movie);
}

exports.Movie = mongoose.model('Movie', movieSchema);
exports.validateOnCreateMovie = validateOnCreateMovie;
exports.validateOnUpdateMovie = validateOnUpdateMovie;
