import { TranscribeClient } from "@aws-sdk/client-transcribe";

const transcribeClient = new TranscribeClient({
    region: process.env.REGION,
    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_KEY,
    },
});

export { transcribeClient };
