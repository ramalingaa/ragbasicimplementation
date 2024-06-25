import AWS from 'aws-sdk';

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

// DynamoDB table name for reports
const tableName = 'structured-reports-data';

export async function POST(req: any) {
  try {
    const { reportId, WorkspaceID } = await req.json();

    console.log('reportId', reportId);
    console.log('WorkspaceID', WorkspaceID);

    const params: AWS.DynamoDB.DocumentClient.DeleteItemInput = {
      TableName: tableName,
      Key: {
        PK: `${WorkspaceID}/reports`,
        SK: reportId,
      },
    };

    const result = await dynamoDb.delete(params).promise();

    console.log('Delete operation result:', result);

    return new Response(
      JSON.stringify({
        message: 'Report deleted successfully',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.log('Error deleting report', error);
    return new Response(
      JSON.stringify({
        error: error.toString() || 'An unknown error occurred',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }
}
