const AWS = require("aws-sdk");

// const multerS3 = require("multer-s3");
AWS.config.update({
  accessKeyId: "YOUR_ACCESS_KEY_ID",
  secretAccessKey: "YOUR_SECRET_ACCESS_KEY",
  region: "YOUR_BUCKET_REGION",
});
const s3 = new AWS.S3();
module.exports = s3;
