
export const cubeTypes = [
    {
        id: '222',
        name: '2x2'
    },
    {
        id: '333',
        name: '3x3'
    },
    {
        id: '444',
        name: '4x4'
    },
    {
        id: '555',
        name: '5x5'
    },
    {
        id: '666',
        name: '6x6'
    },
    {
        id: '777',
        name: '7x7'
    },
    {
        id: 'clock',
        name: 'Clock'
    },
    {
        id: 'clockOptimal',
        name: 'Clock Optimal'
    },
    {
        id: 'megaminx',
        name: 'Megaminx'
    },
    {
        id: 'pyraminx',
        name: 'Pyraminx'
    },
    {
        id: 'skewb',
        name: 'Skewb'
    },
    {
        id: 'square1',
        name: 'Square 1'
    }
] as const;

export const cubeTypeIds = cubeTypes.map((c) => c.id);
export type cubeTypeId = (typeof cubeTypeIds)[number];