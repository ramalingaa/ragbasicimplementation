import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';

export default async function ProfileServer() {
  const session = await getSession();
  if (session?.user) {
    redirect('/harbor');
  } else {
    redirect('/auth/sign-in');
  }
}
