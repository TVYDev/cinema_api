const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');

const app = express();

dotenv.config({ path: './config/.env' });

const port = process.env.PORT || 6000;

app.listen(port, () =>
    console.log(
        `Application is running in ${process.env.NODE_ENV} mode on port ${port}`
            .cyan.inverse
    )
);
