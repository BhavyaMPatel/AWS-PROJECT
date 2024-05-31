const express = require('express')
const app = express()
const port = process.env.PORT || 3000;
const multer = require('multer')
const upload = multer();

const configureAWS = require('./AWS_Configuration/aws.js');

const initialize = async () => {
  try {
    const {s3,sqs} = await configureAWS();
    
    app.get('/', (req, res) => {
      res.send('Hello World! Test')
    })
    
    app.post('/upload', upload.single('file'), async (req, res) => {
        try {

          const fileBuffer = req.file.buffer;
          const userName = req.body.userName;
          const timeStamp = new Date().getTime();

          //@S3 Upload Section 
          const S3params = {
            Bucket: `${process.env.BUCKET_NAME}/${userName}/${timeStamp}`,
            Key: req.file.originalname,
            Body: fileBuffer,
          };
          await s3.putObject(S3params).promise();
          // --------------------------------------------------------//


          //@SQS Upload Section
          const path_name = `s3://${process.env.BUCKET_NAME}/${userName}/${timeStamp}`;
          const SQSparams = {
            DelaySeconds: 10,
            MessageBody: path_name,
            QueueUrl: process.env.SQL_QUEUE_URL,
          };

          sqs.sendMessage(SQSparams, function (err, data) {
            if(err)
              console.log("Error", err);
            else
              console.log("Success", data.MessageId);
          });
          //---------------------------------------------------------//


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


initialize()
