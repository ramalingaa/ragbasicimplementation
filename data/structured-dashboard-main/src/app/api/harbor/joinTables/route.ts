import axios from 'axios';

const AUTH_TOKEN = process.env.AUTH_TOKEN;

export const maxDuration = 300
export async function POST(req: any) {
  try {
    const { backend_url, joinData } = await req.json();

    const joinConfig = {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      },
    };

    const result = await axios.post(backend_url, joinData, joinConfig);
    // console.log('Join table result:', result);
    console.log("Join table result:", result.data);

    if (!Object.keys(result.data).length) {
      return new Response(
        JSON.stringify({
          message: 'Could not join these sources. Please try again with different sources',
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
        message: 'Tables joined successfully',
        datasource: result.data
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.log('Error joining table', error);
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
