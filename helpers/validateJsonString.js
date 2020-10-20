const validateJsonString = (str) => {
    try {
        JSON.parse(str);
        return true;
    } catch (error) {
        return false;
    }
};

module.exports = validateJsonString;
