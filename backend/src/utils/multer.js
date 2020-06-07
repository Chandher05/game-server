'use strict'

import aws from 'aws-sdk';
import multer from 'multer';

import config from '../../config';

aws.config.update({
    secretAccessKey: config.awsKeysJayasurya.AWS_SECRET_ACCESS,
    accessKeyId: config.awsKeysJayasurya.AWS_ACCESSKEY,
    region: config.awsKeysJayasurya.REGION,
})

const s3 = new aws.S3();

var upload = multer({
    storage: null
})

module.exports = upload;