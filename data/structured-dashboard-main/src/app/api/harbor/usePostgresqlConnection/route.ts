import pgPromise from "pg-promise";
import { constructRetDatasource, convertObjectToCSV, getDynamoDBParams, getFileMetadata, getS3FileKey, getSK, uploadToDynamoDB, uploadToS3 } from 'utils/aws_helpers';
import { convertStringToAlphanumericAndUnderscoresString, uploadCsvToBigQuery } from "utils/gcp_helpers";
import { v4 } from "uuid";

const pgp = pgPromise({});

async function fetchDataAndConvertToCsv(db: any, tableName: string): Promise<Buffer> {
    // Query the database for the first 10 rows of the table
    const queryText = `SELECT * FROM ${tableName} LIMIT 10`;
    const data = await db.any(queryText);

    if (data.length === 0) {
        throw new Error("No data found in the table.");
    }

    // Extract column headers from the first row
    const headers = Object.keys(data[0]);

    // Convert data to CSV format
    const csvRows = data.map((row: any) =>
        headers.map(header => `"${String(row[header]).replace(/"/g, '""')}"`).join(',')
    );
    const csv = [headers.join(','), ...csvRows].join('\n');

    // Convert the CSV string to a Buffer
    const csvBuffer = Buffer.from(csv, 'utf-8');
    return csvBuffer;
}

// Write a post method to save WorkspaceID,accessKeyID,secretAccessKey,bucketName,region in the database
export async function POST(req: any) {
    try {
        const {
            hostName,
            port,
            databaseName,
            userName,
            password,
            tableName,
            WorkspaceID,
            userId,
        } = await req.json();

        const db = pgp({
            host: hostName,
            port: port,
            database: databaseName,
            user: userName,
            password: password,
            ssl: {
                rejectUnauthorized: false
            },
        });

        const queryText = `SELECT * FROM ${tableName} LIMIT 10`;
        const data = await db.any(queryText);
        // convert data to csv
        // const csv = data.map((row: any) => Object.values(row).join(',')).join('\n');
        const csvBuffer = await fetchDataAndConvertToCsv(db, tableName);

        const fileName = `${tableName}_${databaseName}.csv`;
        const uuid = v4();

        const s3Key = getS3FileKey(WorkspaceID, fileName, uuid);
        // Promise wrapper for getSignedUrl to use with async/await
        await uploadToS3(csvBuffer, s3Key);

        // Get the size of the file
        const firstRow = data[0];

        const fileMetadata = getFileMetadata(
            WorkspaceID,
            fileName,
            csvBuffer,
            firstRow,
            'postgresql',
        );

        // Upload filemetadata to dynamodb
        const dynamoDbParams = getDynamoDBParams(fileMetadata, WorkspaceID, uuid, userId);
        await uploadToDynamoDB(dynamoDbParams);
        await uploadCsvToBigQuery(csvBuffer, convertStringToAlphanumericAndUnderscoresString(WorkspaceID), convertStringToAlphanumericAndUnderscoresString(s3Key), fileMetadata.schema, true);

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
    finally {
        pgp.end();
    }
}
