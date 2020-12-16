const multer = require('multer');
const uuid = require('uuid');
const path = require('path');
const mkdirp = require('mkdirp');
const storageConfig = multer.diskStorage( {
    destination: (req, file, cb) => {
        mkdirp(path.resolve('public/images')).then( result => cb(null, 'public/images'));
    },
    filename: (req, file, cb) => {
        const arr = file.originalname.split('.');
        cb(null, uuid.v4() + '.' + arr[arr.length - 1]);
    }
});

module.exports = multer( {storage: storageConfig}).single('filedata');

