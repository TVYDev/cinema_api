const asyncHandler = require('../middlewares/asyncHandler');
const { User } = require('../models/User');

/**
 * @swagger
 * /users:
 *  get:
 *      tags:
 *          - 😀 Users
 *      summary: Get all users
 *      description: (PUBLIC) Retrieve all users with filtering, sorting and pagination
 *      parameters:
 *          -   in: query
 *              name: select
 *              schema:
 *                  type: string
 *              description: Fields to be selected (Multiple fields separated by comma [,])
 *              example: name,email
 *          -   in: query
 *              name: sort
 *              schema:
 *                  type: string
 *              description: Sort by field (Prefix the field with minus [-] for descending ordering)
 *              example: name,-createdAt
 *          -   in: query
 *              name: limit
 *              schema:
 *                  type: string
 *              default: 20
 *              description: Limit numbers of record for a page
 *              example: 10
 *          -   in: query
 *              name: page
 *              default: 1
 *              schema:
 *                  type: string
 *              description: Certain page index for records to be retrieved
 *              example: 1
 *          -   in: query
 *              name: paging
 *              default: true
 *              schema:
 *                  type: string
 *              description: Define whether need records in pagination
 *              example: false
 *      responses:
 *          200:
 *              description: OK
 *          500:
 *              description: Internal server error
 */
exports.getUsers = asyncHandler(async (req, res, next) => {
    res.standard(200, true, 'Success', res.listJsonData);
});

/**
 * @swagger
 * /users/{id}:
 *  get:
 *      tags:
 *          - 😀 Users
 *      summary: Get a single user
 *      description: (PUBLIC) Get a single user by its ID
 *      parameters:
 *          -   in: path
 *              name: id
 *              required: true
 *              description: Object Id of user
 *              example: 5f977747f5e80732e8cb6b75
 *      responses:
 *          200:
 *              description: OK
 *          404:
 *              description: User is not found
 *          500:
 *              description: Internal server error
 */
exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    res.standard(200, true, 'Success', user);
});

/**
 * @swagger
 * /users:
 *  post:
 *      tags:
 *          - 😀 Users
 *      summary: Create a user
 *      description: (ADMIN) Create a user
 *      parameters:
 *          -   in: body
 *              name: User
 *              description: User to be created
 *              schema:
 *                  type: object
 *                  required:
 *                      - name
 *                      - email
 *                      - password
 *                      - role
 *                  properties:
 *                      name:
 *                          type: string
 *                          example: Vannyou
 *                      email:
 *                          type: string
 *                          format: email
 *                          example: vannyou@mail.com
 *                      password:
 *                          type: string
 *                          example: Abc1234
 *                      role:
 *                          type: string
 *                          enum: [customer, staff]
 *                          example: customer
 *                      membershipId:
 *                          type: string
 *                          description: Object Id of membership (Required for role "customer")
 *                          example: 5f9630d827bad03854c8cdfd
 *      responses:
 *          201:
 *              description: Created
 *          400:
 *              description: Validation error
 *          500:
 *              description: Internal server error
 *
 */
exports.createUser = asyncHandler(async (req, res, next) => {
    const user = await User.create(req.body);

    res.standard(201, true, 'User is created successfully', user);
});

/**
 * @swagger
 * /users/{id}:
 *  put:
 *      tags:
 *          - 😀 Users
 *      summary: Update a user
 *      description: (ADMIN) Update a user by its ID
 *      parameters:
 *          -   in: path
 *              name: id
 *              required: true
 *              description: Object ID of user
 *              example: 5f977747f5e80732e8cb6b75
 *          -   in: body
 *              name: User
 *              description: User information to be updated
 *              schema:
 *                  type: object
 *                  properties:
 *                      name:
 *                          type: string
 *                          example: Vannyou
 *                      email:
 *                          type: string
 *                          format: email
 *                          example: vannyou@mail.com
 *                      role:
 *                          type: string
 *                          enum: [customer, staff]
 *                          example: customer
 *                      membershipId:
 *                          type: string
 *                          description: Object Id of membership (Required for role "customer")
 *                          example: 5f9630d827bad03854c8cdfd
 *      responses:
 *          200:
 *              description: OK
 *          400:
 *              description: Validation error
 *          404:
 *              description: User is not found
 *          500:
 *              description: Internal server error
 */
exports.updateUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.standard(200, true, 'User is updated successfully', user);
});

/**
 * @swagger
 * /users/{id}:
 *  delete:
 *      tags:
 *          - 😀 Users
 *      summary: Delete a user
 *      description: (ADMIN) Delete a user by its ID
 *      parameters:
 *          -   in: path
 *              name: id
 *              required: true
 *              description: Object Id of user
 *              example: 5f977747f5e80732e8cb6b75
 *      responses:
 *          200:
 *              description: OK
 *          404:
 *              description: User is not found
 *          500:
 *              description: Internal server error
 */
exports.deleteUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndRemove(req.params.id);

    res.standard(200, true, 'User is deleted successfully', user);
});
