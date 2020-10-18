const asyncHandler = require('../middlewares/asyncHandler');
const { Country } = require('../models/Country');

/**
 * @swagger
 * /countries:
 *  get:
 *      tags:
 *          - 🚩 Countries
 *      summary: Get all countries
 *      description: (PUBLIC) Retrieve all countries with fitlering, sorting and pagination
 *      parameters:
 *          -   in: query
 *              name: select
 *              schema:
 *                  type: string
 *              description: Fields to be selected (Multiple fields separated by comma [,])
 *              example: name,code
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
exports.getCountries = asyncHandler(async (req, res, next) => {
    res.standard(200, true, 'Success', res.listJsonData);
});

/**
 * @swagger
 * /countries/{id}:
 *  get:
 *      tags:
 *          - 🚩 Countries
 *      summary: Get a single country by its ID
 *      description: (PUBLIC) Retrieve a country by its ID
 *      parameters:
 *          -   in: path
 *              name: id
 *              required: true
 *              description: Object ID of country
 *              example: 5f8b88d9c787db2fdc5e50c3
 *      responses:
 *          200:
 *              description: OK
 *          404:
 *              description: Country is not found
 *          500:
 *              description: Internal server error
 */
exports.getCountry = asyncHandler(async (req, res, next) => {
    const country = await Country.findById(req.params.id);

    res.standard(200, true, 'Success', country);
});

/**
 * @swagger
 * /countries:
 *  post:
 *      tags:
 *          - 🚩 Countries
 *      summary: Create a country
 *      description: (ADMIN) Create a country
 *      parameters:
 *          -   in: body
 *              name: Country
 *              description: Country to be created
 *              schema:
 *                  type: object
 *                  required:
 *                      - name
 *                      - code
 *                  properties:
 *                      name:
 *                          type: string
 *                          example: Cambodia
 *                      code:
 *                          type: string
 *                          example: KH
 *      responses:
 *          201:
 *              description: Created
 *          400:
 *              description: Validation error
 *          500:
 *              description: Internal server error
 */
exports.createCountry = asyncHandler(async (req, res, next) => {
    const country = await Country.create(req.body);

    res.standard(201, true, 'Country is created successfully', country);
});
