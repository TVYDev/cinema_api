const express = require('express');
const router = express.Router();
const { getCinemas, createCinema } = require('../controllers/cinemas');

router.route('/').get(getCinemas).post(createCinema);

module.exports = router;
