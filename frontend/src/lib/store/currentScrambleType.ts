import type { cubeTypeId } from "$lib/lookups/cubeTypes";
import { writable, type Writable } from "svelte/store";

export const currentScrambleType$: Writable<cubeTypeId> = writable();