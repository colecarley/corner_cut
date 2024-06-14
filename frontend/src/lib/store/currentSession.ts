import type { Session } from "$lib/services/sessionService";
import { writable, type Writable } from "svelte/store";

export const currentSession$: Writable<Session> = writable();