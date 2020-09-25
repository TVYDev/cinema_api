const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const connectDB = require('./config/db');

// Load env variables
dotenv.config({ path: './config/.env' });

const app = express();

// Connect to database
connectDB();

const port = process.env.PORT || 6000;

app.listen(port, () =>
    console.log(
        `Application is running in ${process.env.NODE_ENV} mode on port ${port}`
            .cyan.inverse
    )
);
