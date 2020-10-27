const express = require('express');
const {
    User,
    validateOnCreateUser,
    validateOnUpdateUser
} = require('../models/User');
const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
} = require('../controllers/users');
const { Membership } = require('../models/Membership');
const listJsonResponse = require('../middlewares/listJsonResponse');
const validateRequestBody = require('../middlewares/validateRequestBody');
const validateReferences = require('../middlewares/validateReferences');
const router = express.Router();

router
    .route('/')
    .get(listJsonResponse(User), getUsers)
    .post(
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

router
    .route('/:id')
    .get(
        validateReferences([
            {
                model: User,
                field: '_id',
                param: 'id'
            }
        ]),
        getUser
    )
    .put(
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
    )
    .delete(
        validateReferences([
            {
                model: User,
                field: '_id',
                param: 'id'
            }
        ]),
        deleteUser
    );

module.exports = router;
