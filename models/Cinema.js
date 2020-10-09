const mongoose = require('mongoose');
const Joi = require('joi');
const getLocationData = require('../helpers/getLocationData');

const cinemaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        unique: true,
        trim: true,
        minlength: [5, 'Name must not be less than 5 characters'],
        maxlength: [100, 'Name must not be more than 100 characters']
    },
    address: {
        type: String,
        required: [true, 'Please provide an address']
    },
    location: {
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String
    },
    photo: {
        type: String,
        default: 'no-photo.png'
    },
    layoutImage: {
        type: String,
        default: 'no-photo.png'
    },
    openingHours: {
        type: String,
        required: [true, 'Please provide opening hours e.g. 7AM - 10PM']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }
});

// Create `location` field
cinemaSchema.pre('save', async function (next) {
    const location = await getLocationData(this.address);
    this.location = location;
    next();
});

// Cascade delete halls of a cinema
cinemaSchema.pre('remove', async function (next) {
    await this.model('Hall').deleteMany({ cinema: this._id });
    next();
});

// Update `location` field and create `updatedAt` field
cinemaSchema.pre('findOneAndUpdate', async function () {
    let dataForAutoUpdate = { updatedAt: Date.now() };

    if (this.getUpdate().address !== undefined) {
        const location = await getLocationData(this.getUpdate().address);
        dataForAutoUpdate.location = location;
    }

    this.set(dataForAutoUpdate);
});

const validationSchema = {
    name: Joi.string().min(5).max(100),
    address: Joi.string(),
    openingHours: Joi.string()
};

function validateOnCreateCinema(cinema) {
    const tmpValidationSchema = { ...validationSchema };
    tmpValidationSchema.name = tmpValidationSchema.name.required();
    tmpValidationSchema.address = tmpValidationSchema.address.required();

    const schema = Joi.object(tmpValidationSchema);

    return schema.validate(cinema);
}

function validateOnUpdateCinema(cinema) {
    const tmpValidationSchema = { ...validationSchema };

    const schema = Joi.object(tmpValidationSchema);

    return schema.validate(cinema);
}

exports.Cinema = mongoose.model('Cinema', cinemaSchema);
exports.validateOnCreateCinema = validateOnCreateCinema;
exports.validateOnUpdateCinema = validateOnUpdateCinema;
