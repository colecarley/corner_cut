import type { Session } from "$lib/services/sessionService";
import { writable, type Writable } from "svelte/store";

export const sessions$: Writable<Session[]> = writable([]);