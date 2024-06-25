import axios from 'axios';
import { clearWorkspaceDBDetails, deleteWorkspaceFiles, updateEntityTypesInWorkspace } from 'utils/aws_helpers';
import { ENTITY_TYPE_FILES_DIR } from 'utils/constants';

const AUTH_TOKEN = process.env.AUTH_TOKEN;

export const maxDuration = 300
export async function POST(req: any) {
  try {
    const { backend_url, reqData } = await req.json();

    const reqConf = {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      },
    };
    console.log("reqData:", reqData);
    await clearWorkspaceDBDetails(reqData.workspaceId);
    await deleteWorkspaceFiles(reqData.workspaceId, ENTITY_TYPE_FILES_DIR);
    const result = await axios.post(backend_url, reqData, reqConf);
    console.log("result:", result.data);
    // result: {
    //   status: 'error',
    //   data: {},
    //   error: 'An error occurred (404) when calling the HeadObject operation: Not Found'
    // }
    if (result.data.status === 'error') {
      return new Response(
        JSON.stringify({
          error: result.data.error || 'An unknown error occurred',
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    }
    await updateEntityTypesInWorkspace(reqData.workspaceId, result.data.data);

    if (!Object.keys(result.data).length) {
      return new Response(
        JSON.stringify({
          message: 'No data found',
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    }

    return new Response(
      JSON.stringify({
        message: 'success',
        res: result.data.data
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.log('Error in getEntityTypes route', error);
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
