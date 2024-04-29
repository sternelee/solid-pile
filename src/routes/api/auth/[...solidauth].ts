import { SolidAuth, type SolidAuthConfig } from '@solid-mediakit/auth'
import GitHub from '@auth/core/providers/github'

const authOpts: SolidAuthConfig = {
  providers: [
    GitHub({
      clientId: import.meta.env.VITE_GITHUB_ID,
      clientSecret: import.meta.env.VITE_GITHUB_SECRET,
    }),
  ],
  debug: false,
  secret: import.meta.env.VITE_AUTH_SECRET,
  trustHost: import.meta.env.VITE_AUTH_TRUST_HOST || false
}

export const { GET, POST } = SolidAuth(authOpts)
