export const blockIndex = [
    { name:"air", transparent: true, nocollide:true},
    { name:"test", UV: 0, transparent: false, sound: ['stone'], strength:100},
    { name:"dirt", UV: 2, transparent: false, sound: ['dirt'], strength:100 },
    { name:"grass", UV: 1, transparent: false, sound: ['grass'], strength:125 },
    { name:"stone", UV: 3, transparent: false, sound: ['stone'], strength:400 },
    { name:"bedrock", UV: 4, transparent: false, sound: ['stone'], strength:9999 },
    { name:"log", UV: 5, transparent: false, sound: ['wood', 'stone'], strength:300 },
    { name:"leaves", UV: 6, transparent: true, sound: ['grass'], strength:50 },
    { name:"coal ore", UV: 7, transparent: false, sound: ['stone'], strength:400 },
    { name:"iron ore", UV: 8, transparent: false, sound: ['stone'], strength:400 },
    { name:"diamond ore", UV: 9, transparent: false, sound: ['stone'], strength:400 },
    { name:"gold ore", UV: 10, transparent: false, sound: ['stone'], strength:400 },
    { name:"ruby ore", UV: 11, transparent: false, sound: ['stone'], strength:400 },
    { name:"sapphire ore", UV: 12, transparent: false, sound: ['stone'], strength:400 },
    { name:"glass", UV: 13, transparent: true, sound: ['stone', 'wood'], strength:50 },
    { name:"snow", UV: 14, transparent: false, sound: ['dirt'], strength:125 },
    { name:"planks", UV: 15, transparent: false, sound: ['wood', 'stone'], strength:300 },
    { name:"sand", UV: 16, transparent: false, sound: ['dirt'], strength:125 },
    { name:"water", UV: 17, transparent: true, sound: [], strength:100, nocollide:true },
    { name:"cobble", UV: 18, transparent: false, sound: ['stone'], strength:300 },
    { name:"magma", UV: 19, transparent: false, sound: ['stone'], strength:300 },
    { name:"lava", UV: 20, transparent: false, sound: [], strength:100, nocollide:true },
    { name:"bloodstone", UV: 21, transparent: false, sound: ['squish', 'stone'], strength:250 },
    { name:"bones 1", UV: 22, transparent: false, sound: ['squish', 'stone'], strength:250 },
    { name:"bones 2", UV: 23, transparent: false, sound: ['squish', 'stone'], strength:250 },
    { name:"blood", UV: 24, transparent: true, sound: [], strength:100 },
    { name:"bone", UV: 25, transparent: false, sound: ['stone', 'wood'], strength:350 },
    { name:"grass tuft", UV: 26, transparent: true, sound: [], strength:2, model:1, nocollide:true },
    { name:"flower", UV: 27, transparent: true, sound: [], strength:1, model:1, nocollide:true },
]


let cache = {};
export function getIndexOf(name) {
    if (name in cache) {
        return cache[name]
    } else {
        let i = 0;
        for (let b of blockIndex) {
            if (b.name === name) {
                cache[name] = i
                return i
            }
            i += 1
        }
    }
}

export const atlasHeight = 32;


export const models = {
    1:[ // cross
        [ // represents a quad
            [-.5, -.5, .5], // point 1
            [-.5, .5, .5], // point 2
            [.5, .5, -.5], // point 3
            [.5, -.5, -.5], // point 4
            [-1, 0, -1], // normal vector
            [0, 0], // UV offset on texture atlas
            [1, 1], // UV scale on texture atlas
        ],

        [
            [-.5, -.5, -.5],
            [-.5, .5, -.5],
            [.5, .5, .5],
            [.5, -.5, .5],
            [1, 0, -1],
            [1, 0],
            [1, 1]
        ],

        [
            [.5, -.5, -.5],
            [.5, .5, -.5],
            [-.5, .5, .5],
            [-.5, -.5, .5],
            [-1, 0, 1],
            [2, 0],
            [1, 1]
        ],

        [
            [.5, -.5, .5],
            [.5, .5, .5],
            [-.5, .5, -.5],
            [-.5, -.5, -.5],
            [-1, 0, 1],
            [3, 0],
            [1, 1]
        ],
    ]
}