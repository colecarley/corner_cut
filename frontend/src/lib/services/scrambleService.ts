import type { cubeTypeId } from "$lib/lookups/cubeTypes";
import * as scrambow from "scrambow";

export function getScramble(type: cubeTypeId): string {
    const scrambler = new scrambow.Scrambow(type);
    return scrambler.get(1).at(0)!.scramble_string;
}