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
    const { WorkspaceID } = await req.json();
    console.log('WorkspaceID', WorkspaceID);

    // Scan the table to get all reports for the user
    const scanParams: AWS.DynamoDB.DocumentClient.ScanInput = {
      TableName: tableName,
      FilterExpression: 'begins_with(PK, :WorkspaceID)',
      ExpressionAttributeValues: {
        ':WorkspaceID': `${WorkspaceID}/reports`,
      },
    };
    const scanResult = await dynamoDb.scan(scanParams).promise();
    const reports = scanResult.Items;

    if (reports && reports.length > 0) {
      // Split the reports into batches of 25 items
      const batches = [];
      while (reports.length > 0) {
        batches.push(reports.splice(0, 25));
      }

      // Delete each batch of reports using batch write operations
      for (const batch of batches) {
        const batchWriteParams: AWS.DynamoDB.DocumentClient.BatchWriteItemInput =
          {
            RequestItems: {
              [tableName]: batch.map((report) => ({
                DeleteRequest: {
                  Key: {
                    PK: report.PK,
                    SK: report.SK,
                  },
                },
              })),
            },
          };
        const batchWriteResult = await dynamoDb
          .batchWrite(batchWriteParams)
          .promise();
        console.log('Batch delete operation result:', batchWriteResult);
      }
    }

    return new Response(
      JSON.stringify({ message: 'All reports deleted successfully' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.log('Error deleting reports', error);
    return new Response(
      JSON.stringify({
        error: error.toString() || 'An unknown error occurred',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
