const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const colors = require('colors');

// Load env variables
dotenv.config({ path: './config/.env' });

const { Cinema } = require('../models/Cinema');
const { Hall } = require('../models/Hall');
const { HallType } = require('../models/HallType');

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

const importData = async () => {
    try {
        await Cinema.create(cinemas);
        await HallType.create(hallTypes);
        await Hall.create(halls);

        console.log('Data imported'.blue.inverse);
        process.exit();
    } catch (err) {
        console.log(err);
    }
};

const destroyData = async () => {
    try {
        await Hall.deleteMany();
        await HallType.deleteMany();
        await Cinema.deleteMany();

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
