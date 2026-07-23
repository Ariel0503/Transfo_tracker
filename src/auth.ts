import NextAuth from "next-auth";
import Keycloak from "next-auth/providers/keycloak";

type KeycloakProfile = {
  realm_access?: {
    roles?: string[];
  };
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Keycloak],
  callbacks: {
    authorized({ auth }) {
      return Boolean(auth?.user);
    },
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
      }

      const keycloakProfile = profile as KeycloakProfile | undefined;
      token.roles = keycloakProfile?.realm_access?.roles ?? [];

      return token;
    },
    async session({ session, token }) {
      session.user.roles = Array.isArray(token.roles) ? token.roles : [];
      session.accessToken = typeof token.accessToken === "string" ? token.accessToken : undefined;
      return session;
    },
  },
});