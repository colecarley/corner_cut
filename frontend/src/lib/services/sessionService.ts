import type { cubeTypeId } from "$lib/lookups/cubeTypes";
import { sessions$ } from "$lib/store/sessions";
import { getItem } from "$lib/utils/getItem";
import { setItem } from "$lib/utils/setItem";
import type { Time } from "./timeService";
import { v4 as uuidv4 } from "uuid"

export type Session = {
    id: string,
    name: string,
    createdAt: Date,
    scrambleType?: cubeTypeId | 'none',
    times: Record<string, Time>
}

const SESSIONS_KEY = "cornercut_sessionIds";

export function createSession(name: string, scrambleType: cubeTypeId | 'none' = 'none'): Session {
    return {
        id: uuidv4(),
        name,
        scrambleType,
        createdAt: new Date(),
        times: {}
    }
}

export function getSessionIds(): string[] {
    return getItem(SESSIONS_KEY, []);
}

export function getSessions(): Session[] {
    const sessionIds = getSessionIds();
    const s = [];
    for(const sessionId of sessionIds) {
        const session = getSession(sessionId);
       s.push(session);
    }

    sessions$.set(s);
    return s;
}

export function updateSessionIds(newSessionId: string) {
    const sessionIds = getSessionIds();
    setItem(SESSIONS_KEY, [...sessionIds, newSessionId]);
}

export function getSession(sessionId: string) {
    if (!getSessionIds().includes(sessionId)) {
        throw new Error(`${sessionId} not a valid session`);
    }

    const session: Session = getItem(sessionId, null)
    if (!session) {
        throw new Error("Session missing");
    }

    return session;
}

export function saveSession(session: Session) {
    updateSessionIds(session.id)
    sessions$.update(sessions => [...sessions, session]);
    setItem(session.id, session);
}

export function updateSession(sessionId: string, changes: Partial<Session>) {
    const session = getSession(sessionId);
    sessions$.update(sessions => sessions.map(s => s.id === sessionId ? {...s, ...changes} : s));
    setItem(sessionId, {...session, ...changes});
}

export function removeSession(sessionId: string) {
    localStorage.removeItem(sessionId);
    sessions$.update(sessions => sessions.filter(s => s.id !== sessionId));
    const sessionIds = getSessionIds();
    const newSessionIds = sessionIds.filter((id) => id !== sessionId);
    setItem(SESSIONS_KEY, newSessionIds);
}