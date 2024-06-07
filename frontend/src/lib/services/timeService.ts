import { v4 as uuidv4 } from "uuid";
import { getSession } from "./sessionService";
import { times$ } from "$lib/store/times";
import { setItem } from "$lib/utils/setItem";

export type Time = {
    id: string,
    scramble: string,
    createdAt: Date,
    time?: number, // milliseconds
    isDNF?: boolean;
}

export function getTimes(sessionId: string): Time[] {
    const session = getSession(sessionId);
    times$.set(Object.values(session.times));

    return Object.values(session.times);
}

export function saveTime(sessionId: string, time: Time) {
    const session = getSession(sessionId);
    session.times[time.id] = time;
    times$.update(times => [...times, time]);
    setItem(sessionId, session);
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
    times$.update(times => times.filter(time => time.id !== timeId));
    setItem(sessionId, session);
}

export function updateTime(sessionId: string, timeId: string, changes: Partial<Time>) {
    const session = getSession(sessionId);
    session.times[timeId] = {...session.times[timeId], ...changes};

    times$.update(times => times.map(time => time.id === timeId ? {...time, ...changes} : time));
    setItem(sessionId, session);
}
