import { Request, Response } from 'express';

export const queryBuilder = (req: Request, res: Response, modal: any) => {
    try {
        //BUILD QUERY
        // 1A) Filtering
        const queryObj = { ...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach((el) => delete queryObj[el]);

        //1B) Advanced filtering

        let queryString = JSON.stringify(queryObj);
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        let query = modal.find(JSON.parse(queryString));
        return query;
    } catch (error) {
        return res.status(500).json({ status: 'fail', message: error });
    }
};
