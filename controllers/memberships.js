const asyncHandler = require('../middlewares/asyncHandler');
const { Membership } = require('../models/Membership');

/**
 * @swagger
 * /memberships:
 *  get:
 *      tags:
 *          - 📃 Memberships
 *      summary: Get all memberships
 *      description: (PUBLIC) Retrieve all membership with filtering, sorting and pagination
 *      parameters:
 *          -   in: query
 *              name: select
 *              schema:
 *                  type: string
 *              description: Fields to be selected (Multiple fields separated by comma [,])
 *              example: name,description
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
exports.getMemberships = asyncHandler(async (req, res, next) => {
    res.standard(200, true, 'Success', res.listJsonData);
});

/**
 * @swagger
 * /memberships/{id}:
 *  get:
 *      tags:
 *          - 📃 Memberships
 *      summary: Get a single membership
 *      description: (PUBLIC) Retrieve a single membership by its ID
 *      parameters:
 *          -   in: path
 *              name: id
 *              required: true
 *              description: Object ID of membership
 *              example: 5f9630d827bad03854c8cdfd
 *      responses:
 *          200:
 *              description: OK
 *          404:
 *              description: Membership is not found
 *          500:
 *              description: Internal server error
 */
exports.getMembership = asyncHandler(async (req, res, next) => {
    const membership = await Membership.findById(req.params.id);

    res.standard(200, true, 'Success', membership);
});

/**
 * @swagger
 * /memberships:
 *  post:
 *      tags:
 *          - 📃 Memberships
 *      summary: Create a membership
 *      description: (ADMIN) Create a membership
 *      parameters:
 *          -   in: body
 *              name: Membership
 *              description: Membership to be created
 *              schema:
 *                  type: object
 *                  required:
 *                      - name
 *                      - description
 *                  properties:
 *                      name:
 *                          type: string
 *                          example: Gold Member
 *                      description:
 *                          type: string
 *                          example: An exclusive discount every weekend
 *      responses:
 *          201:
 *              description: Created
 *          400:
 *              description: Validation error
 *          500:
 *              description: Internal server error
 */
exports.createMembership = asyncHandler(async (req, res, next) => {
    const membership = await Membership.create(req.body);

    res.standard(201, true, 'Membership is created successfully', membership);
});

/**
 * @swagger
 * /membershps/{id}:
 *  put:
 *      tags:
 *          - 📃 Membershps
 *      summary: Update a membership
 *      description: (ADMIN) Update a membership by its ID
 *      parameters:
 *          -   in: path
 *              name: id
 *              required: true
 *              description: Object ID of membership
 *              example: 5f9630d827bad03854c8cdfd
 *          -   in: body
 *              name: Membership
 *              description: Membership information to be updated
 *              schema:
 *                  type: Object
 *                  properties:
 *                      name:
 *                          type: String
 *                          example: Silver
 *                      description:
 *                          type: String
 *                          example: Free drinks
 *      responses:
 *          200:
 *              description: OK
 *          400:
 *              description: Validation error
 *          404:
 *              description: Membership is not found
 *          500:
 *              description: Internal server error
 */
exports.updateMembership = asyncHandler(async (req, res, next) => {
    const membership = await Membership.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    res.standard(200, true, 'Membership is updated successfully', membership);
});

/**
 * @swagger
 * /memberships/{id}:
 *  delete:
 *      tags:
 *          - 📃 Memberships
 *      summary: Delete a single membership
 *      description: (ADMIN) Delete a membership by its ID
 *      parameters:
 *          -   in: path
 *              name: id
 *              required: true
 *              description: Object ID of membership
 *              example: 5f9630d827bad03854c8cdfd
 *      responses:
 *          200:
 *              description: OK
 *          404:
 *              description: Membership is not found
 *          500:
 *              description: Internal server error
 */
exports.deleteMembership = asyncHandler(async (req, res, next) => {
    const membership = await Membership.findByIdAndRemove(req.params.id);

    res.standard(200, true, 'Membership is deleted successfully', membership);
});
