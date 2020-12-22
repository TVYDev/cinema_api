const asyncHandler = require('../middlewares/asyncHandler');
const { Hall } = require('../models/Hall');
const validateFileUpload = require('../helpers/validateFileUpload');
const storeFileUpload = require('../helpers/storeFileUpload');

/**
 * @swagger
 * /halls:
 *  get:
 *      tags:
 *          - 🎪 Halls
 *      summary: Get all halls
 *      description: (PUBLIC) Retrieve all halls with filtering, sorting & pagination
 *      parameters:
 *          -   in: query
 *              name: select
 *              schema:
 *                  type: string
 *              description: Fields to be selected (Multiple fields separated by comma [,])
 *              example: name,seatRows,seatColumns
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
/**
 * @swagger
 * /cinemas/{cinemaId}/halls:
 *  get:
 *      tags:
 *          - 🎪 Halls
 *      summary: Get all halls of a cinema
 *      description: (PUBLIC) Retrieve all halls of a cinema with filtering, sorting & pagination
 *      parameters:
 *          -   in: path
 *              name: cinemaId
 *              required: true
 *              schema:
 *                  type: string
 *              description: Object ID of cinema to be retrieved halls from
 *              example: 5d713995b721c3bb38c1f5d0
 *          -   in: query
 *              name: select
 *              schema:
 *                  type: string
 *              description: Fields to be selected (Multiple fields separated by comma [,])
 *              example: name,seatRows,seatColumns
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
 *          404:
 *              description: Cinema is not found
 *          500:
 *              description: Internal server error
 */
/**
 * @swagger
 * /hall-types/{hallTypeId}/halls:
 *  get:
 *      tags:
 *          - 🎪 Halls
 *      summary: Get all halls of a hall type
 *      description: (PUBLIC) Retrieve all halls of a hall type with filtering, sorting & pagination
 *      parameters:
 *          -   in: path
 *              name: hallTypeId
 *              required: true
 *              schema:
 *                  type: string
 *              description: Object ID of hall type to be retrieved halls from
 *              example: 5f80169afe932e3d4055d1ea
 *          -   in: query
 *              name: select
 *              schema:
 *                  type: string
 *              description: Fields to be selected (Multiple fields separated by comma [,])
 *              example: name,seatRows,seatColumns
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
 *          404:
 *              description: Cinema is not found
 *          500:
 *              description: Internal server error
 */
exports.getHalls = asyncHandler(async (req, res, next) => {
  res.standard(200, true, 'Success', res.listJsonData);
});

/**
 * @swagger
 * /halls/{id}:
 *  get:
 *      tags:
 *          - 🎪 Halls
 *      summary: Get a single hall by id
 *      description: (PUBLIC) Retrieve a single hall from database by hall id
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema: string
 *              required: true
 *              description: Object ID of hall
 *              example: 5f7e6fa36e1f822e0800184a
 *      responses:
 *          200:
 *              description: OK
 *          404:
 *              description: Hall is not found
 *          500:
 *              description: Internal server error
 */
exports.getHall = asyncHandler(async (req, res, next) => {
  const hall = await Hall.findById(req.params.id)
    .populate('cinema')
    .populate('hallType');

  res.standard(200, true, 'Success', hall);
});

/**
 * @swagger
 * /cinemas/{cinemaId}/halls:
 *  post:
 *      tags:
 *          - 🎪 Halls
 *      summary: Add a new hall to a cinema
 *      description: (ADMIN) Add a new hall to a cinema
 *      parameters:
 *          -   in: path
 *              name: cinemaId
 *              required: true
 *              schema:
 *                  type: string
 *              description: Object Id of cinema for adding a new hall into
 *              example: 5d713995b721c3bb38c1f5d0
 *          -   in: body
 *              name: hall
 *              description: The hall to be created
 *              schema:
 *                  type: object
 *                  required:
 *                      - name
 *                      - seatRows
 *                      - seatColumns
 *                      - hallTypeId
 *                  properties:
 *                      name:
 *                          type: string
 *                          example: Hall one
 *                      seatRows:
 *                          type: array
 *                          items:
 *                              type: string | number
 *                          example: ["A","B","C"]
 *                      seatColumns:
 *                          type: array
 *                          items:
 *                              type: string | number
 *                          example: [1,2,3]
 *                      hallTypeId:
 *                          type: string
 *                          example: 5f80169afe932e3d4055d1ea
 *      responses:
 *          201:
 *              description: Created
 *          400:
 *              description: Validation error
 *          404:
 *              description: Cinema is not found
 *          500:
 *              description: Internal server error
 */
exports.addHall = asyncHandler(async (req, res, next) => {
  const hall = await Hall.create(req.body);

  res.standard(201, true, 'Hall is added to cinema successfully', hall);
});

/**
 * @swagger
 * /halls/{id}:
 *  put:
 *      tags:
 *          - 🎪 Halls
 *      summary: Update a hall
 *      description: (ADMIN) Update information of a hall (name, seatRows, seatColumns)
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema: string
 *              require: true
 *              description: Object ID of hall
 *              example: 5f7e6fa36e1f822e0800184a
 *          -   in: body
 *              name: hall
 *              description: The hall data to be updated
 *              schema:
 *                  type: object
 *                  properties:
 *                      name:
 *                          type: string
 *                          example: Hall one
 *                      seatRows:
 *                          type: array
 *                          items:
 *                              type: string | number
 *                          example: ["A","B","C"]
 *                      seatColumns:
 *                          type: array
 *                          items:
 *                              type: string | number
 *                          example: [1,2,3]
 *      responses:
 *          200:
 *              description: OK
 *          400:
 *              description: Validation error
 *          404:
 *              description: Hall is not found
 *          500:
 *              description: Internal server error
 */
exports.updateHall = asyncHandler(async (req, res, next) => {
  const hall = await Hall.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.standard(200, true, 'Hall is updated successfully', hall);
});

/**
 * @swagger
 * /halls/{id}:
 *  delete:
 *      tags:
 *          - 🎪 Halls
 *      summary: Delete a hall
 *      description: (ADMIN) Delete a hall from database by its ID
 *      parameters:
 *          -   in: path
 *              name: id
 *              schema:
 *                  type: string
 *              required: true
 *              description: Object ID of hall
 *              example: 5f7e6fa36e1f822e0800184a
 *      responses:
 *          200:
 *              description: OK
 *          404:
 *              description: Hall is not found
 *          500:
 *              description: Internal server error
 */
exports.deleteHall = asyncHandler(async (req, res, next) => {
  const hall = await Hall.findByIdAndRemove(req.params.id);

  res.standard(200, true, 'Hall is deleted succesfully', hall);
});

/**
 * @swagger
 * /halls/{id}/location-image:
 *  put:
 *      tags:
 *          - 🎪 Halls
 *      summary: Upload location image of a hall
 *      description: (ADMIN) Upload location image of a hall by id
 *      parameters:
 *          -   in: path
 *              name: id
 *              required: true
 *              schema:
 *                  type: string
 *              description: Object ID of hall
 *              example: 5f7e6fa36e1f822e0800184a
 *          -   in: formData
 *              name: file
 *              type: file
 *              description: Image file to be uploaed as location image of hall
 *      responses:
 *          200:
 *              description: OK
 *          400:
 *              description: Validation error
 *          404:
 *              description: Hall is not found
 *          500:
 *              description: Internal server error
 */
exports.uploadLocationImageHall = asyncHandler(async (req, res, next) => {
  const hallId = req.params.id;

  const file = validateFileUpload(req, next, 'image');
  const fileName = storeFileUpload('hall_location_image', hallId, file, next);

  const hall = await Hall.findByIdAndUpdate(
    hallId,
    {
      locationImage: fileName
    },
    { new: true }
  );

  res.standard(
    200,
    true,
    'Location image of hall is uploaded successfully',
    hall
  );
});
