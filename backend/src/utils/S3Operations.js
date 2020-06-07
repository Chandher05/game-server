import AWS from 'aws-sdk';
import config from '../../config/index';

AWS.config.update({
    secretAccessKey: config.awsKeysJayasurya.AWS_SECRET_ACCESS,
    accessKeyId: config.awsKeysJayasurya.AWS_ACCESSKEY,
    region: config.awsKeysJayasurya.REGION
})

var s3 = new AWS.S3()

exports.fileupload = async (userName, fileObj) => {
    
    const params = {
        Bucket: "declare-game", 
        Key: `${userName}/${String(fileObj.originalname)}`, 
        ACL: 'public-read', // File name you want to save as in S3
        Body: new Buffer(fileObj.buffer)
    };

    return new Promise((resolve, reject) => {
        s3.upload(params, function (err, data) {
            if (err) {
                throw err;
            }
        })
            .promise()
            .then(async () => {
                var createdURL = s3.getSignedUrl('getObject', { Bucket: "declare-game", Key: `${userName}/${String(fileObj.originalname)}` })
                resolve(createdURL)
            })
    })

}