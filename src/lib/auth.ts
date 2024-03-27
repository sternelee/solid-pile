import { cache } from "@solidjs/router";
import { getRequestEvent } from "solid-js/web";

import { Lucia } from "lucia";
import { D1Adapter } from "@lucia-auth/adapter-sqlite";
import { GitHub } from "arctic";

export function initializeLucia(D1: D1Database) {
  const adapter = new D1Adapter(D1, {
    user: "user",
    session: "session",
  });
  return new Lucia(adapter, {
    sessionCookie: {
      attributes: {
        // set to `true` when using HTTPS
        // secure: import.meta.env.PROD,
        secure: true,
      },
    },
    getUserAttributes: (attributes) => {
      return {
        // attributes has the type of DatabaseUserAttributes
        username: attributes.username,
        githubId: attributes.github_id,
      };
    },
  });
}

export interface DatabaseUser {
  id: string;
  username: string;
  github_id: number;
}

export interface Env {
  DB: D1Database;
}

declare module "lucia" {
  interface Register {
    Auth: ReturnType<typeof initializeLucia>;
    DatabaseUserAttributes: Omit<DatabaseUser, "id">;
  }
}

export const github = new GitHub(process.env.GITHUB_CLIENT_ID!, process.env.GITHUB_CLIENT_SECRET!);
