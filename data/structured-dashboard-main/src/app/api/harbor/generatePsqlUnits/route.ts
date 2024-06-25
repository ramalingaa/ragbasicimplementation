import AWS from 'aws-sdk';
import { Client } from 'pg';
import { Readable } from 'stream';
import { generateRandomString, getFilesFromS3, getWorkspaceDetails, saveWorkspaceDBDetails } from 'utils/aws_helpers';
import Papa from 'papaparse';

export const maxDuration = 300;
async function createRDSInstance(instanceIdentifier: string, masterUserName: string, masterPassword: string) {
    const rds = new AWS.RDS();

    const params: AWS.RDS.Types.CreateDBInstanceMessage = {
        DBInstanceIdentifier: instanceIdentifier,
        AllocatedStorage: 20,
        DBInstanceClass: 'db.t3.medium',
        Engine: 'postgres',
        MasterUsername: masterUserName,
        MasterUserPassword: masterPassword,
        DBName: instanceIdentifier,
        BackupRetentionPeriod: 0,
        MultiAZ: false,
        EngineVersion: '15',
        PubliclyAccessible: true,
        StorageType: 'gp2',
    };

    try {
        const response = await rds.createDBInstance(params).promise();
        console.log("RDS instance creation started successfully:", response.DBInstance.Endpoint);
        const connDetails = await waitForInstanceAvailability(instanceIdentifier, masterUserName, masterPassword);
        return connDetails;
    } catch (error) {
        console.error("Failed to create RDS instance:", error);
        throw error;
    }
}

async function waitForInstanceAvailability(instanceIdentifier: string, masterUserName: string, masterPassword: string) {
    const rds = new AWS.RDS();
    let instanceAvailable = false;

    console.log('Waiting for instance to become available...');

    while (!instanceAvailable) {
        const { DBInstances } = await rds.describeDBInstances({ DBInstanceIdentifier: instanceIdentifier }).promise();
        const dbInstance = DBInstances[0];

        if (dbInstance.DBInstanceStatus === 'available') {
            instanceAvailable = true;
            const endpoint = dbInstance.Endpoint.Address;
            const port = dbInstance.Endpoint.Port;
            console.log(`Instance is now available. Endpoint: ${endpoint}, Port: ${port}`);
            return { endpoint, port, instanceIdentifier, masterUserName, masterPassword }
        } else {
            console.log(`Current status: ${dbInstance.DBInstanceStatus}`);
            await new Promise(resolve => setTimeout(resolve, 10000)); // Wait for 10 seconds before checking again
        }
    }
    throw new Error('Instance did not become available in the expected time.');
}

function constructConnectionString(host: string, port: number, dbName: string, username: string, password: string): string {
    return `postgresql://${username}:${password}@${host}:${port}/${dbName}`;
}

async function createPsqlClient(host: string, port: number, dbName: string, masterUserName: string, masterPassword: string) {
    const client = new Client({
        host: host,
        user: masterUserName,
        password: masterPassword,
        database: dbName,
        port: port,
        ssl: {
            rejectUnauthorized: false // Note: For production, ensure you handle SSL properly.
        }
    });
    await client.connect();
    return client;
}

async function handleCsvData(buffer: Buffer, tableName: string, client: Client) {
    try {
        tableName = tableName.replace(/\s+/g, '_');
        let createTableSQL = `CREATE TABLE IF NOT EXISTS ${tableName} (id_primary_key SERIAL PRIMARY KEY`;

        const dataString = buffer.toString('utf-8'); // Convert buffer to string

        const parseResult = Papa.parse(dataString, {
            header: true,
            skipEmptyLines: true,
            transformHeader: header => header.trim(),
            complete: (results) => {
                const headers = results.meta.fields;
                if (headers) {
                    headers.forEach((header: string) => {
                        createTableSQL += `, "${header.replace(/\s+/g, '_').replace(/"/g, '""')}" TEXT`;
                    });
                    createTableSQL += ')';
                }
            }
        });

        if (parseResult.errors.length > 0) {
            throw new Error('Errors occurred while parsing CSV: ' + JSON.stringify(parseResult.errors));
        }
        console.log('createTableSQL:', createTableSQL)
        // Execute table creation
        await client.query(createTableSQL);

        // Insert data rows
        for (const row of parseResult.data) {
            const columns = Object.keys(row).map(key => `"${key.replace(/"/g, '""')}"`).join(', ');
            const values = Object.values(row).map(value => `'${value.toString().replace(/'/g, "''")}'`).join(', ');
            const insertSQL = `INSERT INTO ${tableName} (${columns}) VALUES (${values});`;
            console.log('Inserting row:', insertSQL)
            await client.query(insertSQL);
        }

        console.log('CSV data has been inserted into the database');
    } catch (error) {
        console.error('Failed to process CSV data:', error);
    }
}

async function endClientConn(client: Client) {
    await client.end();
}

export async function POST(req: any) {
    try {
        const { workspaceId } = await req.json();
        const buffer = await getFilesFromS3(workspaceId);
        console.log('buffer: ', buffer)
        const workspace = await getWorkspaceDetails(workspaceId);

        // Get the RDS instance connection details and insert the files into the db
        const masterUserName = generateRandomString(10);
        const masterPassword = generateRandomString(20);
        const RDSInstanceName = `structured${workspace.Item.WorkspaceName}${generateRandomString(5)}`
        const { endpoint: host, port, instanceIdentifier, masterUserName: x, masterPassword: y } = await createRDSInstance(RDSInstanceName, masterUserName, masterPassword);
        console.log({ endpoint: host, port, instanceIdentifier, masterUserName: x, masterPassword: y })

        // const host = 'test12.c2dcdeg6ut5n.us-east-2.rds.amazonaws.com';
        // const port = 5432;
        // const instanceIdentifier = 'test12';
        // const masterUserName = 'gl4QgYHrxy';
        // const masterPassword = 'l2FoV5TGGononZEgcjlg';

        const psqlClient = await createPsqlClient(host, port, instanceIdentifier, masterUserName, masterPassword);
        for (const { fileKey, fileName, fileContents } of buffer) {
            try {
                await handleCsvData(fileContents as Buffer, fileName.replace('.csv', ''), psqlClient);
            } catch (error) {
                console.error('Failed to process CSV data:', error);
            }
        }
        await endClientConn(psqlClient);
        await saveWorkspaceDBDetails(workspaceId, host, port, instanceIdentifier, masterUserName, masterPassword);

        return new Response(
            JSON.stringify({
                message: 'success',
                data: {
                    host,
                    port,
                    instanceIdentifier,
                    masterUserName,
                    masterPassword,
                }
            }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        },);
    }
    catch (error) {
        console.error('error: ', error);
        return new Response(
            JSON.stringify({ error: error || 'An unknown error occurred' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}