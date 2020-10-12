const express = require('express');
const expressFileUpload = require('express-fileupload');
const errorHandler = require('../middlewares/errorHandler');
const jsonResponse = require('../middlewares/jsonResponse');
const cinemas = require('../routes/cinemas');
const halls = require('../routes/halls');
const hallTypes = require('../routes/hallTypes');
const movieTypes = require('../routes/movieTypes');

module.exports = function (app) {
    app.use(express.json());
    app.use(jsonResponse);
    app.use(expressFileUpload());
    app.use('/api/v1/cinemas', cinemas);
    app.use('/api/v1/halls', halls);
    app.use('/api/v1/hall-types', hallTypes);
    app.use('/api/v1/movie-types', movieTypes);
    app.use(errorHandler);
};
