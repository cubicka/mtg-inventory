import AWS from 'aws-sdk'
import Promise from 'bluebird'
import multer from 'multer'
import config from '../config'
import fs from 'fs'

AWS.config.update({
    accessKeyId: config.aws.accessKeyID,
    secretAccessKey: config.aws.secretAccessKey
});

// AWS.config.apiVersion = config.aws.s3.apiVersion;

const s3 = new AWS.S3({
    apiVersion: config.aws.s3.apiVersion,
    region: config.aws.s3.region,
    s3BucketEndpoint: true,
    endpoint: "http://kulakan.s3.amazonaws.com"
    // params: {Bucket: config.aws.s3.bucket}
});

const s3Async = Promise.promisifyAll(s3);

function Upload(data, file) {
    const regex = /(?:\.([^.]+))?$/
    const extension = regex.exec(file.originalname)[0]
    const key = file.filename + extension
    var s3Params = {
        Bucket: config.aws.s3.bucket,
        Key: key,
        Body: data,
        ACL: 'public-read',
        ContentType: file.mimetype
    }

    // return Promise.promisify(s3.upload)(s3Params)
    return s3Async.uploadAsync(s3Params)
}

// export default Upload

const multerConfig = {
    dest: './dist/public/uploads'
}

const uploadMiddleware = multer(multerConfig)

function S3Middleware(req, res, next) {
    const path = req.file.path
    Promise.promisify(fs.readFile)(path)
    .then(function (data) {
        return Upload(data, req.file);
    })
    .then(function (data) {
        req.kulakan.uploads = data
        return Promise.promisify(fs.unlink)(req.file.path);
    })
    .then(() => {
        next()
    })
}

export default (name) => {
    return [uploadMiddleware.single(name), S3Middleware]
}
