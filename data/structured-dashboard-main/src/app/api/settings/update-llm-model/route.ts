import { updateLLMModel } from 'utils/aws_helpers';

export async function POST(req: any) {
  try {
    const { userId, llmModel } = await req.json();

    if (!userId || !llmModel) {
      return new Response(
        JSON.stringify({
          error: 'userId and llmModel are required',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    }

    await updateLLMModel(userId, llmModel);

    return new Response(
      JSON.stringify({
        message: 'LLM model updated successfully',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.error('Error updating LLM model:', error);
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
