const mongoose = require('mongoose');
const geocoder = require('../utils/geocoder');

const cinemaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        unique: true,
        trim: true,
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
            type: Number,
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

// Geocode & create location field
cinemaSchema.pre('save', async function (next) {
    const res = await geocoder.geocode(this.address);
    const loc = res[0];
    this.location = {
        type: 'Point',
        coordinates: [loc.longitude, loc.latitude],
        formattedAddress: loc.formattedAddress,
        street: loc.streetName,
        city: loc.city,
        state: loc.stateCode,
        zipcode: loc.zipcode,
        country: loc.countryCode
    };

    next();
});

module.exports = mongoose.model('Cinema', cinemaSchema);
