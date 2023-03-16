// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
    message?: string;
    revalidated?: boolean;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    if (req.query.secret !== 'secret') {
        return res.status(401).json({ message: 'Invalid token' });
    }

    try {
        const slug = req.query.slug;

        await res.revalidate('/product/' + slug);
        return res.json({ revalidated: true });
    } catch (err) {
        return res.status(500).send({ message: 'Error revalidating' });
    }
}
