export const blockIndex = [
    { name:"air" },
    { name:"dirt", UV: [0, .9], transparent: false, sound: ['dirt'], strength:100 },
    { name:"grass", UV: [.1, .9], transparent: false, sound: ['grass'], strength:125 },
    { name:"stone", UV: [.2, .9], transparent: false, sound: ['stone'], strength:400 },
    { name:"bedrock", UV: [.3, .9], transparent: false, sound: ['stone'], strength:9999 },
    { name:"log", UV: [.4, .9], transparent: false, sound: ['wood', 'stone'], strength:300 },
    { name:"leaves", UV: [.5, .9], transparent: true, sound: ['grass'], strength:50 },
    { name:"coal ore", UV: [.6, .9], transparent: false, sound: ['stone'], strength:400 },
    { name:"iron ore", UV: [.7, .9], transparent: false, sound: ['stone'], strength:400 },
    { name:"diamond ore", UV: [.8, .9], transparent: false, sound: ['stone'], strength:400 },
    { name:"gold ore", UV: [.9, .9], transparent: false, sound: ['stone'], strength:400 },
    { name:"ruby ore", UV: [0, .8], transparent: false, sound: ['stone'], strength:400 },
    { name:"sapphire ore", UV: [.1, .8], transparent: false, sound: ['stone'], strength:400 },
    { name:"glass", UV: [.2, .8], transparent: true, sound: ['stone', 'wood'], strength:50 },
    { name:"snow", UV: [.3, .8], transparent: false, sound: ['dirt'], strength:125 },
    { name:"planks", UV: [.4, .8], transparent: false, sound: ['wood', 'stone'], strength:300 },
    { name:"sand", UV: [.5, .8], transparent: false, sound: ['dirt'], strength:125 },
    { name:"water", UV: [.6, .8], transparent: true, sound: [], strength:100, unbreakable: true },
    { name:"cobble", UV: [.7, .8], transparent: false, sound: ['stone'], strength:300 },
    { name:"magma", UV: [.8, .8], transparent: false, sound: ['stone'], strength:300 },
    { name:"lava", UV: [.9, .8], transparent: false, sound: ['stone'], strength:100 },
    { name:"bloodstone", UV: [0, .7], transparent: false, sound: ['squish', 'stone'], strength:250 },
    { name:"bones 1", UV: [.1, .7], transparent: false, sound: ['squish', 'stone'], strength:250 },
    { name:"bones 2", UV: [.2, .7], transparent: false, sound: ['squish', 'stone'], strength:250 },
    { name:"blood", UV: [.3, .7], transparent: true, sound: [], strength:100 },
    { name:"bone", UV: [.4, .7], transparent: false, sound: ['stone', 'wood'], strength:350 },
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

export const transparentBlocks = [getIndexOf('air'), getIndexOf('leaves'), getIndexOf('glass'), getIndexOf('water'), getIndexOf('blood')];
export const liquids = [getIndexOf('water'), getIndexOf('blood')]