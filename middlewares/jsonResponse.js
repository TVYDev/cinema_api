const jsonResponse = async (req, res, next) => {
    res.standard = (httpStatus, success, message = null, data = {}) => {
        return res.status(httpStatus).json({ success, message, data });
    };

    next();
};

module.exports = jsonResponse;
