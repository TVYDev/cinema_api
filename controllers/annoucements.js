const asyncHandler = require('../middlewares/asyncHandler');
const { Announcement } = require('../models/Announcement');

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
