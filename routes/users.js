const express = require('express');
const {
    User,
    validateOnCreateUser,
    validateOnUpdateUser
} = require('../models/User');
const { createUser } = require('../controllers/users');
const { Membership } = require('../models/Membership');
const validateRequestBody = require('../middlewares/validateRequestBody');
const validateReferences = require('../middlewares/validateReferences');
const router = express.Router();

router.route('/').post(
    validateRequestBody(validateOnCreateUser),
    validateReferences([
        {
            model: Membership,
            field: '_id',
            property: 'membershipId',
            assignedProperty: 'membership'
        }
    ]),
    createUser
);

module.exports = router;
