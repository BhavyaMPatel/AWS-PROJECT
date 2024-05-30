// aws.js
// {
//   "@Author":"BhavyaMPatel"
// }

const AWS = require('aws-sdk');

const configureAWS = () => {
  return new Promise((resolve, reject) => {
    AWS.config.update({
      accessKeyId: process.env.ACCESS_KEY,
      secretAccessKey: process.env.SECRET_KEY,
      region: process.env.REGION,
    });

    // Optionally, you can initialize other AWS services here if needed
    const s3 = new AWS.S3();
    
    resolve(s3); // Resolve with the configured S3 object
  });
};

module.exports = configureAWS;
