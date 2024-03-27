import { Lucia } from "lucia";
import { D1Adapter } from "@lucia-auth/adapter-sqlite";

export function initializeLucia(D1: D1Database) {
	const adapter = new D1Adapter(D1, {
		user: "user",
		session: "session"
	});
	return new Lucia(adapter);
}

export interface Env {
  DB: D1Database;
}

declare module "lucia" {
	interface Register {
		Auth: ReturnType<typeof initializeLucia>;
	}
}
