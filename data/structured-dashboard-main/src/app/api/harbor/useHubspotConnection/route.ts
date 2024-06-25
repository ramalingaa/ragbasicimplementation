import axios from 'axios';
import { constructRetDatasource, convertObjectToCSV, flattenObject, getDynamoDBParams, getFileMetadata, getS3FileKey, getSK, uploadToDynamoDB, uploadToS3 } from 'utils/aws_helpers';
import { convertStringToAlphanumericAndUnderscoresString, uploadCsvToBigQuery } from 'utils/gcp_helpers';
import { v4 } from 'uuid';
import Papa from 'papaparse';
import { Buffer } from 'buffer';

async function fetchCRMCollection(apiKey: string, entity: string) {
    try {
        const apiPath = `/crm/v3/objects/${entity}`;
        const response = await axios.get(`https://api.hubapi.com${apiPath}`, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });
        const data = response.data;
        return data.results
    } catch (error) {
        console.error(`Error fetching ${entity}:`, error);
        return null;
    }
}

function convertCsvValuesToStrings(csvBuffer: Buffer): Buffer {
    // Decode the buffer to a string
    const csvString = csvBuffer.toString('utf-8');

    // Parse the CSV data
    const parsed = Papa.parse(csvString, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
    });

    // Modify each field to ensure it is a string
    const modifiedData = parsed.data.map((row: Record<string, any>) =>
        Object.fromEntries(
            Object.entries(row).map(([key, value]) => [key, value.toString()])
        )
    );

    // Unparse (convert back) the data to a CSV string
    const modifiedCsvString = Papa.unparse(modifiedData, {
        header: true,
    });

    // Convert the modified CSV string back to a buffer
    return Buffer.from(modifiedCsvString, 'utf-8');
}

export async function POST(req: any) {
    try {
        const {
            WorkspaceID,
            apiKey,
            portalId,
            userId,
        } = await req.json();

        console.log('userId: ', WorkspaceID);

        const entities = ['contacts', 'companies', 'deals', 'tickets', 'products', 'line_items', 'quotes'];
        // const entities = ['companies'];

        let newDataSources = [];
        let errors = [];
        for (const entity of entities) {
            const data = await fetchCRMCollection(apiKey, entity);
            if (!data) {
                errors.push(`Insufficient permissions fetching ${entity}`);
                continue;
            }
            const csvBuffer = convertCsvValuesToStrings(convertObjectToCSV(data));
            const fileName = `${entity}_hubspot.csv`;
            const uuid = v4();

            const s3Key = getS3FileKey(
                WorkspaceID,
                fileName,
                uuid
            );
            await uploadToS3(csvBuffer, s3Key);

            // Get the size of the file
            const firstRow = flattenObject(data[0], '', {});
            console.log('First row:', firstRow);
            const fileMetadata = getFileMetadata(WorkspaceID, fileName, csvBuffer, firstRow, 'hubspot');
            const dynamoDbParams = getDynamoDBParams(fileMetadata, WorkspaceID, uuid, userId);
            await uploadToDynamoDB(dynamoDbParams);
            await uploadCsvToBigQuery(csvBuffer, convertStringToAlphanumericAndUnderscoresString(WorkspaceID), convertStringToAlphanumericAndUnderscoresString(s3Key), fileMetadata.schema, true);

            const dataSource = await constructRetDatasource(fileMetadata, uuid, userId, WorkspaceID);
            newDataSources.push(dataSource);
        }

        if (newDataSources.length === 0) {
            throw new Error(errors.join('\n'));
        }

        return new Response(
            JSON.stringify({
                newDataSources,
                errors
            }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error || `An unknown error occurred` }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );
    }

}