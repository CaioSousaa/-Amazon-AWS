import { S3Client } from '@aws-sdk/client-s3';
import * as multerS3 from 'multer-s3';
import { extname } from 'path';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  endpoint: process.env.AWS_ENDPOINT!,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.AWS_KEY_ACCESS!,
    secretAccessKey: process.env.AWS_SECRET_KEY_ACCESS!,
  },
});

export const multerS3Config: MulterOptions = {
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET!,
    acl: 'public-read',
    contentType: (req, file, cb) => multerS3.AUTO_CONTENT_TYPE(req, file, cb),
    key: (req, file, cb) => {
      const ext = extname(file.originalname);
      const filename = `${Date.now()}${ext}`;
      cb(null, filename);
    },
  }),
  limits: {
    fileSize: 1024 * 1024 * 2, // Limite de 2MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed...'), false);
    }
  },
};
