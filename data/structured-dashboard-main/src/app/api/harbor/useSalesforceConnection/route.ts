import axios from 'axios';
import { constructRetDatasource, convertObjectToCSV, flattenObject, getDynamoDBParams, getFileMetadata, getS3FileKey, getSK, uploadToDynamoDB, uploadToS3 } from 'utils/aws_helpers';
import { convertStringToAlphanumericAndUnderscoresString, uploadCsvToBigQuery } from 'utils/gcp_helpers';
import { v4 } from 'uuid';

// Salesforce Authentication
async function authenticateSalesforce(
  clientId: string,
  clientSecret: string,
  username: string,
  password: string,
  securityToken: string,
) {
  const response = await axios.post(
    'https://login.salesforce.com/services/oauth2/token',
    null,
    {
      params: {
        grant_type: 'password',
        client_id: clientId,
        client_secret: clientSecret,
        username: username,
        password: password + securityToken,
      },
    },
  );
  return response.data;
}

// Fetch Total Number of Records for Pagination
async function fetchTotalRecords(
  accessToken: string,
  instanceUrl: string,
  object: string,
) {
  const query = `SELECT count() FROM ${object}`;
  const url = `https://${instanceUrl}/services/data/v53.0/query?q=${encodeURIComponent(
    query,
  )}`;
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data.totalSize;
}

// Fetch Records in Blocks of 200
async function fetchRecordsInBlocks(
  accessToken: string,
  instanceUrl: string,
  object: string,
  totalRecords: number,
) {
  let records: any[] = [];
  //   for (let offset = 0; offset < totalRecords; offset += 200) {
  for (let offset = 0; offset < 401; offset += 200) {
    const query = `SELECT fields(all) FROM ${object} LIMIT 200 OFFSET ${offset}`;
    const url = `https://${instanceUrl}/services/data/v53.0/query?q=${encodeURIComponent(
      query,
    )}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    records = records.concat(response.data.records);
  }
  return records;
}

export async function POST(req: any) {
  try {
    // Extract request parameters here...
    const {
      WorkspaceID,
      instanceUrl,
      apiVersion,
      clientId,
      clientSecret,
      username,
      password,
      securityToken,
      salesforceImport,
      userId,
    } = await req.json();

    const authData = await authenticateSalesforce(
      clientId,
      clientSecret,
      username,
      password,
      securityToken,
    );
    const accessToken = authData.access_token;
    // Salesforce objects to fetch
    // const objects = ['Account', 'Contact', 'Lead', 'Campaign'];
    let dataSourcesRes: any = [];
    // for (const object of objects) {
    const object = salesforceImport;
    const totalRecords = await fetchTotalRecords(
      accessToken,
      instanceUrl,
      object,
    );
    console.log('Total records:', totalRecords);
    const records = await fetchRecordsInBlocks(
      accessToken,
      instanceUrl,
      object,
      totalRecords,
    );
    console.log('Records:', records.length);
    const csvData = convertObjectToCSV(records);
    const firstRow = flattenObject(records[0], '', {});

    const fileName = `${object}.csv`;
    const uuid = v4();

    const s3Key = getS3FileKey(WorkspaceID, fileName, uuid);
    const uploadResult = await uploadToS3(csvData, s3Key);

    // Get file metadata
    const fileMetadata = getFileMetadata(
      WorkspaceID,
      fileName,
      csvData,
      firstRow,
      'salesforce',
    )
    console.log('fileMetadata', fileMetadata);

    // Save file metadata to DynamoDB
    const params = getDynamoDBParams(fileMetadata, WorkspaceID, uuid, userId);
    await uploadToDynamoDB(params);
    await uploadCsvToBigQuery(csvData, convertStringToAlphanumericAndUnderscoresString(WorkspaceID), convertStringToAlphanumericAndUnderscoresString(s3Key), fileMetadata.schema, false);
    const dataSource = await constructRetDatasource(fileMetadata, uuid, userId, WorkspaceID);
    dataSourcesRes.push(dataSource);

    return new Response(
      JSON.stringify({
        dataSourcesRes,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.error('Error:', error);
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
