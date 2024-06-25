import NextAuth from 'next-auth/next';
import { Session, User } from 'next-auth';
import Auth0Provider from 'next-auth/providers/auth0';

declare module 'next-auth' {
  interface User {
    id?: string | number;
  }

  interface Session {
    user: User;
  }
}

interface SessionCallbackParams {
  session: Session;
  token: any;
  user: User;
}

const authOptions = {
  providers: [
    Auth0Provider({
      clientId: process.env.NEXTAUTH_AUTH0_CLIENT_ID as string,
      clientSecret: process.env.NEXTAUTH_AUTH0_CLIENT_SECRET as string,
      issuer: process.env.NEXTAUTH_AUTH0_DOMAIN,
      authorization:
        `https://${process.env.NEXTAUTH_AUTH0_DOMAIN}/authorize?response_type=code&prompt=login` as string,
    }),
  ],
  secret: process.env.AUTH0_SECRET,
  callbacks: {
    session: async (params: SessionCallbackParams) => {
      const modifiedSession: Session = {
        ...params.session,
        user: {
          ...params.session.user,
          id: params.token.sub as string,
        },
      };

      return modifiedSession;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
