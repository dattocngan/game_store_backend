const path = require("path");

const { S3 } = require("aws-sdk");
const uuid = require("uuid").v4;

exports.s3Upload = async (files) => {
  const s3 = new S3();

  const params = files.map((file) => {
    let key = `images/${uuid() + path.extname(file.originalname)}`;
    if (file.fieldname === "download_link") {
      key = `applications/${uuid() + path.extname(file.originalname)}`;
    }
    return {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
    };
  });

  return await Promise.all(params.map((param) => s3.upload(param).promise()));
};
