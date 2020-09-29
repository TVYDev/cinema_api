const mongoose = require('mongoose');

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
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }
});

module.exports = mongoose.model('Cinema', cinemaSchema);
