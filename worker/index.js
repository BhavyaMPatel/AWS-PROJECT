/*
@Author : BhavyaMPatel
*/

import { Consumer } from "sqs-consumer";
import { SQSClient } from "@aws-sdk/client-sqs";
import { StartTranscriptionJobCommand, Type } from "@aws-sdk/client-transcribe";
import { transcribeClient } from "./aws.js"; 
import 'dotenv/config'

const app = Consumer.create({
  queueUrl: process.env.SQS_QUEUE_URL,
    handleMessage: async (message) => {
        console.log(message.Body);
        const Object = JSON.parse(message.Body)
        //Transcribe Service ----------------------------------------------------------------//
        const JOB_NAME = `TranscriptionJob-${Object.userId}-${Object.timeStamp}`;
        const params = {
          TranscriptionJobName: JOB_NAME,
          IdentifyMultipleLanguages : true,
          MediaFormat: "mp3" || "mp4" || "wav" || "flac" || "ogg" || "amr" || "webm" || "m4a",
          Media: {
            MediaFileUri: Object.pathName,
          },
          OutputBucketName: "output-bkt-transcribe",
          OutputKey: `${Object.userId}/${Object.timeStamp}/`,
          Subtitles: {
            Formats : ["vtt","srt"],
            OutputStartIndex:1  
          },
        };

        try {
          const data = await transcribeClient.send(new StartTranscriptionJobCommand(params));
          console.log("Transcription job started:", data.TranscriptionJob.TranscriptionJobName);
        } catch (error) {
          console.error("Error starting transcription job:", error);
        }
        //End of Service ----------------------------------------------------------------//
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

setTimeout(() =>{
  console.log("STARTING ................");
  app.start();
},3000);
