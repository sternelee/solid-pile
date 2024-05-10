import localForage from "localforage";
import { type Session, LocalStorageKey } from "~/types"


const localStore = localForage.createInstance({
  name: "solid-chat",
  driver: localForage.INDEXEDDB
});

export async function getSession(id: string) {
  try {
    const _ = await localStore.getItem(LocalStorageKey.PREFIX_SESSION + id)
    if (_) return _ as Session
  } catch (e) {
    console.error("Error parsing session:", e)
  }
  return undefined
}

export function setSession(id: string, data: Session) {
  localStore.setItem(LocalStorageKey.PREFIX_SESSION + id, JSON.stringify(data))
}

export function delSession(id: string) {
  localStorage.removeItem(LocalStorageKey.PREFIX_SESSION + id)
}

export async function fetchAllSessions() {
  const sessions: Session[] = []
  Object.keys(localStorage).forEach(async key => {
    const id = key.replace(LocalStorageKey.PREFIX_SESSION, "")
    if (id !== key) {
      const session = await getSession(id)
      if (session) sessions.push(session)
    }
  })
  return sessions
}
