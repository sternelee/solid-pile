import localForage from "localforage";
import { type Session, LocalStorageKey } from "~/types";

const localStore = localForage.createInstance({
  name: "solid-chat",
  driver: localForage.INDEXEDDB,
});

export async function getSession(id: string) {
  try {
    const _ = (await localStore.getItem(
      LocalStorageKey.PREFIX_SESSION + id
    )) as string;
    if (_) return JSON.parse(_) as Session;
  } catch (e) {
    console.error("Error parsing session:", e);
  }
  return undefined;
}

export async function setSession(id: string, data: Session) {
  await localStore.setItem(
    LocalStorageKey.PREFIX_SESSION + id,
    JSON.stringify(data)
  );
}

export async function delSession(id: string) {
  await localStore.removeItem(LocalStorageKey.PREFIX_SESSION + id);
}

export async function fetchAllSessions() {
  const sessions: Session[] = [];
  (await localStore.keys()).forEach(async (key) => {
    const id = key.replace(LocalStorageKey.PREFIX_SESSION, "");
    if (id !== key) {
      const session = await getSession(id);
      if (session) sessions.push(session);
    }
  });
  return sessions;
}
