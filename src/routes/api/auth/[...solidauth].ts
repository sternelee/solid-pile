import { SolidAuth, type SolidAuthConfig } from '@solid-mediakit/auth'
import GitHub from '@auth/core/providers/github'
import Google from '@auth/core/providers/google'

// 线上设置环境变量: export AUTH_URL="https://pile.leeapps.dev/api/auth"

const authOpts: SolidAuthConfig = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    })
  ],
  debug: false,
  secret: process.env.AUTH_SECRET
}

export const { GET, POST } = SolidAuth(authOpts)
