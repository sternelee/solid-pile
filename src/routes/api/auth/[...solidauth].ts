import { SolidAuth, type SolidAuthConfig } from '@solid-mediakit/auth'
import GitHub from '@auth/core/providers/github'
import Google from '@auth/core/providers/google'

const authOpts: SolidAuthConfig = {
  providers: [
    GitHub({
      clientId: process.env.VITE_GITHUB_ID,
      clientSecret: process.env.VITE_GITHUB_SECRET,
    }),
    Google({
      clientId: process.env.VITE_GOOGLE_ID,
      clientSecret: process.env.VITE_GOOGLE_SECRET,
    })
  ],
  debug: false,
  secret: process.env.VITE_AUTH_SECRET,
  trustHost: Boolean(process.env.VITE_AUTH_TRUST_HOST) || false
}

export const { GET, POST } = SolidAuth(authOpts)
