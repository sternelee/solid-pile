import { createMiddleware } from "@solidjs/start/middleware";
import { appendHeader, getCookie, getHeader } from "vinxi/http";
import { Session, User, verifyRequestOrigin } from "lucia";
import { initializeLucia } from "./lib/auth";

const lucia = initializeLucia(process.env.DB)

export default createMiddleware({
  onRequest: async ({ request, response, nativeEvent }) => {
    if (request.method !== "GET") {
      const originHeader = getHeader(nativeEvent, "Origin") ?? null;
      const hostHeader = getHeader(nativeEvent, "Host") ?? null;
      if (
        !originHeader ||
        !hostHeader ||
        !verifyRequestOrigin(originHeader, [hostHeader])
      ) {
        response.status = 403;
        return;
      }
    }

    const sessionId = getCookie(nativeEvent, lucia.sessionCookieName) ?? null;
    if (!sessionId) {
      nativeEvent.context.session = null;
      nativeEvent.context.user = null;
      return;
    }

    const { session, user } = await lucia.validateSession(sessionId);
    if (session && session.fresh) {
      appendHeader(
        nativeEvent,
        "Set-Cookie",
        lucia.createSessionCookie(session.id).serialize()
      );
    }
    if (!session) {
      appendHeader(
        nativeEvent,
        "Set-Cookie",
        lucia.createBlankSessionCookie().serialize()
      );
    }
    nativeEvent.context.session = session;
    nativeEvent.context.user = user;
  },
});

declare module "vinxi/http" {
  interface H3EventContext {
    user: User | null;
    session: Session | null;
  }
}
