const mongoose = require('mongoose');
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

// Update `location` field and create `updatedAt` field
cinemaSchema.pre('findOneAndUpdate', async function () {
    let dataForAutoUpdate = { updatedAt: Date.now() };

    if (this.getUpdate().address !== undefined) {
        const location = await getLocationData(this.getUpdate().address);
        dataForAutoUpdate.location = location;
    }

    this.set(dataForAutoUpdate);
});

module.exports = mongoose.model('Cinema', cinemaSchema);
