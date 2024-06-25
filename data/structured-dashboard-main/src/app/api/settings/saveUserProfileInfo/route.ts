import { updateUserProfileInfo } from 'utils/aws_helpers';

export async function POST(req: any) {
  try {
    const { email, phoneNumber, userId, name, company, techStack } =
      await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({
          error: 'email, phoneNumber, and userId are required',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    }
    console.log(email || '', phoneNumber || '', name || '', company || '', techStack || '')
    await updateUserProfileInfo(
      email,
      phoneNumber,
      userId,
      name,
      company,
      techStack,
    );

    return new Response(
      JSON.stringify({
        message: 'User profile information updated successfully',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.error('Error updating user profile information:', error);
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
