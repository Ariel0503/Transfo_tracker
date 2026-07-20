// auth.ts
import NextAuth from 'next-auth';
import Keycloak from 'next-auth/providers/keycloak';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Keycloak],
  callbacks: {
    // Enforced by middleware on matched routes.
    authorized({ auth }) {
      return !!auth?.user;
    },
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
      }
      if (profile) {
        // Keycloak realm roles live under realm_access.roles.
        token.roles = (profile as { realm_access?: { roles?: string[] } })
          .realm_access?.roles ?? [];
      }
      return token;
    },
    async session({ session, token }) {
      session.user.roles = (token.roles as string[]) ?? [];
      session.accessToken = token.accessToken as string | undefined;
      return session;
    },
  },
});