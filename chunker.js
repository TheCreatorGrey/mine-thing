import * as THREE from 'three';
import { fractalNoise, randInt, textureLoader, timer } from './utils.js';
import { blockIndex, getIndexOf, models } from './blockindex.js';
import { scene, camera } from './scn.js';
import { STRUCTURES } from './structures.js';

let xArray;
let yArray;
let zArray;

let currentChunkX;
let currentChunkY;
let currentChunkZ;

export let genDistance = 16;
export let renderDist = 4;

export var defaultChunkSize = 16;
export let generatedChunks = {};
export let renderedChunks = {};


export const texture = textureLoader.load(`./assets/atlas.png`);
texture.magFilter = THREE.NearestFilter;
texture.minFilter = THREE.NearestMipMapNearestFilter;
export const blocktex = new THREE.MeshBasicMaterial({ map: texture, alphaTest: 0.5, vertexColors: true });
scene.sortObjects = true;



export function setChunks(value) {
    generatedChunks = value
}

function placeStructure(globalX, globalY, globalZ, name) {
    let structure = STRUCTURES[name];

    for (let b in structure) {
        let block = structure[b];

        putBlock(
            block.x + globalX, 
            block.y + globalY, 
            block.z + globalZ, 
            getIndexOf(block.type)
        )  
    }
}

export class Chunk {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.identifier = `${this.x}/${this.y}/${this.z}`;

        this.blocks = []
        this.size = defaultChunkSize;
        this.hasContent = false;

        this.geometry = null;
        this.mesh = null;

        this.pendingReload = false;
    }


    async generate() {
        let xArray = [];
    
        generatedChunks[this.identifier] = this;
        let newStructures = [];
    
        for (var x = 0; x < this.size; x++) {
            let yArray = [];
            for (var y = 0; y < this.size; y++) {
                let zArray = [];
                for (var z = 0; z < this.size; z++) {
                    let globalX = x + (this.x * this.size);
                    let globalY = y + (this.y * this.size);
                    let globalZ = z + (this.z * this.size);

                    let noiseval = fractalNoise(globalX, globalZ);
                    var blockType = getIndexOf('air');
                
                    //if ((blockType === 0) && (globalY < 5)) {
                    //    blockType = getIndexOf('water')
                    //}
                    
                    if (globalY === noiseval) {
                        blockType = getIndexOf('grass')
                        if ((globalY > 8)) {
                            if (randInt(60) === 0) {
                                newStructures.push(["tree", globalX, globalY, globalZ]);
                            } else if (randInt(200) === 0) {
                                //spawnCow(globalX, globalY+1, globalZ)
                            } else if (randInt(10000) === 0) {
                                newStructures.push(["house", globalX, globalY, globalZ]);
                            } else if (randInt(1000000) === 0) {
                                newStructures.push(["trap", globalX, globalY, globalZ]);
                            }
                        }
                
                        if (globalY > 200) {
                            blockType = getIndexOf('snow')
                        }
                
                        if ((globalY < 7)) {
                            blockType = getIndexOf('sand')
                        }
                    }
                    if (globalY === (noiseval+1)) {
                        if ((globalY > 8)) {
                            if (randInt(30) === 0) {
                                blockType = getIndexOf('grass tuft')
                            }
                            if (randInt(40) === 0) {
                                blockType = getIndexOf('flower')
                            }
                        }
                        
                    }
                    if (globalY < noiseval) {
                        blockType = getIndexOf('dirt')
                    }
                    if (globalY < noiseval - 15) {
                        blockType = getIndexOf('stone');
                
                        if (randInt(30) === 0) {
                            blockType = getIndexOf('coal ore')
                        }
                        if (randInt(100) === 0) {
                            blockType = getIndexOf('iron ore')
                        }
                        if (randInt(400) === 0) {
                            blockType = getIndexOf('gold ore')
                        }
                        if (randInt(400) === 0) {
                            blockType = getIndexOf('ruby ore')
                        }
                        if (randInt(400) === 0) {
                            blockType = getIndexOf('sapphire ore')
                        }
                        if (randInt(1000) === 0) {
                            blockType = getIndexOf('diamond ore')
                        }
                
                        if (noise.perlin3(globalX / 10, globalY / 10, globalZ / 10) > 0) {
                            blockType = getIndexOf('air');
                        }
                    }
                
                    if (globalY === (noiseval - 400)) {
                        blockType = getIndexOf('bedrock');
                    }
                    if (globalY === (noiseval - 399)) {
                        if (randInt(2) === 1) {
                            blockType = getIndexOf('bedrock');
                        }
                    }
                    if (globalY === (noiseval - 401)) {
                        if (randInt(2) === 1) {
                            blockType = getIndexOf('bedrock');
                        }
                    }
                
                    if (globalY < noiseval - 400) {
                        blockType = getIndexOf('bloodstone');
                
                        if (randInt(30) === 0) {
                            blockType = getIndexOf('bones 1')
                        }
                        if (randInt(100) === 0) {
                            blockType = getIndexOf('bones 2')
                        }
                
                        if (noise.perlin3(globalX / 20, globalY / 20, globalZ / 20) > 0) {
                            if (globalY < -600) {
                                blockType = getIndexOf('blood');
                            } else {
                                blockType = getIndexOf('air');
                            }
                        } else {
                            if (randInt(10000) === 0) {
                                newStructures.push(["ribcage", globalX, globalY, globalZ]);
                            }
                        }
                    }
                
                    zArray.push(blockType);
                }
                yArray.push(zArray)
            }
            xArray.push(yArray)
        }

        this.blocks = xArray
        this.hasContent = true;
    
        for (let struct of newStructures) {
            placeStructure(
                struct[1],
                struct[2],
                struct[3],
                struct[0]
            )
        }
    }


    async load(timeout=true) {
        if (this.geometry) {
            this.geometry.dispose()
        }

        this.geometry = new THREE.BufferGeometry();
        
        let vertices = [];
        let norms = [];
        let uvs = [];
        let colors = [];


        // Adds a quad to the chunk's mesh
        function addQuad(p1, p2, p3, p4, normal, lightLevel=.5, uv_scale=[1, 1], uv_offset=[0, 0], textureSize=[6, 32]) {
            // p1 = bottom left, 
            // p2 = top left,
            // p3 = top right,
            // p4 = bottom right

            vertices.push(
                ...[
                    p1[0], p1[1], p1[2], // top left triangle
                    p2[0], p2[1], p2[2],
                    p3[0], p3[1], p3[2],
                    p3[0], p3[1], p3[2], // bottom right triangle
                    p4[0], p4[1], p4[2],
                    p1[0], p1[1], p1[2],
                ]
            )


    
            norms.push(
                ...[
                    normal[0], normal[1], normal[2],
                    normal[0], normal[1], normal[2],
                    normal[0], normal[1], normal[2],
                    normal[0], normal[1], normal[2],
                    normal[0], normal[1], normal[2],
                    normal[0], normal[1], normal[2]
                ]
            )



            // bottom left, 
            // top left,
            // top right,
            // bottom right
            let quad_uvs = [
                [0, 0],
                [0, 1],
                [1, 1],
                [1, 0]
            ]

            // Offset UVS
            for (let q in quad_uvs) {
                // How much vertical space of the texture the block atlas takes up
                let verticalUnit = 1/textureSize[1];
                let horizontalUnit = 1/textureSize[0];

                // UVs at 0, 0 are at the bottom left of the texture because threejs' UV coordinate system is stupid and dumb
    
                quad_uvs[q][1] /= textureSize[1]; // Shrink uvs vertically to one pixel or unit
                quad_uvs[q][1] += (1-verticalUnit); // Move uvs to top of texture
                quad_uvs[q][1] -= verticalUnit*uv_offset[1]; // Move by vertical offset
    
                quad_uvs[q][0] /= textureSize[0]; // Shrink uvs horizontally to one pixel or unit
                quad_uvs[q][0] += horizontalUnit*uv_offset[0]; // Move by horizontal offset
            }
    
            uvs.push(
                ...[
                    quad_uvs[0][0], quad_uvs[0][1],
                    quad_uvs[1][0], quad_uvs[1][1],
                    quad_uvs[2][0], quad_uvs[2][1],
                    quad_uvs[2][0], quad_uvs[2][1],
                    quad_uvs[3][0], quad_uvs[3][1],
                    quad_uvs[0][0], quad_uvs[0][1]
                ]
            )


    
            colors.push(
                ...Array(6*3).fill(lightLevel)
            )
        }
    
        // normal: x, y, z = 0, 1, 2
        // direction: -1, 1 = negative, positive
        function blockFace(x, y, z, axis=0, direction=1, type=0) {
            let points;
    
            if (axis == 0) {
                points = [ // Normal is X
                    [0, -.5, .5],
                    [0, .5, .5], 
                    [0, .5, -.5], 
                    [0, -.5, -.5]
                ]
            } else if (axis == 1) {
                points = [ // Normal is Y
                    [-.5, 0, -.5],
                    [-.5, 0, .5], 
                    [.5, 0, .5], 
                    [.5, 0, -.5]
                ]
            }if (axis == 2) {
                points = [ // Normal is Z
                    [-.5, -.5, 0],
                    [-.5, .5, 0], 
                    [.5, .5, 0], 
                    [.5, -.5, 0]
                ]
            }
    
            // Since the BufferGeometry decides which face is the front
            // by the order of the vertices, the vertices may need to
            // be reversed in some cases
            if ((direction == 1) && (axis !== 1)) {
                points.reverse()
            }
            if ((direction == -1) && (axis == 1)) {
                points.reverse()
            }
            
    
            // Shift quad along direction
            for (let p in points) {
                points[p][axis] = .5*direction;
                points[p][0] += x;
                points[p][1] += y;
                points[p][2] += z;
            }


    

            let normal = [0, 0, 0];
            normal[axis] = 1*direction;
    


            let horizontalOffset;
            if (axis == 0) { // x
                if (direction == 1) {
                    horizontalOffset = 3
                } else {
                    horizontalOffset = 2
                }
            } else if (axis == 1) { // y
                if (direction == 1) {
                    horizontalOffset = 0
                } else {
                    horizontalOffset = 1
                }
            } else if (axis == 2) { // z
                if (direction == 1) {
                    horizontalOffset = 4
                } else {
                    horizontalOffset = 5
                }
            }
    

    
            // This may be changed to a full lighting system later :)
            let face_brightness = .2;
            if (axis == 1) {
                if (direction == 1) {
                    face_brightness = .3
                }if (direction == -1) {
                    face_brightness = .1
                }
            }
            if (axis == 0) {
                face_brightness = .25
            }
    


            addQuad(
                points[0],
                points[1],
                points[2],
                points[3],

                normal,
                face_brightness,
                [1, 1],
                [
                    horizontalOffset, 
                    blockIndex[type].UV
                ],
                [6, 32]
            )
        }
    
    
    
    

    
        let totalIter = 0;
        let x = 0;
        let y = 0;
        let z = 0;
    
        while (totalIter < (Math.pow(this.size, 3))) {
            let bType = this.blocks[x][y][z];
            let blockData = blockIndex[bType];

            if (blockData.model) {
                let model = models[blockData.model];

                for (let q in model) {
                    let quad = model[q];

                    let quadPoints = [
                    ]

                    for (let p in quad) {
                        let point = quad[p];
                        
                        quadPoints.push(
                            [
                                point[0] + x,
                                point[1] + y,
                                point[2] + z
                            ]
                        )
                    }
                    

                    addQuad(
                        quadPoints[0],
                        quadPoints[1],
                        quadPoints[2],
                        quadPoints[3],
                        quad[4],
                        .3,
                        quadPoints[6],
                        [quad[5][0], blockIndex[bType].UV + quad[5][1]]
                    )
                }
            } else {
                let check = [
                    [0, 1],
                    [0, -1],
                    [1, 1],
                    [1, -1],
                    [2, 1],
                    [2, -1],
                ];

                for (let c in check) {
                    let exposed = false;

                    let thisPosition = [x, y, z];
                    let axis = check[c][0];
                    let direction = check[c][1];

                    let adjacentPosition = Array.from(thisPosition);
                    adjacentPosition[axis] += direction;


                    if (
                        (thisPosition[axis] === 0) &&
                        (direction === -1)
                    ) {
                        exposed = true
                    }

                    if (
                        (thisPosition[axis] === (this.size-1)) &&
                        (direction === 1)
                    ) {
                        exposed = true
                    }

                    //let adjacent = [
                    //    x + offset[0],
                    //    y + offset[1],
                    //    z + offset[2]
                    //]

                    if (!exposed) {
                        let adjacentBlock = this.blocks[adjacentPosition[0]][adjacentPosition[1]][adjacentPosition[2]];

                        if (!(adjacentBlock in blockIndex)) {
                            console.log(adjacentBlock)
                        }

                        let adjacentInfo = blockIndex[adjacentBlock];

                        if (adjacentInfo.transparent) {
                            if (adjacentBlock !== bType) {
                                exposed = true
                            }
                        }
                    }

                    if (exposed) {
                        if (bType) {
                            blockFace(
                                x,
                                y,
                                z,
                                axis, direction, bType
                            )
                        }
                    }
                }
            }
    
    
            totalIter++
            x++
            if (x === this.size) {
                x = 0
                y++
            }
            if (y === this.size) {
                y = 0
                z++
            }
        }
    
    
        this.geometry.setAttribute('position',
            new THREE.BufferAttribute(
                new Float32Array(vertices),
                3
            )
        );
    
        this.geometry.setAttribute('normal',
            new THREE.BufferAttribute(
                new Float32Array(norms),
                3
            )
        );
    
        this.geometry.setAttribute('uv',
            new THREE.BufferAttribute(
                new Float32Array(uvs),
                2
            )
        );
    
        this.geometry.setAttribute('color',
            new THREE.BufferAttribute(
                new Float32Array(colors),
                3
            )
        );


        if (this.mesh) {
            scene.remove(this.mesh)
        }

        this.mesh = new THREE.Mesh(this.geometry, blocktex)
    
        scene.add(this.mesh);
    
        this.mesh.position.x = this.x * this.size;
        this.mesh.position.y = this.y * this.size;
        this.mesh.position.z = this.z * this.size;
    
        renderedChunks[this.identifier] = this;
    }


    unload() {
        if (this.geometry) {
            this.geometry.dispose()
        }
        this.geometry = null;

        if (this.mesh) {
            scene.remove(this.mesh)
        }
        this.mesh = null;

        delete renderedChunks[this.identifier]
    }
}


export let surrounding_visible = [];
export let surrounding_preload = [];

for (var x = -genDistance; x < genDistance; x++) {
    for (var y = -genDistance; y < genDistance; y++) {
        for (var z = -genDistance; z < genDistance; z++) {
            surrounding_preload.push([x, y, z]);
        }
    }
}

for (var x = -renderDist; x < renderDist; x++) {
    for (var y = -renderDist; y < renderDist; y++) {
        for (var z = -renderDist; z < renderDist; z++) {
            surrounding_visible.push([x, y, z]);
        }
    }
}

function distanceFromOrigin(point) {
    return Math.sqrt(point[0] ** 2 + point[1] ** 2 + point[2] ** 2);
}

surrounding_preload.sort((a, b) => distanceFromOrigin(a) - distanceFromOrigin(b));
surrounding_visible.sort((a, b) => distanceFromOrigin(a) - distanceFromOrigin(b));



export async function putBlock(x, y, z, type, reload = false) {
    let chunkPos = {
        x: Math.floor(x / defaultChunkSize),
        y: Math.floor(y / defaultChunkSize),
        z: Math.floor(z / defaultChunkSize)
    }

    let blockPos = {
        x: ((x % defaultChunkSize) + defaultChunkSize) % defaultChunkSize,
        y: ((y % defaultChunkSize) + defaultChunkSize) % defaultChunkSize,
        z: ((z % defaultChunkSize) + defaultChunkSize) % defaultChunkSize
    }

    let chunk;

    if (`${chunkPos.x}/${chunkPos.y}/${chunkPos.z}` in generatedChunks) {
        chunk = generatedChunks[`${chunkPos.x}/${chunkPos.y}/${chunkPos.z}`]
    } else {
        chunk = new Chunk(chunkPos.x, chunkPos.y, chunkPos.z)
        await chunk.generate()
    }

    chunk.blocks[blockPos.x][blockPos.y][blockPos.z] = type;

    if (reload) {
        chunk.pendingReload = true
    }
}

export function getBlock(approxX, approxY, approxZ) {
    let x = Math.round(approxX);
    let y = Math.round(approxY);
    let z = Math.round(approxZ);

    let chunkPos = {
        x: Math.floor(x / defaultChunkSize),
        y: Math.floor(y / defaultChunkSize),
        z: Math.floor(z / defaultChunkSize)
    }

    let blockPos = {
        x: ((x % defaultChunkSize) + defaultChunkSize) % defaultChunkSize,
        y: ((y % defaultChunkSize) + defaultChunkSize) % defaultChunkSize,
        z: ((z % defaultChunkSize) + defaultChunkSize) % defaultChunkSize
    }

    if (generatedChunks[`${chunkPos.x}/${chunkPos.y}/${chunkPos.z}`]) {
        return generatedChunks[`${chunkPos.x}/${chunkPos.y}/${chunkPos.z}`].blocks[blockPos.x][blockPos.y][blockPos.z]
    } else {
        return 0;
    }
}


export function findEntityChunk(x, y, z) {
    let chunkX = Math.floor(x / defaultChunkSize);
    let chunkY = Math.floor(y / defaultChunkSize);
    let chunkZ = Math.floor(z / defaultChunkSize);

    return renderedChunks[`${currentChunkX}/${currentChunkY}/${currentChunkZ}`]
}





export async function chunkLoader() {
    currentChunkX = Math.floor(camera.position.x / defaultChunkSize);
    currentChunkY = Math.floor(camera.position.y / defaultChunkSize);
    currentChunkZ = Math.floor(camera.position.z / defaultChunkSize);

    // Update current chunks
    for (let ch in generatedChunks) {
        let chunk = generatedChunks[ch];

        if (chunk.pendingReload) {
            chunk.pendingReload = false
            chunk.load()
        }
    }

    // Deload distant chunks
    for (let ch in renderedChunks) {
        let chunk = renderedChunks[ch];

        let chX = Math.round((chunk.mesh.position.x - camera.position.x) / defaultChunkSize);
        let chY = Math.round((chunk.mesh.position.y - camera.position.y) / defaultChunkSize);
        let chZ = Math.round((chunk.mesh.position.z - camera.position.z) / defaultChunkSize);

        let deload = false;

        if (chX > (renderDist + 1)) {
            deload = true
        }
        if (chX < -(renderDist + 1)) {
            deload = true
        }

        if (chZ > (renderDist + 1)) {
            deload = true
        }
        if (chZ < -(renderDist + 1)) {
            deload = true
        }

        if (chY > (renderDist + 1)) {
            deload = true
        }
        if (chY < -(renderDist + 1)) {
            deload = true
        }


        if (deload) {
            renderedChunks[chunk.identifier].unload();
        }
    }

    for (let ch in surrounding_visible) {
        let chunkCoords = [surrounding_visible[ch][0] + currentChunkX, surrounding_visible[ch][1] + currentChunkY, surrounding_visible[ch][2] + currentChunkZ];
        let id = `${chunkCoords[0]}/${chunkCoords[1]}/${chunkCoords[2]}`;

        let generated = generatedChunks[id]
        
        if (! (id in renderedChunks)) {
            if (generated) {
                if (generated.hasContent) {
                    await generated.load()
                    await timer(1)

                    break
                }
            }
        }
    }

    setTimeout(() => {
        chunkLoader()
    }, 10);
}

export async function chunkGenerator() {
    currentChunkX = Math.floor(camera.position.x / defaultChunkSize);
    currentChunkY = Math.floor(camera.position.y / defaultChunkSize);
    currentChunkZ = Math.floor(camera.position.z / defaultChunkSize);

    for (let ch in surrounding_preload) {
        let chunkCoords = [
            surrounding_preload[ch][0] + currentChunkX, 
            surrounding_preload[ch][1] + currentChunkY, 
            surrounding_preload[ch][2] + currentChunkZ
        ];

        let id = `${chunkCoords[0]}/${chunkCoords[1]}/${chunkCoords[2]}`;
        
        if (! (id in generatedChunks)) {
            let newChunk = new Chunk(chunkCoords[0], chunkCoords[1], chunkCoords[2]);
            await newChunk.generate()
            await timer(1)

            break
        }
    }

    setTimeout(() => {
        chunkGenerator()
    }, 10);
}


chunkGenerator();
chunkLoader();