const listJsonResponse = (model, populate = null) => async (req, res, next) => {
    try {
        // Copy query params
        const reqQuery = { ...req.query };

        // Check query params if there is `paging` param
        const hasPaging = reqQuery.paging === 'false' ? false : true;

        // Excluded fields
        const excludedFields = ['select', 'sort', 'limit', 'page', 'paging'];
        excludedFields.forEach((param) => delete reqQuery[param]);

        // String of query params
        let queryStr = JSON.stringify(reqQuery);

        // Replace string to match mongoose operator with prefix '$'
        queryStr = queryStr.replace(
            /\b(gt|gte|lt|lte|in)\b/g,
            (match) => `$${match}`
        );

        let filters = JSON.parse(queryStr);
        if (req.filterObject !== undefined) {
            filters = { ...filters, ...req.filterObject };
        }

        let query = model.find(filters);
        let queryForCount = model.find(filters);

        // Select fields
        if (req.query.select) {
            const select = req.query.select.split(',').join(' ');
            query = query.select(select);
        }

        // Sorty By
        if (req.query.sort) {
            const sort = req.query.sort.split(',').join(' ');
            query = query.sort(sort);
        } else {
            query = query.sort('-createdAt');
        }

        if (hasPaging) {
            // Pagination
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 20;
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;

            const totalCount = await queryForCount.countDocuments();

            query = query.skip(startIndex).limit(limit);

            const items = await query;

            let pagination = {
                count: items.length,
                totalCount,
                limit,
                currentPage: page
            };

            if (startIndex > 0) {
                pagination.prevPage = page - 1;
            }
            if (endIndex < totalCount) {
                pagination.nextPage = page + 1;
            }

            res.listJsonData = {
                items,
                pagination
            };
        } else {
            const items = await query;

            res.listJsonData = {
                items,
                count: items.length
            };
        }

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = listJsonResponse;
