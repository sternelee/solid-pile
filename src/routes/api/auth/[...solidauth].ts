import { SolidAuth, type SolidAuthConfig } from '@solid-mediakit/auth'
import GitHub from '@auth/core/providers/github'

const authOpts: SolidAuthConfig = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  debug: false,
}

export const { GET, POST } = SolidAuth(authOpts)
