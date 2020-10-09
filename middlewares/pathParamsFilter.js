const ErrorResponse = require('../utils/ErrorResponse');

const pathParamFilter = (params) => async (req, res, next) => {
    try {
        const filterObject = {};

        let paramValue;
        for (p of params) {
            paramValue = req.params[p.param];
            if (paramValue !== undefined) {
                const item = await p.model.findById(paramValue);
                if (!item) {
                    return next(
                        new ErrorResponse(
                            `${p.field} with given ID is not found`,
                            404
                        )
                    );
                }

                filterObject[p.field] = paramValue;
            }
        }

        req.filterObject = filterObject;

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = pathParamFilter;
