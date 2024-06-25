import Papa from 'papaparse';
import axios from 'axios';
import { constructRetDatasource, convertObjectToCSV, getDynamoDBParams, getFileMetadata, getS3FileKey, getSK, uploadToDynamoDB, uploadToS3 } from 'utils/aws_helpers';
import { v4 } from 'uuid';

export async function POST(req: any) {
  try {
    const {
      WorkspaceID,
      instanceUrl,
      apiVersion,
      clientId,
      clientSecret,
      username,
      password,
      filename,
      securityToken,
      userId,
    } = await req.json();

    console.log('WorkspaceID: ', WorkspaceID);
    // Salesforce connection logic
    // Get OAuth2 Access Token
    const authResponse = await axios.post(
      `https://login.salesforce.com/services/oauth2/token`,
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

    const accessToken = authResponse.data.access_token;
    console.log('Access Token:', accessToken);

    // Define the base URL for API requests
    const baseUrl = 'https://' +instanceUrl + '/services/data';

    // Fetch file details from Salesforce
    // Note: Adjust this endpoint according to where and how the file is stored in your Salesforce instance
    const fileDetailsResponse = await axios.get(
      `${baseUrl}/v${apiVersion}/query`,
      {
        params: {
          q: `SELECT Id, Title, VersionData, PathOnClient FROM ContentVersion WHERE Title = '${filename}'`,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    // Check if a file was found
    if (fileDetailsResponse.data.records.length == 0) {
      throw Error('No file found with the specified name.');
    }
    const fileRecord = fileDetailsResponse.data.records[0];

    const fileDownloadUrl = `${baseUrl}/v${apiVersion}/sobjects/ContentVersion/${fileRecord.Id}/VersionData`;

    // Download the file data
    const fileResponse = await axios.get(fileDownloadUrl, {
      responseType: 'arraybuffer',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Here, you could write the file to the local filesystem, send it elsewhere, etc.
    const fileType = fileRecord.PathOnClient.split('.').pop();
    if (fileType.toLowerCase() !== 'csv') {
      throw Error('Only CSV files are supported');
    }
    const fileName = fileRecord.Title + '.' + fileType;
    const uuid = v4()
    const csvBuffer = fileResponse.data;
    const uploadResult = await uploadToS3(csvBuffer, getS3FileKey(WorkspaceID, fileName, uuid));
    console.log('File uploaded:', uploadResult);

    // Get the file first line from the csvBuffer
    const csvString = csvBuffer.toString('utf-8');
    const { data } = Papa.parse(csvString, { header: true });
    const firstRow = data[0];
    console.log({firstRow})
    // Get size of filePathLocal
    const fileMetadata = getFileMetadata(
      WorkspaceID,
      fileName,
      csvBuffer,
      firstRow,
      'salesforce',
    );

    // Save file metadata to DynamoDB
    const params = getDynamoDBParams(fileMetadata, WorkspaceID, uuid, userId);
    await uploadToDynamoDB(params);

    const dataSource = await constructRetDatasource(fileMetadata, uuid, userId, WorkspaceID);

    // Return signed URL and the URL of the uploaded file
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
