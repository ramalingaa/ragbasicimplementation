import snowflake from 'snowflake-sdk';
import { constructRetDatasource, convertObjectToCSV, flattenObject, getDynamoDBParams, getFileMetadata, getS3FileKey, getSK, uploadToDynamoDB, uploadToS3 } from 'utils/aws_helpers';
import { convertStringToAlphanumericAndUnderscoresString, uploadCsvToBigQuery } from 'utils/gcp_helpers';
import { v4 } from 'uuid';

export async function POST(req: any) {
    try {
        const {
            account,
            username,
            password,
            application,
            role,
            warehouse,
            database,
            schema,
            tableName,
            WorkspaceID,
            userId,
        } = await req.json();

        const snowflakeConfig: snowflake.ConnectionOptions = {
            account,
            username,
            password,
            warehouse,
            database,
            schema,
        };

        // Check if application and role are not empty strings before adding them to the snowflakeConfig object
        if (application !== '') {
            snowflakeConfig.application = application;
        }
        if (role !== '') {
            snowflakeConfig.role = role;
        }
        const connection: snowflake.Connection = snowflake.createConnection(snowflakeConfig);

        console.log('Successfully connected to Snowflake.');
        let dataSourceRet = null;
        let data = null;
        // Asynchronously connect to Snowflake, and upon successful connection, execute the given callback function.
        try {
            await new Promise((resolve, reject) => {
                connection.connect((err, conn) => {
                    if (err) {
                        console.error('Unable to connect to Snowflake: ', err.message);
                        reject(err);
                    } else {
                        console.log('Successfully connected to Snowflake');
                        resolve(conn);
                    }
                });
            });

            // Query to select all data from the specified table
            const query = `SELECT * FROM ${tableName}`;

            // Execute the query and return the result as a CSV buffer
            const result = await new Promise((resolve, reject) => {
                connection.execute({
                    sqlText: query,
                    complete: async (err, stmt, dataRet) => {
                        if (err) {
                            console.error('Failed to execute query: ', err.message);
                            reject(err);
                        } else {
                            console.log('Query executed successfully');
                            resolve(dataRet);
                            data = dataRet;
                            return data;
                        }
                    },
                });
            }).then(() => {
                console.log("Operations completed, destroying connection...");
                connection.destroy(function (err, conn) {
                    if (err) {
                        console.error('Unable to disconnect: ' + err.message);
                    } else {
                        console.log('Disconnected connection with id: ' + connection.getId());
                    }
                });
            }).catch((error) => {
                console.error("Error in operations: ", error);
            });

            // CODE NEVER REACHES HERE, please correct the code
            if (!data) {
                throw new Error('No data returned from Snowflake');
            }

            const csvBuffer = convertObjectToCSV(data);
            const fileName = `${tableName}_snowflake.csv`;
            const uuid = v4()
            const s3Key = getS3FileKey(
                WorkspaceID,
                fileName,
                uuid
            );
            await uploadToS3(
                csvBuffer, s3Key
            )
            // Get the size of the file
            const firstRow = flattenObject(data[0], '', {});
            const fileMetadata = getFileMetadata(WorkspaceID, fileName, csvBuffer, firstRow, 'snowflake');

            // Upload filemetadata to dynamodb
            const dynamoDbParams = getDynamoDBParams(fileMetadata, WorkspaceID, uuid, userId);
            await uploadToDynamoDB(dynamoDbParams);
            await uploadCsvToBigQuery(csvBuffer, convertStringToAlphanumericAndUnderscoresString(WorkspaceID), convertStringToAlphanumericAndUnderscoresString(s3Key), fileMetadata.schema, false);
            
            dataSourceRet = await constructRetDatasource(
                fileMetadata, uuid, userId, WorkspaceID
            )

            return new Response(
                JSON.stringify({
                    dataSource: dataSourceRet,
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
                JSON.stringify({ error: error || 'An unknown error occurred' }),
                {
                    status: 500,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            );
        }
    } catch (error) {
        console.log('error: ', JSON.stringify(error, null, 2));
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

