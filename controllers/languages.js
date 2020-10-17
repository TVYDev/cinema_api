const asyncHandler = require('../middlewares/asyncHandler');
const { Language } = require('../models/Language');

/**
 * @swagger
 * /languages:
 *  get:
 *      tags:
 *          - 🔤 Languages
 *      summary: Get all languages
 *      description: (PUBLIC) Retrieve all language with filtering, sorting and pagination
 *      parameters:
 *          -   in: query
 *              name: select
 *              schema:
 *                  type: string
 *              description: Fields to be selected (Multiple fields separated by comma [,])
 *              example: name
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
exports.getLanguages = asyncHandler(async (req, res, next) => {
    res.standard(200, true, 'Success', res.listJsonData);
});

/**
 * @swagger
 * /languages/{id}:
 *  get:
 *      tags:
 *          - 🔤 Languages
 *      summary: Get a language by its ID
 *      description: (PUBLIC) Get a language by its ID
 *      parameters:
 *          -   in: path
 *              name: id
 *              required: true
 *              description: Object Id of language
 *              example: 5f8aecce057ac90d40beef63
 *      responses:
 *          200:
 *              description: OK
 *          404:
 *              description: Language is not found
 *          500:
 *              description: Internal server error
 */
exports.getLanguage = asyncHandler(async (req, res, next) => {
    const language = await Language.findById(req.params.id);

    res.standard(200, true, 'Success', language);
});

/**
 * @swagger
 * /languages:
 *  post:
 *      tags:
 *          - 🔤 Languages
 *      summary: Create a language
 *      description: (ADMIN) Create a language
 *      parameters:
 *          -   in: body
 *              name: language
 *              description: Language to be created
 *              schema:
 *                  type: object
 *                  required:
 *                      - name
 *                  properties:
 *                      name:
 *                          type: string
 *                          example: Khmer
 *      responses:
 *          200:
 *              description: Created
 *          400:
 *              description: Validation error
 *          500:
 *              description: Internal server error
 */
exports.createLanguage = asyncHandler(async (req, res, next) => {
    const language = await Language.create(req.body);

    res.standard(201, true, 'Language is created successfully', language);
});

/**
 * @swagger
 * /languages/{id}:
 *  put:
 *      tags:
 *          - 🔤 Languages
 *      summary: Update a language
 *      description: (ADMIN) Update a language
 *      parameters:
 *          -   in: path
 *              name: id
 *              required: true
 *              description: Object ID of language
 *              example: 5f8aecce057ac90d40beef63
 *          -   in: body
 *              name: language
 *              description: Language data to be updated
 *              schema:
 *                  type: object
 *                  properties:
 *                      name:
 *                          type: string
 *                          example: English
 *      responses:
 *          200:
 *              description: Ok
 *          400:
 *              description: Validation error
 *          404:
 *              description: Language is not found
 *          500:
 *              description: Internal server error
 */
exports.updateLanguage = asyncHandler(async (req, res, next) => {
    const language = await Language.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.standard(200, true, 'Language is updated successfully', language);
});

/**
 * @swagger
 * /languages/{id}:
 *  delete:
 *      tags:
 *          - 🔤 Languages
 *      summary: Delete a language by its ID
 *      description: (ADMIN) Delete a language by its ID
 *      parameters:
 *          -   in: path
 *              name: id
 *              required: true
 *              description: Object ID of language
 *              example: 5f8aecce057ac90d40beef63
 *      responses:
 *          200:
 *              description: Ok
 *          404:
 *              description: Language is not found
 *          500:
 *              description: Internal server error
 */
exports.deleteLanguage = asyncHandler(async (req, res, next) => {
    const language = await Language.findByIdAndRemove(req.params.id);

    res.standard(200, true, 'Language is deleted successfully', language);
});
