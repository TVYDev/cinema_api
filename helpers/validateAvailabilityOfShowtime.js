const { Setting } = require('../models/Setting');

const validateAvailabilityOfShowtime = async (showtimeObj) => {
    const {
        startedDateTime,
        endedDateTime,
        constructor: ShowtimeModel,
        hall
    } = showtimeObj;

    const minMinutesIntervalShowtime = await Setting.getValue(
        'min_minutes_interval_showtime'
    );

    const startedDateTimeObj = new Date(startedDateTime);
    const beforeStartedDateTime = startedDateTimeObj.setMinutes(
        startedDateTimeObj.getMinutes() - minMinutesIntervalShowtime
    );
    const endedDateTimeObj = new Date(endedDateTime);
    const afterEndedDateTime = endedDateTimeObj.setMinutes(
        endedDateTimeObj.getMinutes() + minMinutesIntervalShowtime
    );

    const showtimes = await ShowtimeModel.find({
        $and: [
            { endedDateTime: { $gt: new Date(beforeStartedDateTime) } },
            { startedDateTime: { $lt: new Date(afterEndedDateTime) } },
            { hall }
        ]
    });

    return !(showtimes.length > 0);
};

module.exports = validateAvailabilityOfShowtime;
