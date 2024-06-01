/*
@Author : BhavyaMPatel
@BhavyaMPatel
#Use Worker In Different Environment/Server
*/

import { Consumer } from "sqs-consumer";
import { SQSClient } from "@aws-sdk/client-sqs";

const app = Consumer.create({
    queueUrl: process.env.SQS_QUEUE_URL,
    handleMessage: async (message) => {
        console.log(message.Body);
        //Transcribe Service
        
        
    },
    sqs: new SQSClient({
      region: process.env.REGION,
      credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_KEY,
      },
    }),
});
  

app.on("error", (err) => {
  console.error("Me"+err.message);
});

app.on("processing_error", (err) => {
  console.error(err.message);
});

app.start();