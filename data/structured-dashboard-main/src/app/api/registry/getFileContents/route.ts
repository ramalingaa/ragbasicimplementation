import AWS from 'aws-sdk';
import { getS3FileKey } from 'utils/aws_helpers';

// Configure AWS SDK
AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();

// Use environment variables for sensitive information
const bucket = 'structured-harbor-uploads-v0';

export async function POST(req: any) {
  try {
    const { WorkspaceID, fileName, uuid, s3Dir } = await req.json();
    const fileKey = getS3FileKey(
      WorkspaceID,
      fileName,
      uuid,
      s3Dir,
    );

    const s3Params = {
      Bucket: bucket,
      Key: fileKey,
    };

    // Promise wrapper for getObject to use with async/await
    const getFilePromise = () =>
      new Promise((resolve, reject) => {
        s3.getObject(s3Params, (err, data) => {
          if (err) return reject(err);
          // Convert the file buffer to base64
          const fileContentsBase64 = data.Body.toString('base64');
          resolve(fileContentsBase64);
        });
      });

    const fileContents = await getFilePromise();
    // Return the file contents in base64
    return new Response(
      JSON.stringify({
        fileContents,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.error('error: ', error);
    return new Response(
      JSON.stringify({ error: error || 'An unknown error occurred' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }
}
