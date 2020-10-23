const asyncHandler = require('../middlewares/asyncHandler');
const { Announcement } = require('../models/Announcement');

/**
 * @swagger
 * /announcements:
 *  get:
 *      tags:
 *          - 🔊 Announcements
 *      summary: Get all announcements
 *      description: (PUBLIC) Retrieve all announcements with filtering, sorting and pagination
 *      parameters:
 *          -   in: query
 *              name: select
 *              schema:
 *                  type: string
 *              description: Fields to be selected (Multiple fields separated by comma [,])
 *              example: title,description
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
exports.getAnnouncements = asyncHandler(async (req, res, next) => {
    res.standard(200, true, 'Success', res.listJsonData);
});

/**
 * @swagger
 * /announcements/{id}:
 *  get:
 *      tags:
 *          - 🔊 Announcements
 *      summary: Get a single announcement by ID
 *      description: (PUBLIC) Get a single announcement by ID
 *      parameters:
 *          -   in: path
 *              name: id
 *              required: true
 *              description: Object ID of announcement
 *              example: 5f9263c8cc10423fdc7b1a15
 *      responses:
 *          200:
 *              description: OK
 *          404:
 *              description: Announcement is not found
 *          500:
 *              description: Internal server error
 */
exports.getAnnouncement = asyncHandler(async (req, res, next) => {
    const announcement = await Announcement.findById(req.params.id);

    res.standard(200, true, 'Success', announcement);
});

/**
 * @swagger
 * /announcements:
 *  post:
 *      tags:
 *          - 🔊 Announcements
 *      summary: Create a new annoucement
 *      description: (ADMIN) Create a new announcement
 *      parameters:
 *          -   in: body
 *              name: announcement
 *              description: Anncounement to be created
 *              schema:
 *                  type: object
 *                  required:
 *                      - title
 *                      - description
 *                  properties:
 *                      title:
 *                          type: string
 *                          example: New movie, new popcorn
 *                      description:
 *                          type: string
 *                          example: Buy a ticket, fee popcorn
 *                      startedDateTime:
 *                          type: date
 *                          format: datetime
 *                          example: 2021-06-23 10:00
 *                      endedDateTime:
 *                          type: date
 *                          format: datetime
 *                          example: 2021-07-10 10:00
 *      responses:
 *          201:
 *              description: Created
 *          400:
 *              descriptoin: Validation error
 *          500:
 *              description: Internal server error
 */
exports.createAnnoucement = asyncHandler(async (req, res, next) => {
    const announcement = await Announcement.create(req.body);

    res.standard(
        201,
        true,
        'Announcement is created successfully',
        announcement
    );
});

/**
 * @swagger
 * /announcements/{id}:
 *  put:
 *      tags:
 *          - 🔊 Announcements
 *      summary: Update an announcement
 *      description: (ADMIN) Update an announcement
 *      parameters:
 *          -   in: path
 *              name: id
 *              required: true
 *              description: Object Id of announcement
 *              example: 5f925a2c4716fa3994a5cab4
 *          -   in: body
 *              name: announcement
 *              description: Anncounement to be created
 *              schema:
 *                  type: object
 *                  properties:
 *                      title:
 *                          type: string
 *                          example: New movie, new popcorn
 *                      description:
 *                          type: string
 *                          example: Buy a ticket, fee popcorn
 *                      startedDateTime:
 *                          type: date
 *                          format: datetime
 *                          example: 2021-06-23 10:00
 *                      endedDateTime:
 *                          type: date
 *                          format: datetime
 *                          example: 2021-07-10 10:00
 *      responses:
 *          200:
 *              description: OK
 *          400:
 *              description: Validation error
 *          404:
 *              description: Announcement is not found
 *          500:
 *              description: Internal server error
 */
exports.updateAnnouncement = asyncHandler(async (req, res, next) => {
    const announcement = await Announcement.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    res.standard(
        200,
        true,
        'Announcement is updated successfully',
        announcement
    );
});

/**
 * @swagger
 * /announcements/{id}:
 *  delete:
 *      tags:
 *          - 🔊 Announcements
 *      summary: Delete an announcement by ID
 *      description: (ADMIN) Delete an announcement by its ID
 *      parameters:
 *          -   in: path
 *              name: id
 *              required: true
 *              description: Object ID of announcement
 *              example: 5f925a2c4716fa3994a5cab4
 *      responses:
 *          200:
 *              description: OK
 *          404:
 *              description: Announcement is not found
 *          500:
 *              description: Internal server error
 */
exports.deleteAnnouncement = asyncHandler(async (req, res, next) => {
    const announcement = await Announcement.findByIdAndRemove(req.params.id);

    res.standard(
        200,
        true,
        'Announcement is deleted successfully',
        announcement
    );
});
