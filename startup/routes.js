const express = require('express');
const expressFileUpload = require('express-fileupload');
const errorHandler = require('../middlewares/errorHandler');
const jsonResponse = require('../middlewares/jsonResponse');
const cinemas = require('../routes/cinemas');

module.exports = function (app) {
    app.use(express.json());
    app.use(jsonResponse);
    app.use(expressFileUpload());
    app.use('/api/v1/cinemas', cinemas);
    app.use(errorHandler);
};
