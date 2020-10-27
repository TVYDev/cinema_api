const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const colors = require('colors');

// Load env variables
dotenv.config({ path: './config/.env' });

const { Cinema } = require('../models/Cinema');
const { Hall } = require('../models/Hall');
const { HallType } = require('../models/HallType');
const { MovieType } = require('../models/MovieType');
const { Genre } = require('../models/Genre');
const { Movie } = require('../models/Movie');
const { Language } = require('../models/Language');
const { Country } = require('../models/Country');
const { Showtime } = require('../models/Showtime');
const { Setting } = require('../models/Setting');
const { Announcement } = require('../models/Announcement');
const { Membership } = require('../models/Membership');
const { User } = require('../models/User');

// Connect database
mongoose.connect(process.env.MONGODB_URI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useNewUrlParser: true
});

// Read json files
const cinemas = JSON.parse(
    fs.readFileSync(`${__dirname}/data/cinemas.json`, 'utf8')
);
const halls = JSON.parse(
    fs.readFileSync(`${__dirname}/data/halls.json`, 'utf-8')
);
const hallTypes = JSON.parse(
    fs.readFileSync(`${__dirname}/data/hallTypes.json`, 'utf-8')
);
const movieTypes = JSON.parse(
    fs.readFileSync(`${__dirname}/data/movieTypes.json`, 'utf-8')
);
const genres = JSON.parse(
    fs.readFileSync(`${__dirname}/data/genres.json`, 'utf-8')
);
const movies = JSON.parse(
    fs.readFileSync(`${__dirname}/data/movies.json`, 'utf-8')
);
const languages = JSON.parse(
    fs.readFileSync(`${__dirname}/data/languages.json`, 'utf-8')
);
const countries = JSON.parse(
    fs.readFileSync(`${__dirname}/data/countries.json`, 'utf-8')
);
const showtimes = JSON.parse(
    fs.readFileSync(`${__dirname}/data/showtimes.json`, 'utf-8')
);
const settings = JSON.parse(
    fs.readFileSync(`${__dirname}/data/settings.json`, 'utf-8')
);
const announcements = JSON.parse(
    fs.readFileSync(`${__dirname}/data/announcements.json`, 'utf-8')
);
const membershps = JSON.parse(
    fs.readFileSync(`${__dirname}/data/memberships.json`, 'utf-8')
);
const users = JSON.parse(
    fs.readFileSync(`${__dirname}/data/users.json`, 'utf-8')
);

const importData = async () => {
    try {
        await Setting.create(settings);
        await Cinema.create(cinemas);
        await HallType.create(hallTypes);
        await MovieType.create(movieTypes);
        await Hall.create(halls);
        await Genre.create(genres);
        await Language.create(languages);
        await Country.create(countries);
        await Movie.create(movies);
        await Showtime.create(showtimes);
        await Announcement.create(announcements);
        await Membership.create(membershps);
        await User.create(users);

        console.log('Data imported'.blue.inverse);
        process.exit();
    } catch (err) {
        console.log(err);
    }
};

const destroyData = async () => {
    try {
        await Movie.deleteMany();
        await Hall.deleteMany();
        await HallType.deleteMany();
        await MovieType.deleteMany();
        await Cinema.deleteMany();
        await Genre.deleteMany();
        await Language.deleteMany();
        await Country.deleteMany();
        await Showtime.deleteMany();
        await Setting.deleteMany();
        await Announcement.deleteMany();
        await User.deleteMany();
        await Membership.deleteMany();

        console.log('Data destroyed'.red.inverse);
        process.exit();
    } catch (err) {
        console.log(err);
    }
};

if (process.env.NODE_ENV !== 'production') {
    if (process.argv[2] === '-i') {
        importData();
    } else if (process.argv[2] === '-d') {
        destroyData();
    } else {
        console.log('Seeder run with invalid argument');
    }
} else {
    console.log('Seeder is not available in prodution mode.');
}
