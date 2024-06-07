
import type { Session } from "$lib/services/sessionService";
import type { Config } from "@sveltejs/kit";
import { writable, type Writable } from "svelte/store";

export const config$: Writable<Config> = writable([]);