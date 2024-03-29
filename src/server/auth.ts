import GithubProvider from "@auth/core/providers/github";
import GoogleProvider from "@auth/core/providers/google";
import type { SolidAuthConfig } from "@solid-mediakit/auth/src/index";

export const authOptions: SolidAuthConfig = {
  secret: import.meta.env.VITE_AUTH_SECRET,
  providers: [
    GithubProvider({
      clientId: process.env.VITE_GITHUB_ID as string,
      clientSecret: process.env.VITE_GITHUB_SECRET as string
    }),
    GoogleProvider({
      clientId: process.env.VITE_GOOGLE_ID as string,
      clientSecret: process.env.VITE_GOOGLE_SECRET as string
    })
  ]
};
