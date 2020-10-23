const asyncHandler = require('../middlewares/asyncHandler');
const { Announcement } = require('../models/Announcement');

/**
 * @swagger
 * /announcements:
 *  post:
 *      tags:
 *          - 🔊 Announcement
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
