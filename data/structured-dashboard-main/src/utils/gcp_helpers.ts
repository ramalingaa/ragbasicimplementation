import * as Papa from 'papaparse';
import { BigQuery } from '@google-cloud/bigquery';
import { Schema } from 'components/harbor/DataViewModal';
const jsonSchemaBigquery = require('jsonschema-bigquery')

export const getBigQueryClient = () => {
    // Decode the base64 service account JSON
    const serviceAccount = JSON.parse(Buffer.from(process.env.GOOGLE_CLOUD_CREDENTIALS, 'base64').toString('ascii'));

    // Create a BigQuery client with the decoded service account JSON
    const bigQueryClient = new BigQuery({
        credentials: serviceAccount,
        projectId: serviceAccount.project_id,
    });

    return bigQueryClient;
};

const bigQueryClient = getBigQueryClient();

export async function createDataset(datasetId: string) {
    const [dataset] = await bigQueryClient.dataset(datasetId).get({ autoCreate: true });
    console.log(`Dataset ${datasetId} created or already exists.`);
}

function getCsvBufferParsed(csvBuffer: Buffer, allString: Boolean) {
    const csvString = csvBuffer.toString('utf8');
    const parsed = Papa.parse(csvString, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
    });
    if (allString) {
        return parsed.data.map((row: Record<string, any>) =>
            Object.fromEntries(
                Object.entries(row).map(([key, value]) => {
                    // Convert each value to string, including booleans and numbers
                    const stringValue = (value !== null && value !== undefined) ? value.toString() : '';
                    return [key, stringValue];
                })
            )
        );
    }
    return parsed.data;
}
export async function createDatasetIfNotExists(datasetId: string) {
    try {
        const dataset = bigQueryClient.dataset(datasetId);
        const [exists] = await dataset.exists();
        if (!exists) {
            await dataset.create();
            console.log(`Dataset ${datasetId} created.`);
        }
    } catch (error) {
        console.error('Error creating dataset:', error);
        throw error;
    }
}

export async function uploadCsvToBigQuery(
    csvBuffer: Buffer,
    datasetId: string,
    tableId: string,
    firstRow: Schema[],
    allStrings: Boolean
): Promise<void> {
    try {
        await createDatasetIfNotExists(datasetId); // Ensure dataset exists

        const rows = getCsvBufferParsed(csvBuffer, allStrings);
        if (!rows.length) {
            throw new Error('No data rows found in the CSV.');
        }

        // Step 5: Schema Definition
        // const schema = await inferSchemaFromCsvData(parsed.data);
        // console.log("schema1", schema)
        const schema = {
            fields: firstRow.map(field => ({
                name: field.columnName,
                type: allStrings ? "STRING" : field.columnType.toUpperCase().replace('NUMBER', 'FLOAT64'),
            }))
        };

        // Step 6: Table Management
        const dataset = bigQueryClient.dataset(datasetId);
        const table = dataset.table(tableId); ``
        try {
            await table.create({ schema });
        } catch (error: any) {
            if (!error.message.includes('Already Exists')) {
                throw error;
            }
            console.log('Table already exists, proceeding with insert.');
        }

        console.log('Rows:', rows);

        // Step 8: Insert Data
        const [insertErrors] = await table.insert(rows).catch(err => [err]);

        // Step 9: Logging and Final Output
        if (insertErrors && insertErrors.length) {
            console.error('Error inserting data:', insertErrors);
        } else {
            console.log(`Inserted ${rows.length} rows.`);
        }
    } catch (error: any) {
        console.error('Failed to upload CSV:', error);
        throw error;  // Ensure errors are thrown appropriately
    }
}

export function convertStringToAlphanumericAndUnderscoresString(str: string) {
    return str.replace(/[^a-zA-Z0-9_]/g, '_');
}

export async function deleteTableFromDataset(datasetId:string, tableId:string) {
    const dataset = bigQueryClient.dataset(datasetId);
    const table = dataset.table(tableId);
    try {
        await table.delete();
        console.log(`Table ${tableId} deleted.`);
    } catch (error) {
        console.error('Error deleting table:', error);
        throw error;
    }
}