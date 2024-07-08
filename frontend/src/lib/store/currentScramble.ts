import { writable, type Writable } from "svelte/store";

export const currentScramble$: Writable<string> = writable();