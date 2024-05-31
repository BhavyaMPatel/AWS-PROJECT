const express = require('express')
const app = express()
const port = process.env.PORT || 3333;
const multer = require('multer')
const upload = multer();

const configureAWS = require('./AWS_Configuration/aws.js');

const initializeS3 = async () => {
  try {
    const s3 = await configureAWS();

    console.log(s3);

    app.get('/', (req, res) => {
      res.send('Hello World! Test')
    })
    
    app.post('/upload', upload.single('file'), async (req, res) => {
        try {
          const fileBuffer = req.file.buffer;
          const userName = req.body.userName;
          const params = {
            Bucket: `${process.env.BUCKET_NAME}/${userName}`,
            Key: req.file.originalname,
            Body: fileBuffer,
          };
      
          // Upload the file to S3
          await s3.putObject(params).promise();
      
          res.status(200).json({ message: 'File uploaded successfully!' });
        } catch (error) {
          console.error('Error uploading file:', error);
          res.status(500).json({ error: 'Failed to upload file' });
        }
    });
    
    
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`)
    })

  }catch (err) {
    console.log("AWS INIT ERROR: " + err);
  }
}


initializeS3()
