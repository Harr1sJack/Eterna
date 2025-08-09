import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';

let gfs;

mongoose.connection.once('open', () => {
  gfs = new GridFSBucket(mongoose.connection.db, {
    bucketName: 'profilePics',
  });
  console.log('✅ GridFS bucket ready');
});

export const uploadToGridFS = (filename, buffer, mimetype) => {
  return new Promise((resolve, reject) => {
    const uploadStream = gfs.openUploadStream(filename, { contentType: mimetype });
    uploadStream.end(buffer);

    uploadStream.on('finish', file => resolve(file));
    uploadStream.on('error', err => reject(err));
  });
};

export const getFromGridFS = (filename, res) => {
  gfs.openDownloadStreamByName(filename).pipe(res);
};
