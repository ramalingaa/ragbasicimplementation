import { BigQuery } from '@google-cloud/bigquery';
import { constructRetDatasource, getDynamoDBParams, getFileMetadata, getS3FileKey, getSK, uploadToDynamoDB, uploadToS3 } from 'utils/aws_helpers';
import { convertStringToAlphanumericAndUnderscoresString, uploadCsvToBigQuery } from 'utils/gcp_helpers';
import { v4 } from 'uuid';

export async function POST(req: any) {
    try {
        const {
            type,
            project_id,
            private_key_id,
            private_key,
            client_email,
            client_id,
            auth_uri,
            token_uri,
            auth_provider_x509_cert_url,
            client_x509_cert_url,
            universe_domain,
            tableName,
            WorkspaceID,
            userId,
        } = await req.json();

        // Construct the BigQuery client object.
        const bigquery = new BigQuery({
            projectId: project_id,
            credentials: {
                type,
                project_id,
                private_key_id,
                private_key,
                client_email,
                client_id,
                auth_uri,
                token_uri,
                auth_provider_x509_cert_url,
                client_x509_cert_url,
                universe_domain,
            }
        } as any);

        // Define the query to select all rows from the dataset.table.
        const query = `SELECT * FROM ${tableName}`;

        const options = {
            query: query,
            location: 'US', // Change to your BigQuery dataset location if necessary.
        };

        // Run the query as a job
        const [job] = await bigquery.createQueryJob(options);
        console.log(`Job ${job.id} started.`);

        // Wait for the query
        const [data] = await job.getQueryResults();
        // convert data to csv
        const csv = `${Object.keys(data[0]).join(',')}\n${data.map((row: any) => Object.values(row).join(',')).join('\n')}`;
        const csvBuffer = Buffer.from(csv, 'utf-8');

        const fileName = `${tableName}_big_query.csv`;
        const uuid = v4();

        const s3Key = getS3FileKey(WorkspaceID, fileName, uuid);
        // Promise wrapper for getSignedUrl to use with async/await
        await uploadToS3(csvBuffer,
            s3Key
        );

        // Get the size of the file
        const firstRow = data[0];

        const fileMetadata = getFileMetadata(
            WorkspaceID,
            fileName,
            csvBuffer,
            firstRow,
            'bigquery',
        );

        // Upload filemetadata to dynamodb
        const dynamoDbParams = getDynamoDBParams(fileMetadata, WorkspaceID, uuid, userId);
        await uploadToDynamoDB(dynamoDbParams);
        await uploadCsvToBigQuery(csvBuffer, convertStringToAlphanumericAndUnderscoresString(WorkspaceID), convertStringToAlphanumericAndUnderscoresString(s3Key), fileMetadata.schema, false);

        const dataSource = await constructRetDatasource(fileMetadata, uuid, userId, WorkspaceID);

        return new Response(
            JSON.stringify({
                dataSource,
            }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );
    }
    catch (error) {
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
