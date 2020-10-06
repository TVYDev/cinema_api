const ErrorResponse = require('../utils/ErrorResponse');

module.exports = function (req, next, fileType) {
    // Check if there is a file uploaded
    if (!req.files) {
        return next(new ErrorResponse('Please upload a file', 400));
    }

    const file = req.files.file;

    // Check if the uploaded file is image file
    if (!file.mimetype.startsWith(fileType)) {
        return next(
            new ErrorResponse(`Please upload an ${fileType} file`, 400)
        );
    }

    // Check size of file
    if (file.size > process.env.FILE_UPLOAD_MAX_BYTE_SIZE) {
        return next(
            new ErrorResponse(
                `Please upload a file not exceeding ${
                    process.env.FILE_UPLOAD_MAX_BYTE_SIZE / 1000
                }KB in size`,
                400
            )
        );
    }

    return file;
};
