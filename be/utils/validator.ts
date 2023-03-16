import { Request, Response, NextFunction } from 'express';

export const validator = (schema: any) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        await schema.validate({ body: req.body, query: req.query, params: req.params });

        return next();
    } catch (err) {
        return res.status(400).json({ message: (err as Error).message });
    }
};
