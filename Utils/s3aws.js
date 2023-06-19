const aws = require("aws-sdk");

const multerS3 = require("multer-s3");
config.update({
  accessKeyId: "YOUR_ACCESS_KEY_ID",
  secretAccessKey: "YOUR_SECRET_ACCESS_KEY",
  region: "YOUR_BUCKET_REGION",
});
module.exports = aws;
