import type { cubeTypeId } from "$lib/lookups/cubeTypes";
import { v4 as uuidv4 } from "uuid"

export type Session = {
    id: string,
    name: string,
    createdAt: Date,
    scrambleType?: cubeTypeId | 'none',
    times: Record<string, Time>
}

export type Time = {
    id: string,
    scramble: string,
    createdAt: Date,
    time?: number, // milliseconds
    isDNF?: boolean;
}

export function getTimes(sessionId: string): Time[] {
    const session = getSession(sessionId);

    return Object.values(session.times);
}

export function saveTime(sessionId: string, time: Time) {
    const session = getSession(sessionId);
    session.times[time.id] = time;
    localStorage.setItem(sessionId, JSON.stringify(session));
}

export function createTime(time: number, scramble: string, isDNF = false) {
    return {
        id: uuidv4(),
        time, 
        scramble,
        isDNF,
        createdAt: new Date()
    }
}

export function removeTime(sessionId: string, timeId: string) {
    const session = getSession(sessionId);
    delete session.times[timeId];
    localStorage.setItem(sessionId, JSON.stringify(session));
}

export function updateTime(sessionId: string, timeId: string, changes: Partial<Time>) {
    const session = getSession(sessionId);
    session.times[timeId] = {...session.times[timeId], ...changes};
    localStorage.setItem(sessionId, JSON.stringify(session));
}

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
    return JSON.parse(localStorage.getItem("cornercut_sessionIds") ?? "[]");
}

export function getSessions(): Session[] {
    const sessionIds = getSessionIds();

    const sessions = [];
    for(const sessionId of sessionIds) {
        const session = getSession(sessionId);
        sessions.push(session);
    }
    return sessions;
}

export function updateSessionIds(newSessionId: string) {
    const sessionIds = getSessionIds();
    localStorage.setItem("cornercut_sessionIds", JSON.stringify([...sessionIds, newSessionId]));
}

export function getSession(sessionId: string) {
    if (!getSessionIds().includes(sessionId)) {
        throw new Error("Not a valid session");
    }

    const session: Session = JSON.parse(localStorage.getItem(sessionId) ?? "");
    if (!session) {
        throw new Error("Session missing");
    }

    return session;
}

export function saveSession(session: Session) {
    updateSessionIds(session.id)

    localStorage.setItem(session.id, JSON.stringify(session));
}

export function updateSession(sessionId: string, changes: Partial<Session>) {
    const session = getSession(sessionId);
    localStorage.setItem(sessionId, JSON.stringify({...session, ...changes}))
}

export function removeSession(sessionId: string) {
    localStorage.removeItem(sessionId);
}