import { keyBy } from "$lib/utils/keyBy";
import type { cubeTypeId } from "./cubeTypes";

export const twistyPlayerCubeTypes = [
    {
        id: '222',
        playerId: '2x2x2'
    },
    {
        id: '333',
        playerId: '3x3x3'
    },
    {
        id: '444',
        playerId: '4x4x4'
    },
    {
        id: '555',
        playerId: '5x5x5'
    },
    {
        id: '666',
        playerId: '6x6x6'
    },
    {
        id: '777',
        playerId: '7x7x7'
    },
    {
        id: 'clock',
        playerId: 'clock'
    },
    {
        id: 'clockOptimal',
        playerId: 'clock'
    },
    {
        id: 'megaminx',
        playerId: 'megaminx'
    },
    {
        id: 'pyraminx',
        playerId: 'pyraminx'
    },
    {
        id: 'skewb',
        playerId: 'skewb'
    },
    {
        id: 'square1',
        playerId: 'square1'
    }
] as const;

export const twistyPlayerCubeTypeIds = twistyPlayerCubeTypes.map((c) => c.id);
export type twistyPlayerCubeTypeId = (typeof twistyPlayerCubeTypeIds)[number];
export const twistyPlayerCubeTypesById = keyBy(twistyPlayerCubeTypes.slice(), 'id'); 