const geocoder = require('../utils/geocoder');

const getLocationData = async (address) => {
    const res = await geocoder.geocode(address);
    const loc = res[0];

    return {
        type: 'Point',
        coordinates: [loc.longitude, loc.latitude],
        formattedAddress: loc.formattedAddress,
        street: loc.streetName,
        city: loc.city,
        state: loc.stateCode,
        zipcode: loc.zipcode,
        country: loc.countryCode
    };
};

module.exports = getLocationData;
