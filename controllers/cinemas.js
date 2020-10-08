const { Cinema } = require('../models/Cinema');
const asyncHandler = require('../middlewares/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const validateFileUpload = require('../helpers/validateFileUpload');
const storeFileUpload = require('../helpers/storeFileUpload');

/**
 * @swagger
 * /cinemas:
 *  get:
 *      tags:
 *          - 🎥 Cinemas
 *      summary: Get all cinemas
 *      description: (PUBLIC) Retrieve all cinemas with filtering, sorting & pagination
 *      parameters:
 *          -   in: query
 *              name: select
 *              schema:
 *                  type: string
 *              description: Fields to be selected (Multiple fields separated by comma [,])
 *              example: name,address
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
exports.getCinemas = asyncHandler(async (req, res, next) => {
    res.standard(200, true, 'Success', res.listJsonData);
});

/**
 * @swagger
 * /cinemas/{id}:
 *  get:
 *      tags:
 *          - 🎥 Cinemas
 *      summary: Get a single cinema by id
 *      description: (PUBLIC) Retrieve a single cinema by its ID
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema: string
 *              required: true
 *              description: Object ID of cinema
 *              example: 5f7ae01bc3c24b4c6c328d03
 *      responses:
 *          200:
 *              description: OK
 *          404:
 *              description: Cinema is not found
 *          500:
 *              description: Internal server error
 */
exports.getCinema = asyncHandler(async (req, res, next) => {
    const cinema = await Cinema.findById(req.params.id);

    if (!cinema) {
        return next(
            new ErrorResponse('Cinema with given ID is not found', 404)
        );
    }

    res.standard(200, true, 'Success', cinema);
});

/**
 * @swagger
 * /cinemas:
 *  post:
 *      tags:
 *          - 🎥 Cinemas
 *      summary: Create a new cinema
 *      description: (ADMIN) Create a new cinema
 *      parameters:
 *          -   in: body
 *              name: cinema
 *              description: The cinema to be created
 *              schema:
 *                  type: object
 *                  required:
 *                      - name
 *                      - address
 *                      - openingHours
 *                  properties:
 *                      name:
 *                          type: string
 *                          example: Delee Cinema
 *                      address:
 *                          type: string
 *                          example: Phnom Penh
 *                      openingHours:
 *                          type: string
 *                          example: 7AM - 9PM
 *      responses:
 *          201:
 *              description: Created
 *          400:
 *              description: Validation Error
 *          500:
 *              description: Internal server error
 */
exports.createCinema = asyncHandler(async (req, res, next) => {
    const cinema = await Cinema.create(req.body);
    res.standard(201, true, 'Cinema is created successfully', cinema);
});

/**
 * @swagger
 * /cinemas/{id}:
 *  put:
 *      tags:
 *          - 🎥 Cinemas
 *      summary: Update a cinema
 *      description: (ADMIN) Update a cinema
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema: string
 *              required: true
 *              description: Object ID of cinema
 *              example: 5f7ae01bc3c24b4c6c328d03
 *          -   in: body
 *              name: cinema
 *              description: The cinema data to be updated
 *              schema:
 *                  type: object
 *                  properties:
 *                      name:
 *                          type: string
 *                          example: Delee Cinema
 *                      address:
 *                          type: string
 *                          example: Phnom Penh
 *                      openingHours:
 *                          type: string
 *                          example: 7AM - 9PM
 *      responses:
 *          200:
 *              description: OK
 *          400:
 *              description: Validation Error
 *          404:
 *              description: Cinema is not found
 *          500:
 *              description: Internal server error
 */
exports.updateCinema = asyncHandler(async (req, res, next) => {
    let cinema = await Cinema.findById(req.params.id);

    if (!cinema) {
        return next(
            new ErrorResponse('Cinema with given ID is not found', 404)
        );
    }

    cinema = await Cinema.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.standard(200, true, 'Cinema is updated successfully', cinema);
});

/**
 * @swagger
 * /cinemas/{id}:
 *  delete:
 *      tags:
 *          - 🎥 Cinemas
 *      summary: Delete a cinema
 *      description: (ADMIN) Delete a cinema from database by its ID
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema: string
 *              required: true
 *              description: Object ID of cinema
 *              example: 5f7ae01bc3c24b4c6c328d03
 *      responses:
 *          200:
 *              description: OK
 *          404:
 *              description: Cinema is not found
 *          500:
 *              description: Internal server error
 */
exports.deleteCinema = asyncHandler(async (req, res, next) => {
    let cinema = await Cinema.findById(req.params.id);

    if (!cinema) {
        return next(
            new ErrorResponse('Cinema with given ID is not found', 404)
        );
    }

    await cinema.remove();

    res.standard(200, true, 'Cinema is deleted successfully', cinema);
});

/**
 * @swagger
 * /cinemas/{id}/photo:
 *  put:
 *      tags:
 *          - 🎥 Cinemas
 *      summary: Upload photo of a cinema
 *      description: (ADMIN) Upload photo of a cinema by cinema ID
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema: string
 *              required: true
 *              description: Object ID of cinema
 *              example: 5f7ae01bc3c24b4c6c328d03
 *          -   in: formData
 *              name: file
 *              type: file
 *              description: Image file to be uploaded as photo of cinema
 *      responses:
 *          200:
 *              description: OK
 *          404:
 *              description: Cinema is not found
 *          400:
 *              description: Validation error
 *          500:
 *              description: Unable to upload file | Internal server error
 */
exports.uploadPhotoCinema = asyncHandler(async (req, res, next) => {
    const cinemaId = req.params.id;
    let cinema = await Cinema.findById(cinemaId);

    if (!cinema) {
        return next(
            new ErrorResponse('Cinema with given ID is not found', 404)
        );
    }

    const file = validateFileUpload(req, next, 'image');
    const fileName = storeFileUpload('cinema_photo', cinemaId, file);

    cinema = await Cinema.findByIdAndUpdate(
        cinemaId,
        {
            photo: fileName
        },
        { new: true }
    );

    res.standard(200, true, 'Upload photo for cinema successfully', cinema);
});

/**
 * @swagger
 * /cinemas/{id}/layout-image:
 *  put:
 *      tags:
 *          - 🎥 Cinemas
 *      summary: Upload layout image of a cinema
 *      description: (ADMIN) Upload layout image of a cinema by cinema ID
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema: string
 *              required: true
 *              description: Object ID of cinema
 *              example: 5f7ae01bc3c24b4c6c328d03
 *          -   in: formData
 *              name: file
 *              type: file
 *              description: Image file to be uploaded as layout image of cinema
 *      responses:
 *          200:
 *              description: OK
 *          404:
 *              description: Cinema is not found
 *          400:
 *              description: Validation error
 *          500:
 *              description: Unable to upload file | Internal server error
 */
exports.uploadLayoutImageCinema = asyncHandler(async (req, res, next) => {
    const cinemaId = req.params.id;
    let cinema = await Cinema.findById(cinemaId);

    if (!cinema) {
        return next(
            new ErrorResponse('Cinema with given ID is not found', 404)
        );
    }

    const file = validateFileUpload(req, next, 'image');
    const fileName = storeFileUpload('cinema_layout_image', cinemaId, file);

    cinema = await Cinema.findByIdAndUpdate(
        cinemaId,
        { layoutImage: fileName },
        { new: true }
    );

    res.standard(
        200,
        true,
        'Upload layout image of cinema successfully',
        cinema
    );
});
