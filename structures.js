export const STRUCTURES = {
    "tree":[
        //log
        { x: 0, y: 0, z: 0, type: 'log' },
        { x: 0, y: 1, z: 0, type: 'log' },
        { x: 0, y: 2, z: 0, type: 'log' },
        { x: 0, y: 3, z: 0, type: 'log' },
        { x: 0, y: 4, z: 0, type: 'log' },
        { x: 0, y: 5, z: 0, type: 'log' },
    
        //upper tuft
        { x: 0, y: 6, z: 0, type: 'leaves' },
        { x: 0, y: 6, z: 1, type: 'leaves' },
        { x: 0, y: 6, z: -1, type: 'leaves' },
        { x: 1, y: 6, z: 0, type: 'leaves' },
        { x: -1, y: 6, z: 0, type: 'leaves' },
    
        //lower tuft
        { x: 0, y: 5, z: 1, type: 'leaves' },
        { x: 0, y: 5, z: -1, type: 'leaves' },
        { x: 1, y: 5, z: 0, type: 'leaves' },
        { x: -1, y: 5, z: 0, type: 'leaves' },
        { x: 1, y: 5, z: 1, type: 'leaves' },
        { x: -1, y: 5, z: -1, type: 'leaves' },
        { x: -1, y: 5, z: 1, type: 'leaves' },
        { x: 1, y: 5, z: -1, type: 'leaves' },
    
    
        //upper bulk layer
        { x: 0, y: 4, z: 1, type: 'leaves' },
        { x: 0, y: 4, z: -1, type: 'leaves' },
        { x: 1, y: 4, z: 0, type: 'leaves' },
        { x: -1, y: 4, z: 0, type: 'leaves' },
        { x: 1, y: 4, z: 1, type: 'leaves' },
        { x: -1, y: 4, z: -1, type: 'leaves' },
        { x: -1, y: 4, z: 1, type: 'leaves' },
        { x: 1, y: 4, z: -1, type: 'leaves' },
        { x: 2, y: 4, z: -2, type: 'leaves' },
        { x: -2, y: 4, z: 2, type: 'leaves' },
        { x: 2, y: 4, z: 2, type: 'leaves' },
        { x: -2, y: 4, z: -2, type: 'leaves' },
        { x: 1, y: 4, z: -2, type: 'leaves' },
        { x: 0, y: 4, z: -2, type: 'leaves' },
        { x: -1, y: 4, z: -2, type: 'leaves' },
        { x: 1, y: 4, z: 2, type: 'leaves' },
        { x: 0, y: 4, z: 2, type: 'leaves' },
        { x: -1, y: 4, z: 2, type: 'leaves' },
        { x: 2, y: 4, z: 1, type: 'leaves' },
        { x: 2, y: 4, z: 0, type: 'leaves' },
        { x: 2, y: 4, z: -1, type: 'leaves' },
        { x: -2, y: 4, z: 1, type: 'leaves' },
        { x: -2, y: 4, z: 0, type: 'leaves' },
        { x: -2, y: 4, z: -1, type: 'leaves' },
    
        //lower bulk layer
        { x: 0, y: 3, z: 1, type: 'leaves' },
        { x: 0, y: 3, z: -1, type: 'leaves' },
        { x: 1, y: 3, z: 0, type: 'leaves' },
        { x: -1, y: 3, z: 0, type: 'leaves' },
        { x: 1, y: 3, z: 1, type: 'leaves' },
        { x: -1, y: 3, z: -1, type: 'leaves' },
        { x: -1, y: 3, z: 1, type: 'leaves' },
        { x: 1, y: 3, z: -1, type: 'leaves' },
        { x: 2, y: 3, z: -2, type: 'leaves' },
        { x: -2, y: 3, z: 2, type: 'leaves' },
        { x: 2, y: 3, z: 2, type: 'leaves' },
        { x: -2, y: 3, z: -2, type: 'leaves' },
        { x: 1, y: 3, z: -2, type: 'leaves' },
        { x: 0, y: 3, z: -2, type: 'leaves' },
        { x: -1, y: 3, z: -2, type: 'leaves' },
        { x: 1, y: 3, z: 2, type: 'leaves' },
        { x: 0, y: 3, z: 2, type: 'leaves' },
        { x: -1, y: 3, z: 2, type: 'leaves' },
        { x: 2, y: 3, z: 1, type: 'leaves' },
        { x: 2, y: 3, z: 0, type: 'leaves' },
        { x: 2, y: 3, z: -1, type: 'leaves' },
        { x: -2, y: 3, z: 1, type: 'leaves' },
        { x: -2, y: 3, z: 0, type: 'leaves' },
        { x: -2, y: 3, z: -1, type: 'leaves' },
    ],

    "house":[{'x': -2, 'y': 0, 'z': 1, 'type': 'planks'}, {'x': -2, 'y': 0, 'z': 0, 'type': 'planks'}, {'x': -2, 'y': 0, 'z': -1, 'type': 'planks'}, {'x': 1, 'y': 0, 'z': 2, 'type': 'planks'}, {'x': 2, 'y': 0, 'z': 1, 'type': 'planks'}, {'x': 2, 'y': 0, 'z': 0, 'type': 'planks'}, {'x': 2, 'y': 0, 'z': -1, 'type': 'planks'}, {'x': 1, 'y': 0, 'z': -2, 'type': 'planks'}, {'x': -1, 'y': 0, 'z': -2, 'type': 'planks'}, {'x': -1, 'y': 1, 'z': -2, 'type': 'planks'}, {'x': 1, 'y': 1, 'z': -2, 'type': 'planks'}, {'x': 1, 'y': 2, 'z': -2, 'type': 'planks'}, {'x': -1, 'y': 2, 'z': -2, 'type': 'planks'}, {'x': 0, 'y': 2, 'z': -2, 'type': 'planks'}, {'x': -2, 'y': 1, 'z': 1, 'type': 'planks'}, {'x': -2, 'y': 1, 'z': -1, 'type': 'planks'}, {'x': -2, 'y': 1, 'z': 0, 'type': 'planks'}, {'x': -2, 'y': 2, 'z': 1, 'type': 'planks'}, {'x': -2, 'y': 2, 'z': 0, 'type': 'planks'}, {'x': -2, 'y': 2, 'z': -1, 'type': 'planks'}, {'x': 1, 'y': 1, 'z': 2, 'type': 'planks'}, 
    {'x': 1, 'y': 2, 'z': 2, 'type': 'planks'}, {'x': 0, 'y': 2, 'z': 2, 'type': 'planks'}, {'x': -1, 'y': 1, 'z': 2, 'type': 'planks'}, {'x': -1, 'y': 2, 'z': 2, 'type': 'planks'}, {'x': 2, 'y': 1, 'z': 0, 'type': 'planks'}, {'x': 2, 'y': 1, 'z': -1, 'type': 'planks'}, {'x': 2, 'y': 2, 'z': 0, 'type': 'planks'}, {'x': 2, 'y': 2, 'z': -1, 'type': 'planks'}, {'x': 2, 'y': 1, 'z': 1, 'type': 'planks'}, {'x': 2, 'y': 2, 'z': 1, 'type': 'planks'}, {'x': -2, 'y': 0, 'z': -2, 'type': 'log'}, {'x': -2, 'y': 1, 'z': -2, 'type': 'log'}, {'x': -2, 'y': 2, 'z': -2, 'type': 'log'}, {'x': 2, 'y': 0, 'z': -2, 'type': 'log'}, {'x': 2, 'y': 1, 'z': -2, 'type': 'log'}, {'x': 2, 'y': 2, 'z': -2, 'type': 'log'}, {'x': -2, 'y': 1, 'z': 2, 'type': 'log'}, {'x': -2, 'y': 2, 'z': 2, 'type': 'log'}, {'x': 2, 'y': 0, 'z': 2, 'type': 'log'}, {'x': 2, 'y': 1, 'z': 2, 'type': 'log'}, {'x': 2, 'y': 2, 'z': 2, 'type': 'log'}, {'x': -2, 'y': 3, 'z': 2, 'type': 'log'}, 
    {'x': -1, 'y': 3, 'z': 2, 'type': 'log'}, {'x': 0, 'y': 3, 'z': 2, 'type': 'log'}, {'x': 1, 'y': 3, 'z': 2, 'type': 'log'}, {'x': 2, 'y': 3, 'z': 2, 'type': 'log'}, {'x': 2, 'y': 3, 'z': 1, 'type': 'log'}, {'x': 2, 'y': 3, 'z': 0, 'type': 'log'}, {'x': 2, 'y': 3, 'z': -1, 'type': 'log'}, {'x': 2, 'y': 3, 'z': -2, 'type': 'log'}, {'x': -2, 'y': 3, 'z': 1, 'type': 'log'}, {'x': -2, 'y': 3, 'z': 0, 'type': 'log'}, {'x': -2, 'y': 3, 'z': -1, 'type': 'log'}, {'x': 1, 'y': 3, 'z': -2, 'type': 'log'}, {'x': 0, 'y': 3, 'z': -2, 'type': 'log'}, {'x': -1, 'y': 3, 'z': -2, 'type': 'log'}, {'x': -2, 'y': 3, 'z': -2, 'type': 'log'}, {'x': 0, 'y': 1, 'z': 2, 'type': 'glass'}, {'x': 1, 'y': 3, 'z': 1, 'type': 'stone'}, {'x': 0, 'y': 3, 'z': 1, 'type': 'stone'}, {'x': -1, 'y': 3, 'z': 1, 'type': 'stone'}, {'x': 1, 'y': 3, 'z': 0, 'type': 'stone'}, {'x': 0, 'y': 3, 'z': 0, 'type': 'stone'}, {'x': -1, 'y': 3, 'z': 0, 'type': 'stone'}, {'x': 1, 'y': 3, 
    'z': -1, 'type': 'stone'}, {'x': 0, 'y': 3, 'z': -1, 'type': 'stone'}, {'x': -1, 'y': 3, 'z': -1, 'type': 'stone'}, {'x': -2, 'y': 0, 'z': 2, 'type': 'log'}, {'x': -1, 'y': -1, 'z': 2, 'type': 'cobble'}, {'x': -1, 'y': 0, 'z': 2, 'type': 'planks'}, {'x': -1, 'y': -1, 'z': 1, 'type': 'cobble'}, {'x': -1, 'y': -1, 'z': 0, 'type': 'cobble'}, {'x': -1, 'y': -1, 'z': -1, 'type': 'cobble'}, {'x': -1, 'y': -1, 'z': -2, 'type': 'cobble'}, {'x': -2, 'y': -1, 'z': -2, 'type': 'cobble'}, {'x': -2, 'y': -1, 'z': -1, 'type': 'cobble'}, {'x': -2, 'y': -1, 'z': 0, 'type': 'cobble'}, {'x': -2, 'y': -1, 'z': 1, 'type': 'cobble'}, {'x': -2, 'y': -1, 'z': 2, 'type': 'cobble'}, {'x': 2, 'y': -1, 'z': 2, 'type': 'cobble'}, {'x': 1, 'y': -1, 'z': 2, 'type': 'cobble'}, {'x': 2, 'y': -1, 'z': 1, 'type': 'cobble'}, {'x': 1, 'y': -1, 'z': 1, 'type': 'cobble'}, {'x': 2, 'y': -1, 'z': 0, 'type': 'cobble'}, {'x': 1, 'y': -1, 'z': 0, 'type': 'cobble'}, {'x': 2, 'y': -1, 'z': -1, 'type': 'cobble'}, {'x': 1, 'y': -1, 'z': -1, 'type': 'cobble'}, {'x': 0, 'y': -1, 'z': 2, 'type': 'cobble'}, {'x': 0, 'y': -1, 'z': 1, 'type': 'cobble'}, {'x': 0, 'y': -1, 'z': 0, 'type': 'cobble'}, {'x': 0, 'y': -1, 'z': -1, 'type': 'cobble'}, {'x': 0, 'y': -1, 'z': -2, 'type': 'cobble'}, {'x': 2, 'y': -1, 'z': -2, 'type': 'cobble'}, {'x': 1, 'y': -1, 'z': -2, 'type': 'cobble'}, {'x': 0, 'y': 0, 'z': 2, 'type': 'planks'}],

    "trap":[{'x': 0, 'y': 0, 'z': -1, 'type': 'cobble'}, {'x': -1, 'y': 0, 'z': 0, 'type': 'cobble'}, {'x': -1, 'y': 0, 'z': -1, 'type': 'cobble'}, {'x': 1, 'y': 0, 'z': -1, 'type': 'cobble'}, {'x': 1, 'y': 0, 'z': 0, 'type': 'cobble'}, {'x': -1, 'y': 0, 'z': 1, 'type': 'cobble'}, {'x': 0, 'y': 0, 'z': 1, 'type': 'cobble'}, {'x': 1, 'y': 0, 'z': 1, 'type': 'cobble'}, {'x': 2, 'y': 0, 'z': -1, 'type': 'cobble'}, {'x': 2, 'y': 0, 'z': 0, 'type': 'cobble'}, {'x': -1, 'y': 0, 'z': 2, 
    'type': 'cobble'}, {'x': 2, 'y': 0, 'z': 1, 'type': 'cobble'}, {'x': 0, 'y': 0, 'z': 2, 'type': 'cobble'}, {'x': 1, 'y': 1, 'z': 1, 'type': 'cobble'}, {'x': -2, 'y': 0, 'z': 1, 'type': 'cobble'}, {'x': -2, 'y': 0, 'z': 0, 'type': 'cobble'}, {'x': -2, 'y': 0, 'z': -1, 'type': 'cobble'}, {'x': 0, 'y': 0, 'z': -2, 'type': 'cobble'}, {'x': -1, 'y': 0, 'z': -2, 'type': 'cobble'}, {'x': 1, 'y': 0, 'z': -2, 'type': 'cobble'}, {'x': -1, 'y': 1, 'z': 1, 'type': 'cobble'}, {'x': 
    -1, 'y': 3, 'z': 1, 'type': 'cobble'}, {'x': 1, 'y': 3, 'z': -1, 'type': 'cobble'}, {'x': -1, 'y': 3, 'z': -1, 'type': 'cobble'}, {'x': 0, 'y': 0, 'z': -1, 'type': 'cobble'}, {'x': 1, 'y': 0, 'z': -1, 'type': 'cobble'}, {'x': 1, 'y': 0, 
    'z': -1, 'type': 'cobble'}, {'x': 1, 'y': 0, 'z': 1, 'type': 'cobble'}, {'x': 1, 'y': 0, 'z': 1, 'type': 'cobble'}, {'x': 0, 'y': -1, 'z': -1, 'type': 'cobble'}, {'x': 1, 'y': 0, 'z': 2, 'type': 'cobble'}, {'x': 1, 'y': -1, 'z': -1, 'type': 'cobble'}, {'x': 1, 'y': -1, 'z': 1, 'type': 'cobble'}, {'x': -1, 'y': -1, 'z': -1, 'type': 'cobble'}, {'x': -1, 'y': -1, 'z': 0, 'type': 'cobble'}, {'x': 0, 'y': -1, 'z': 1, 'type': 'cobble'}, {'x': -1, 'y': -1, 'z': 1, 'type': 'cobble'}, {'x': 1, 'y': -1, 'z': 0, 'type': 'cobble'}, {'x': 0, 'y': -2, 'z': 1, 'type': 'cobble'}, {'x': 0, 'y': -7, 'z': 1, 'type': 'cobble'}, {'x': 0, 'y': -8, 'z': 1, 'type': 'cobble'}, {'x': 0, 'y': -4, 'z': 1, 'type': 'cobble'}, {'x': 0, 'y': -6, 'z': 1, 'type': 'cobble'}, {'x': 0, 'y': -3, 'z': 1, 'type': 'cobble'}, {'x': 1, 'y': -4, 'z': 1, 'type': 'cobble'}, {'x': 0, 'y': -5, 'z': 1, 'type': 'cobble'}, {'x': 1, 'y': -5, 'z': 1, 'type': 'cobble'}, {'x': 1, 'y': -6, 'z': 1, 'type': 'cobble'}, {'x': 1, 'y': -8, 'z': 1, 'type': 'cobble'}, {'x': -1, 'y': -2, 'z': 1, 'type': 'cobble'}, {'x': -1, 'y': -3, 'z': 1, 'type': 'cobble'}, {'x': -1, 'y': -4, 'z': 1, 'type': 'cobble'}, {'x': -1, 'y': -5, 'z': 1, 'type': 'cobble'}, {'x': -1, 'y': -6, 'z': 1, 'type': 'cobble'}, {'x': -1, 'y': -7, 'z': 1, 'type': 'cobble'}, {'x': -1, 'y': -8, 'z': 1, 'type': 'cobble'}, {'x': -1, 'y': -2, 'z': 0, 'type': 'cobble'}, {'x': -1, 'y': -3, 'z': 0, 'type': 'cobble'}, {'x': -1, 'y': -4, 'z': 0, 'type': 'cobble'}, {'x': -1, 'y': -5, 'z': 0, 'type': 'cobble'}, {'x': -1, 'y': -6, 'z': 0, 'type': 'cobble'}, {'x': -1, 'y': -7, 'z': 0, 'type': 'cobble'}, {'x': -1, 'y': -8, 'z': 0, 'type': 'cobble'}, {'x': -1, 'y': -2, 'z': -1, 'type': 'cobble'}, {'x': -1, 'y': -3, 'z': -1, 'type': 'cobble'}, {'x': -1, 'y': -5, 'z': -1, 'type': 'cobble'}, {'x': -1, 'y': -6, 'z': -1, 'type': 'cobble'}, {'x': -1, 'y': -7, 'z': -1, 'type': 'cobble'}, {'x': -1, 'y': -4, 'z': -1, 'type': 'cobble'}, {'x': 1, 'y': -8, 'z': 0, 'type': 'cobble'}, {'x': 1, 'y': -7, 'z': 1, 'type': 'cobble'}, {'x': 1, 'y': -5, 'z': 0, 'type': 'cobble'}, {'x': 1, 'y': -6, 'z': 0, 'type': 'cobble'}, {'x': 
    1, 'y': -7, 'z': 0, 'type': 'cobble'}, {'x': 1, 'y': -2, 'z': 1, 'type': 'cobble'}, {'x': 1, 'y': -3, 'z': 1, 'type': 'cobble'}, {'x': 1, 'y': -4, 'z': 0, 'type': 'cobble'}, {'x': 1, 'y': -3, 'z': 0, 'type': 'cobble'}, {'x': 1, 'y': -2, 
    'z': 0, 'type': 'cobble'}, {'x': 1, 'y': -8, 'z': -1, 'type': 'cobble'}, {'x': 1, 'y': -7, 'z': -1, 'type': 'cobble'}, {'x': 1, 'y': -6, 'z': -1, 'type': 'cobble'}, {'x': 1, 'y': -5, 'z': -1, 'type': 'cobble'}, {'x': 1, 'y': -4, 'z': -1, 'type': 'cobble'}, {'x': 1, 'y': -3, 'z': -1, 'type': 'cobble'}, {'x': 1, 'y': -2, 'z': -1, 'type': 'cobble'}, {'x': 0, 'y': -8, 'z': -1, 'type': 'cobble'}, {'x': 0, 'y': -7, 'z': -1, 'type': 'cobble'}, {'x': 0, 'y': -6, 'z': -1, 'type': 'cobble'}, {'x': 0, 'y': -5, 'z': -1, 'type': 'cobble'}, {'x': 0, 'y': -4, 'z': -1, 'type': 'cobble'}, {'x': 0, 'y': -3, 'z': -1, 'type': 'cobble'}, {'x': 0, 'y': -2, 'z': -1, 'type': 'cobble'}, {'x': 0, 'y': 3, 'z': -1, 'type': 'stone'}, {'x': -1, 'y': 3, 'z': 0, 'type': 'stone'}, {'x': 0, 'y': 3, 'z': 1, 'type': 'stone'}, {'x': 1, 'y': 3, 'z': 0, 'type': 'stone'}, {'x': 1, 'y': 2, 'z': 1, 'type': 'stone'}, {'x': 1, 'y': 2, 'z': -1, 'type': 'stone'}, {'x': 0, 'y': 1, 'z': -1, 'type': 'stone'}, {'x': -1, 'y': 2, 'z': -1, 'type': 'stone'}, {'x': 1, 'y': 1, 'z': 0, 'type': 'stone'}, {'x': 0, 'y': 1, 'z': 1, 'type': 'stone'}, {'x': -1, 'y': 2, 'z': 1, 'type': 'stone'}, {'x': -1, 'y': 1, 'z': 0, 'type': 
    'stone'}, {'x': -1, 'y': 1, 'z': -1, 'type': 'cobble'}, {'x': 1, 'y': 1, 'z': -1, 'type': 'cobble'}, {'x': 1, 'y': 3, 'z': 1, 'type': 'cobble'}, {'x': 0, 'y': 2, 'z': 0, 'type': 'diamond ore'}, {'x': -2, 'y': 0, 'z': 2, 'type': 'gold ore'}, {'x': -2, 'y': 0, 'z': -2, 'type': 'gold ore'}, {'x': 2, 'y': 0, 'z': 2, 'type': 'gold ore'}, {'x': 2, 'y': 0, 'z': -2, 'type': 'gold ore'}, {'x': 0, 'y': -9, 'z': -1, 'type': 'stone'}, {'x': 1, 'y': -9, 'z': -1, 'type': 'stone'}, {'x': 1, 'y': -9, 'z': 0, 'type': 'stone'}, {'x': 1, 'y': -9, 'z': 1, 'type': 'stone'}, {'x': 0, 'y': -9, 'z': 1, 'type': 'stone'}, {'x': -1, 'y': -9, 'z': 1, 'type': 'stone'}, {'x': -1, 'y': -9, 'z': 0, 'type': 'stone'}, {'x': -1, 'y': -9, 'z': -1, 'type': 'stone'}, {'x': -2, 'y': -9, 'z': -1, 'type': 'stone'}, {'x': -1, 'y': -9, 'z': -2, 'type': 'stone'}, {'x': -2, 'y': -9, 'z': -2, 'type': 'stone'}, {'x': 1, 'y': -9, 'z': -2, 'type': 'stone'}, {'x': 0, 'y': -9, 'z': -2, 'type': 'stone'}, {'x': -2, 'y': -9, 'z': 1, 'type': 'stone'}, {'x': -2, 'y': -9, 'z': 0, 'type': 'stone'}, {'x': 1, 'y': -9, 'z': 2, 'type': 'stone'}, {'x': 0, 'y': -9, 'z': 2, 'type': 'stone'}, {'x': -1, 'y': -9, 'z': 2, 'type': 'stone'}, {'x': 2, 'y': -9, 'z': -2, 'type': 'stone'}, {'x': 2, 'y': -9, 'z': -1, 'type': 'stone'}, {'x': 2, 'y': -9, 'z': 0, 'type': 'stone'}, {'x': 2, 'y': -9, 'z': 1, 'type': 'stone'}, {'x': 2, 'y': -9, 'z': 2, 'type': 'stone'}, {'x': 2, 
    'y': -10, 'z': -2, 'type': 'stone'}, {'x': 2, 'y': -10, 'z': -1, 'type': 'stone'}, {'x': 2, 'y': -11, 'z': -1, 'type': 'stone'}, {'x': 2, 'y': -11, 'z': -2, 'type': 'stone'}, {'x': 2, 'y': -10, 'z': 0, 'type': 'stone'}, {'x': 2, 'y': -11, 'z': 0, 'type': 'stone'}, {'x': 2, 'y': -10, 'z': 1, 'type': 'stone'}, {'x': 2, 'y': -11, 'z': 1, 'type': 'stone'}, {'x': 2, 'y': -10, 'z': 2, 'type': 'stone'}, {'x': 1, 'y': -10, 'z': 2, 'type': 'stone'}, {'x': 1, 'y': -11, 'z': 2, 'type': 'stone'}, {'x': 0, 'y': -10, 'z': 2, 'type': 'stone'}, {'x': -1, 'y': -10, 'z': 2, 'type': 'stone'}, {'x': -1, 'y': -11, 'z': 2, 'type': 'stone'}, {'x': -2, 'y': -9, 'z': 2, 'type': 'stone'}, {'x': -2, 'y': -10, 'z': 2, 'type': 'stone'}, {'x': -2, 'y': -11, 'z': 2, 'type': 'stone'}, {'x': -2, 'y': -10, 'z': 1, 'type': 'stone'}, {'x': -2, 'y': -11, 'z': 1, 'type': 'stone'}, {'x': -2, 'y': -10, 'z': 0, 'type': 'stone'}, {'x': -2, 'y': -11, 'z': 0, 'type': 'stone'}, 
    {'x': -2, 'y': -10, 'z': -1, 'type': 'stone'}, {'x': -2, 'y': -11, 'z': -1, 'type': 'stone'}, {'x': -2, 'y': -10, 'z': -2, 'type': 'stone'}, {'x': -2, 'y': -11, 'z': -2, 'type': 'stone'}, {'x': 1, 'y': -10, 'z': -2, 'type': 'stone'}, {'x': 1, 'y': -11, 'z': -2, 'type': 'stone'}, {'x': 0, 'y': -10, 'z': -2, 'type': 'stone'}, {'x': 0, 'y': -11, 'z': -2, 'type': 'stone'}, {'x': -1, 'y': -10, 'z': -2, 'type': 'stone'}, {'x': -1, 'y': -11, 'z': -2, 'type': 'stone'}, {'x': 2, 'y': -12, 'z': -2, 'type': 'stone'}, {'x': 2, 'y': -12, 'z': -1, 'type': 'stone'}, {'x': 2, 'y': -12, 'z': 0, 'type': 'stone'}, {'x': 2, 'y': -12, 'z': 1, 'type': 'stone'}, {'x': 2, 'y': -11, 'z': 2, 'type': 'stone'}, {'x': 1, 'y': -12, 'z': 2, 'type': 'stone'}, {'x': 0, 'y': -11, 'z': 2, 'type': 'stone'}, {'x': 0, 'y': -12, 'z': 2, 'type': 'stone'}, {'x': -2, 'y': -12, 'z': 2, 'type': 'stone'}, {'x': -2, 'y': -12, 'z': 1, 'type': 'stone'}, {'x': -2, 'y': -12, 'z': 0, 
    'type': 'stone'}, {'x': -2, 'y': -12, 'z': -1, 'type': 'stone'}, {'x': -2, 'y': -12, 'z': -2, 'type': 'stone'}, {'x': -1, 'y': -12, 'z': -2, 'type': 'stone'}, {'x': 1, 'y': -12, 'z': -2, 'type': 'stone'}, {'x': 2, 'y': -12, 'z': 2, 'type': 'stone'}, {'x': 1, 'y': -13, 'z': 2, 'type': 'stone'}, {'x': 0, 'y': -13, 'z': 2, 'type': 'stone'}, {'x': -1, 'y': -12, 'z': 2, 'type': 'stone'}, {'x': -1, 'y': -13, 'z': 2, 'type': 'stone'}, {'x': -2, 'y': -13, 'z': 2, 'type': 'stone'}, {'x': -2, 'y': -13, 'z': 1, 'type': 'stone'}, {'x': -2, 'y': -13, 'z': 0, 'type': 'stone'}, {'x': -2, 'y': -13, 'z': -1, 'type': 'stone'}, {'x': -2, 'y': -13, 'z': -2, 'type': 'stone'}, {'x': -1, 'y': -13, 'z': -2, 'type': 'stone'}, 
    {'x': 1, 'y': -13, 'z': -2, 'type': 'stone'}, {'x': 2, 'y': -13, 'z': -1, 'type': 'stone'}, {'x': 2, 'y': -13, 'z': 0, 'type': 'stone'}, {'x': 2, 'y': -13, 'z': 1, 'type': 'stone'}, {'x': 2, 'y': -13, 'z': 2, 'type': 'stone'}, {'x': -1, 
    'y': -8, 'z': -1, 'type': 'cobble'}, {'x': 1, 'y': -13, 'z': -1, 'type': 'lava'}, {'x': 1, 'y': -13, 'z': 0, 'type': 'lava'}, {'x': 1, 'y': -13, 'z': 1, 'type': 'lava'}, {'x': 0, 'y': -13, 'z': 1, 'type': 'lava'}, {'x': 0, 'y': -13, 'z': -1, 'type': 'lava'}, {'x': -1, 'y': -13, 'z': -1, 'type': 'lava'}, {'x': -1, 'y': -13, 'z': 1, 'type': 'lava'}, {'x': 0, 'y': -13, 'z': 0, 'type': 'lava'}, {'x': -1, 'y': -13, 'z': 0, 'type': 'lava'}, {'x': -1, 'y': -14, 'z': 0, 'type': 'lava'}, {'x': -1, 'y': -14, 'z': 1, 'type': 'lava'}, {'x': 1, 'y': -14, 'z': -1, 'type': 'lava'}, {'x': 1, 'y': -14, 'z': 0, 'type': 'lava'}, {'x': 1, 'y': -14, 'z': 1, 'type': 'lava'}, {'x': 0, 'y': -14, 'z': 1, 'type': 'lava'}, {'x': 0, 'y': -14, 'z': 0, 'type': 'lava'}, {'x': 0, 'y': -14, 'z': -1, 'type': 'lava'}, {'x': 0, 'y': -12, 'z': -2, 'type': 'stone'}, {'x': 0, 'y': -13, 'z': -2, 'type': 'stone'}, {'x': 0, 'y': -14, 'z': -2, 'type': 'stone'}, {'x': -1, 'y': 
    -14, 'z': -1, 'type': 'lava'}, {'x': 2, 'y': -14, 'z': -1, 'type': 'stone'}, {'x': 2, 'y': -14, 'z': 0, 'type': 'stone'}, {'x': 2, 'y': -14, 'z': 2, 'type': 'stone'}, {'x': 1, 'y': -14, 'z': 2, 'type': 'stone'}, {'x': 0, 'y': -14, 'z': 2, 'type': 'stone'}, {'x': -1, 'y': -14, 'z': 2, 'type': 'stone'}, {'x': -2, 'y': -14, 'z': 2, 'type': 'stone'}, {'x': -2, 'y': -14, 'z': 1, 'type': 'stone'}, {'x': -2, 'y': -14, 'z': 0, 'type': 'stone'}, {'x': -2, 'y': -14, 'z': -1, 'type': 'stone'}, {'x': -2, 'y': -14, 'z': -2, 'type': 'stone'}, {'x': -1, 'y': -14, 'z': -2, 'type': 'stone'}, {'x': 1, 'y': -14, 'z': -2, 'type': 'stone'}, {'x': 2, 'y': -13, 'z': -2, 'type': 'stone'}, {'x': 2, 'y': -15, 'z': 2, 'type': 'stone'}, {'x': -2, 'y': -15, 'z': 2, 'type': 'stone'}, {'x': -2, 'y': -15, 'z': -2, 'type': 'stone'}, {'x': 2, 'y': -14, 'z': -2, 'type': 'stone'}, {'x': 2, 'y': -15, 'z': -2, 'type': 'stone'}, {'x': -1, 'y': -15, 'z': -2, 'type': 'stone'}, {'x': 1, 'y': -15, 'z': -2, 'type': 'stone'}, {'x': 0, 'y': -15, 'z': -2, 'type': 'stone'}, {'x': -2, 'y': -15, 'z': 1, 'type': 'stone'}, {'x': -2, 'y': -15, 'z': 0, 'type': 'stone'}, {'x': -2, 'y': -15, 'z': -1, 'type': 'stone'}, {'x': 2, 'y': -14, 'z': 1, 'type': 'stone'}, {'x': 2, 'y': -15, 'z': 1, 'type': 'stone'}, {'x': 2, 'y': -15, 'z': 0, 'type': 'stone'}, {'x': 2, 'y': -15, 'z': -1, 'type': 'stone'}, {'x': 1, 'y': -15, 'z': 2, 'type': 'stone'}, {'x': 0, 'y': 
    -15, 'z': 2, 'type': 'stone'}, {'x': -1, 'y': -15, 'z': 2, 'type': 'stone'}, {'x': -1, 'y': -15, 'z': 1, 'type': 'stone'}, {'x': 0, 'y': -15, 'z': 1, 'type': 'stone'}, {'x': 1, 'y': -15, 'z': 1, 'type': 'stone'}, {'x': 1, 'y': -15, 'z': 
    0, 'type': 'stone'}, {'x': 0, 'y': -15, 'z': 0, 'type': 'stone'}, {'x': -1, 'y': -15, 'z': 0, 'type': 'stone'}, {'x': 1, 'y': -15, 'z': -1, 'type': 'stone'}, {'x': 0, 'y': -15, 'z': -1, 'type': 'stone'}, {'x': -1, 'y': -15, 'z': -1, 'type': 'stone'}],

    "ribcage":[{'x': 0, 'y': 0, 'z': 0, 'type': 'bone'}, {'x': -1, 'y': 0, 'z': 0, 'type': 'bone'}, {'x': -2, 'y': 0, 'z': 0, 'type': 'bone'}, {'x': 1, 'y': 0, 'z': 0, 'type': 'bone'}, {'x': 0, 'y': 0, 'z': -1, 'type': 'bone'}, {'x': 0, 'y': 1, 'z': -2, 'type': 'bone'}, {'x': -2, 'y': 0, 'z': -1, 'type': 'bone'}, {'x': -2, 'y': 1, 'z': -2, 'type': 'bone'}, {'x': -3, 'y': 0, 'z': 0, 'type': 'bone'}, {'x': 2, 'y': 0, 'z': -1, 'type': 'bone'}, {'x': 2, 'y': 1, 'z': -2, 'type': 'bone'}, 
    {'x': 2, 'y': 0, 'z': 1, 'type': 'bone'}, {'x': 2, 'y': 1, 'z': 2, 'type': 'bone'}, {'x': 0, 'y': 0, 'z': 1, 'type': 'bone'}, {'x': 0, 'y': 1, 'z': 2, 'type': 'bone'}, {'x': -2, 'y': 0, 'z': 1, 'type': 'bone'}, {'x': -2, 'y': 1, 'z': 2, 
    'type': 'bone'}, {'x': -2, 'y': 2, 'z': 1, 'type': 'bone'}, {'x': -2, 'y': 2, 'z': -1, 'type': 'bone'}, {'x': 0, 'y': 2, 'z': 1, 'type': 'bone'}, {'x': 0, 'y': 2, 'z': -1, 'type': 'bone'}, {'x': 2, 'y': 2, 'z': -1, 'type': 'bone'}, {'x': 2, 'y': 2, 'z': 1, 'type': 'bone'}]
}