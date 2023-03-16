import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import multer from 'multer';

const router = express.Router();

const UPLOAD_DIRECTORY = './public/uploads';

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, callback) {
            const { collectionName } = req.params;

            const PATH = `${UPLOAD_DIRECTORY}/${collectionName}`;
            // console.log('PATH', PATH);
            if (!fs.existsSync(PATH)) {
                // Create a directory
                fs.mkdirSync(PATH, { recursive: true });
            }

            callback(null, PATH);
        },
        filename: function (req, file, callback) {
            const fileInfo = path.parse(file.originalname);
            const safeFileName = fileInfo.name.replace(/[^a-z0-9]/gi, '_').toLowerCase() + fileInfo.ext;
            // return

            callback(null, safeFileName);
        },
    }),
}).array('file');

router.post('/:collectionName', function (req: Request, res: Response, next) {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            res.status(500).json({ type: 'MulterError', message: err });
        } else if (err) {
            res.status(500).json({ type: 'UnknownError', message: err });
        } else {
            const { collectionName } = req.params;
            const publicUrl = [];

            for (let i = 0; i < (req.files?.length as number); i++) {
                publicUrl.push(`uploads/${collectionName}/${(req.files as any)[i]?.filename}`);
            }
            // const publicUrl = `${req.protocol}://${req.get('host')}/uploads/${collectionName}/${req.file?.filename}`;
            res.status(200).json({ message: 'Success', publicUrl });
        }
    });
});

export default router;
