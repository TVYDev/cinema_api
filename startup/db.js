const mongoose = require('mongoose');
const colors = require('colors');

const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
        useCreateIndex: true,
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    console.log(`MongoDB connected: ${conn.connection.host}`.green.inverse);
};

module.exports = connectDB;
