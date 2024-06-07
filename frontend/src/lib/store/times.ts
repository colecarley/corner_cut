import type { Time } from "$lib/services/timeService";
import { writable, type Writable } from "svelte/store";

export const times$: Writable<Time[]> = writable([]);