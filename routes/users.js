const express = require('express');
const {
    User,
    validateOnCreateUser,
    validateOnUpdateUser
} = require('../models/User');
const { createUser, updateUser } = require('../controllers/users');
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

router.route('/:id').put(
    validateRequestBody(validateOnUpdateUser),
    validateReferences([
        {
            model: User,
            field: '_id',
            param: 'id'
        },
        {
            model: Membership,
            field: '_id',
            property: 'membershipId',
            assignedProperty: 'membership'
        }
    ]),
    updateUser
);

module.exports = router;
