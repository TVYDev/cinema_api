const ErrorResponse = require('../utils/ErrorResponse');
const path = require('path');

module.exports = function (prefix, id, file) {
    // Create custom file name
    const fileName = `${prefix}_${id}${path.parse(file.name).ext}`;

    // Move file to store directory
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${fileName}`, async (error) => {
        if (error) {
            console.log(error);
            return next(new ErrorResponse('Problem with file upload', 500));
        }
    });

    return fileName;
};
