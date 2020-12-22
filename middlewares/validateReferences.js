const ErrorResponse = require('../utils/ErrorResponse');

const validateReferences = (references) => async (req, res, next) => {
    /*
        `field` => in DB
        `param` => in URL path
        `property` => in request body
        `assignedProperty` => assign to new field in the request body if valid
    */
    try {
        let property;
        let refResource;
        for (ref of references) {
            property = req.body[ref.property] || req.params[ref.param];
            if (property) {
                if (!Array.isArray(property)) {
                    refResource = await ref.model.findOne({
                        [ref.field]: property
                    });
                    if (!refResource) {
                        return next(
                            new ErrorResponse(
                                `${ref.model.prototype.collection.name} with given field (${ref.field} = ${property}) is not found`,
                                404
                            )
                        );
                    }

                    if (ref.assignedRefResource) {
                        req.body[ref.assignedRefResource] = refResource;
                    }
                } else {
                    for (p of property) {
                        refResource = await ref.model.findOne({
                            [ref.field]: p
                        });
                        if (!refResource) {
                            return next(
                                new ErrorResponse(
                                    `${ref.model.prototype.collection.name} with given field (${ref.field} = ${p}) is not found`,
                                    404
                                )
                            );
                        }
                    }
                }

                if (ref.assignedProperty) {
                    req.body[ref.assignedProperty] = property;
                }
            }
        }
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = validateReferences;
