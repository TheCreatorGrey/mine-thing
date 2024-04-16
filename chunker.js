import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import { fractalNoise, randInt, textureLoader, timer } from './utils.js';
import { blockIndex, transparentBlocks, liquids, getIndexOf } from './blockindex.js';
import { scene, camera } from './scn.js';
import { STRUCTURES } from './structures.js';

let xArray;
let yArray;
let zArray;

let currentChunkX;
let currentChunkY;
let currentChunkZ;

export let renderDistX = 2;
export let renderDistY = 2;
export let renderDistZ = 2;

export let surrounding = [];
export var defaultChunkSize = 8;
export let generatedChunks = {};
export let pendingBlocks = {};
export let renderedChunks = {};

export const texture = textureLoader.load(`./assets/atlas.png`);
texture.magFilter = THREE.NearestFilter;
texture.minFilter = THREE.NearestFilter;
export const blocktex = new THREE.MeshLambertMaterial({ map: texture }); //, transparent: true 

for (var x = -renderDistX; x < renderDistX; x++) {
    for (var y = -renderDistY; y < renderDistY; y++) {
        for (var z = -renderDistZ; z < renderDistZ; z++) {

            surrounding.push([x, y, z]);
            await loadChunk(await generateChunk(x + (Math.round(camera.position.x / defaultChunkSize)), y + (Math.round(camera.position.y / defaultChunkSize)), z + (Math.round(camera.position.z / defaultChunkSize))), false); //preload chunks
        }
    }
}

export function setChunks(value) {
    generatedChunks = value
}

export async function generateChunk(xLocation, yLocation, zLocation, size = defaultChunkSize, superflat=false) {
    xArray = [];
    var bCount = 0;

    let newStructures = [];

    for (var x = 0; x < size; x++) {
        yArray = [];
        for (var y = 0; y < defaultChunkSize; y++) {
            zArray = [];
            for (var z = 0; z < size; z++) {
                let globalX = x + (xLocation * size);
                let globalY = y + (yLocation * size);
                let globalZ = z + (zLocation * size);

                let noiseval;
                if (superflat) {
                    noiseval = 8
                } else {
                    noiseval = fractalNoise(globalX, globalZ);
                }

                var blockType = getIndexOf('air');

                if ((blockType === 0) && (globalY < 5)) {
                    blockType = getIndexOf('water')
                }
                
                if (globalY === noiseval) {
                    blockType = getIndexOf('grass')
                    if ((globalY > 8)) {
                        if (randInt(60) === 0) {
                            newStructures.push(["tree", globalX, globalY, globalZ]);
                        } else if (randInt(200) === 0) {
                            //spawnCow(globalX, globalY+1, globalZ)
                        } else if (randInt(100000) === 0) {
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

                if (blockType) {
                    bCount += 1;
                }

                zArray.push(blockType);
            }
            yArray.push(zArray)
        }
        xArray.push(yArray)
    }

    generatedChunks[`${xLocation}/${yLocation}/${zLocation}`] = {
        x: xLocation,
        y: yLocation,
        z: zLocation,
        size: size,
        blocks: xArray,
        bCount: bCount
    };

    for (let struct of newStructures) {
        for (let b in STRUCTURES[struct[0]]) {
            let block = STRUCTURES[struct[0]][b];
            putBlock(block.x + struct[1], block.y + struct[2], block.z + struct[3], getIndexOf(block.type))
        }
    }

    let pb = pendingBlocks[`${xLocation}/${yLocation}/${zLocation}`];
    if (pb) {
        for (let b of pb) {
            //xArray[b[0]][b[1]][b[2]] = b[3]
            putBlock(b[0], b[1], b[2], b[3])
        }
    }

    return generatedChunks[`${xLocation}/${yLocation}/${zLocation}`];
}

export async function loadChunk(chunk, timeout = true) {
    const matrix = new THREE.Matrix4();

    const pxGeometry = new THREE.PlaneGeometry(1, 1);
    pxGeometry.rotateY(Math.PI / 2);
    pxGeometry.translate(.5, 0, 0);

    const nxGeometry = new THREE.PlaneGeometry(1, 1);
    nxGeometry.rotateY(- Math.PI / 2);
    nxGeometry.translate(- .5, 0, 0);

    const pyGeometry = new THREE.PlaneGeometry(1, 1);

    pyGeometry.rotateX(- Math.PI / 2);
    pyGeometry.translate(0, .5, 0);

    const nyGeometry = new THREE.PlaneGeometry(1, 1);
    nyGeometry.rotateX(Math.PI / 2);
    nyGeometry.translate(0, - .5, 0);

    const pzGeometry = new THREE.PlaneGeometry(1, 1);
    pzGeometry.translate(0, 0, .5);

    const nzGeometry = new THREE.PlaneGeometry(1, 1);
    nzGeometry.rotateY(Math.PI);
    nzGeometry.translate(0, 0, - .5);

    const geometries = [];
    var totalIter = 0;

    if (timeout) {
        await timer(1);
    }
    
    for (var x = 0; x < chunk.size; x++) {
        for (var y = 0; y < chunk.size; y++) {
            for (var z = 0; z < chunk.size; z++) {

                let bType = chunk.blocks[x][y][z];


                if (blockIndex[bType] && (bType !== 0)) {
                    let yOffset = blockIndex[bType].UV[1];
                    let xOffset = blockIndex[bType].UV[0];

                    for (let g of [pxGeometry, nxGeometry, pyGeometry, nyGeometry, pzGeometry, nzGeometry]) {
                        g.attributes.uv.array[0] = 0;
                        g.attributes.uv.array[1] = 1;
                        g.attributes.uv.array[2] = 1;
                        g.attributes.uv.array[3] = 1;
                        g.attributes.uv.array[4] = 0;
                        g.attributes.uv.array[5] = 0;
                        g.attributes.uv.array[6] = 1;
                        g.attributes.uv.array[7] = 0;

                        let tog = "x";
                        for (let i in g.attributes.uv.array) {
                            g.attributes.uv.array[i] /= 10

                            if (tog === 'x') {
                                g.attributes.uv.array[i] += xOffset;

                                tog = 'y'
                            } else {
                                g.attributes.uv.array[i] += yOffset;

                                tog = 'x'
                            }
                        }
                    }
                }

                let exposed = {
                    posX: false,
                    negX: false,
                    posY: false,
                    negY: false,
                    posZ: false,
                    negZ: false,
                };

                if (x === 0) {
                    exposed.negX = true
                }
                if (y === 0) {
                    exposed.negY = true
                }
                if (z === 0) {
                    exposed.negZ = true
                }

                if (x === chunk.size - 1) {
                    exposed.posX = true
                }
                if (y === chunk.size - 1) {
                    exposed.posY = true
                }
                if (z === chunk.size - 1) {
                    exposed.posZ = true
                }

                if (!exposed.posX) {
                    if (transparentBlocks.includes(chunk.blocks[x + 1][y][z]) && !(chunk.blocks[x + 1][y][z] === bType)) {
                        exposed.posX = true
                    }
                }
                if (!exposed.negX) {
                    if (transparentBlocks.includes(chunk.blocks[x - 1][y][z]) && !(chunk.blocks[x - 1][y][z] === bType)) {
                        exposed.negX = true
                    }
                }

                if (!exposed.posY) {
                    if (transparentBlocks.includes(chunk.blocks[x][y + 1][z]) && !(chunk.blocks[x][y + 1][z] === bType)) {
                        exposed.posY = true
                    }
                }
                if (!exposed.negY) {
                    if (transparentBlocks.includes(chunk.blocks[x][y - 1][z]) && !(chunk.blocks[x][y - 1][z] === bType)) {
                        exposed.negY = true
                    }
                }

                if (!exposed.posZ) {
                    if (transparentBlocks.includes(chunk.blocks[x][y][z + 1]) && !(chunk.blocks[x][y][z + 1] === bType)) {
                        exposed.posZ = true
                    }
                }
                if (!exposed.negZ) {
                    if (transparentBlocks.includes(chunk.blocks[x][y][z - 1]) && !(chunk.blocks[x][y][z - 1] === bType)) {
                        exposed.negZ = true
                    }
                }

                if (bType) {
                    matrix.makeTranslation(
                        x,
                        y,
                        z,
                    );

                    if (exposed.posY) {
                        geometries.push(pyGeometry.clone().applyMatrix4(matrix));
                    }
                    if (exposed.negY) {
                        geometries.push(nyGeometry.clone().applyMatrix4(matrix));
                    }

                    if (exposed.posX) {
                        geometries.push(pxGeometry.clone().applyMatrix4(matrix));
                    }
                    if (exposed.negX) {
                        geometries.push(nxGeometry.clone().applyMatrix4(matrix));
                    }

                    if (exposed.posZ) {
                        geometries.push(pzGeometry.clone().applyMatrix4(matrix));
                    }
                    if (exposed.negZ) {
                        geometries.push(nzGeometry.clone().applyMatrix4(matrix));
                    }

                    totalIter += 1;
                }
            }
        }
    }

    let geometry;

    if (geometries.length > 0) { //the geometry merger throws errors when there is no geometry to merge, so i add this invisible geometry filler
        geometry = BufferGeometryUtils.mergeGeometries(geometries);
        geometry.computeBoundingSphere();
    } else {
        geometry = new THREE.BoxGeometry(0, 0)
    }

    let oldChunk = renderedChunks[`${chunk.x}/${chunk.y}/${chunk.z}`];

    const mesh = new THREE.Mesh(geometry, blocktex);
    scene.add(mesh);

    mesh.position.x = chunk.x * chunk.size;
    mesh.position.y = chunk.y * chunk.size;
    mesh.position.z = chunk.z * chunk.size;

    renderedChunks[`${chunk.x}/${chunk.y}/${chunk.z}`] = mesh;

    //destroy previous chunk
    if (oldChunk) {
        scene.remove(oldChunk);
        oldChunk.geometry.dispose();
    }
}

export function putBlock(x, y, z, type, reload = false) {
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
        generatedChunks[`${chunkPos.x}/${chunkPos.y}/${chunkPos.z}`].blocks[blockPos.x][blockPos.y][blockPos.z] = type;

        if (reload) {
            loadChunk(generatedChunks[`${chunkPos.x}/${chunkPos.y}/${chunkPos.z}`], false)
        }
    } else {
        if (!pendingBlocks[`${chunkPos.x}/${chunkPos.y}/${chunkPos.z}`]) {
            pendingBlocks[`${chunkPos.x}/${chunkPos.y}/${chunkPos.z}`] = []
        }

        pendingBlocks[`${chunkPos.x}/${chunkPos.y}/${chunkPos.z}`].push([x, y, z, type])
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

    for (let ch in surrounding) {
        let chunkCoords = [surrounding[ch][0] + currentChunkX, surrounding[ch][1] + currentChunkY, surrounding[ch][2] + currentChunkZ];

        if (!renderedChunks[`${chunkCoords[0]}/${chunkCoords[1]}/${chunkCoords[2]}`]) {
            if (generatedChunks[`${chunkCoords[0]}/${chunkCoords[1]}/${chunkCoords[2]}`]) {
                await loadChunk(generatedChunks[`${chunkCoords[0]}/${chunkCoords[1]}/${chunkCoords[2]}`]);

            } else {
                await loadChunk(await generateChunk(chunkCoords[0], chunkCoords[1], chunkCoords[2]));
            }
        }
    }

    for (let ch in renderedChunks) {
        let chunk = renderedChunks[ch];

        //if (distanceTo(camera.position.x, camera.position.z, chunk.position.x, chunk.position.z) > renderDistX*defaultChunkSize+15) {
        //    delete renderedChunks[`${chunk.position.x/defaultChunkSize}/${chunk.position.y/defaultChunkSize}/${chunk.position.z/defaultChunkSize}`];
        //    scene.remove(chunk);
        //    chunk.geometry.dispose();
        //}

        let chX = Math.round((chunk.position.x - camera.position.x) / defaultChunkSize);
        let chY = Math.round((chunk.position.y - camera.position.y) / defaultChunkSize);
        let chZ = Math.round((chunk.position.z - camera.position.z) / defaultChunkSize);

        let deload = false;

        if (chX > (renderDistX + 1)) {
            deload = true
        }
        if (chX < -(renderDistX + 1)) {
            deload = true
        }

        if (chZ > (renderDistZ + 1)) {
            deload = true
        }
        if (chZ < -(renderDistZ + 1)) {
            deload = true
        }

        if (chY > (renderDistY + 1)) {
            deload = true
        }
        if (chY < -(renderDistY + 1)) {
            deload = true
        }


        if (deload) {
            delete renderedChunks[`${chunk.position.x / defaultChunkSize}/${chunk.position.y / defaultChunkSize}/${chunk.position.z / defaultChunkSize}`];
            scene.remove(chunk);
            chunk.geometry.dispose();
        }
    }

    setTimeout(() => {
        chunkLoader()
    }, 100);
}