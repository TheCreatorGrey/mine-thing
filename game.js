import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';


var selectedBlock = null;
const hotbar = document.getElementById('hotbar');
for (let i of ['dirt', 'grass', 'planks', 'log', 'stone', 'glass', 'cobble', 'snow']) {
    hotbar.insertAdjacentHTML('beforeend', `
    <span class="hotbar-item" id="hotbar-${i}">
        <h1>
        ${i}
        </h1>
    </span>
    `)
}

function switchHotbarItem(index) {
    let child = hotbar.children[index];
    let itemName = child.id.split("-")[1];

    for (let i of hotbar.children) {
        i.style.borderColor = 'grey'
    }

    if (selectedBlock === itemName) {
        selectedBlock = null;

        hand.material = handMat;
        hand.scale.set(1, 1, 1);
    } else {
        selectedBlock = itemName;

        child.style.borderColor = 'white';

        hand.scale.set(2, 2, 1);
        hand.material = blocktex;

        let g = hand.geometry;

        let newUvs = [0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0];
        for (let i in newUvs) {
            g.attributes.uv.array[i] = newUvs[i]
        }

        let tog = "x";
        for (let i in g.attributes.uv.array) {
            g.attributes.uv.array[i] /= 10

            if (tog === 'x') {
                g.attributes.uv.array[i] += blockIndex[selectedBlock].UV[0];

                tog = 'y'
            } else {
                g.attributes.uv.array[i] += blockIndex[selectedBlock].UV[1];

                tog = 'x'
            }
        }

        g.attributes.uv.needsUpdate = true;
    }
}



const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
const textureLoader = new THREE.TextureLoader();
const timer = ms => new Promise(res => setTimeout(res, ms));

window.addEventListener("resize", (event) => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
});

const clock = new THREE.Clock();

const renderer = new THREE.WebGLRenderer({
    antialias: false,
    alpha: true,
});

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new PointerLockControls(camera, renderer.domElement);

document.addEventListener("click", async () => {
    renderer.domElement.requestPointerLock();
});


//light thingy
let sun = new THREE.DirectionalLight(0xffffff);
sun.position.set(400, 400, 400);
let soft = new THREE.DirectionalLight(0x939393);
soft.position.set(-400, 400, -400);
let neath = new THREE.DirectionalLight(0x5f5f5f);
neath.position.set(0, -400, 0);
scene.add(sun);
scene.add(soft);
scene.add(neath);

function changeSkyColor(r, g, b) {
    document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    scene.fog.color = new THREE.Color(`rgb(${r}, ${g}, ${b})`);
    


    sun.color = new THREE.Color(`rgb(${r+100}, ${g+100}, ${b+100})`);
    soft.color = new THREE.Color(`rgb(${r+50}, ${g+50}, ${b+50})`);
    neath.color = new THREE.Color(`rgb(${r}, ${g}, ${b})`);
}


const tracks = {
    'overworld':['Immersed', 'Heavy Heart', 'Healing'],
    'cave':['Ossuary 6 - Air', 'Ossuary 1 - A Beginning'],
    'flesh pit':['The Dread', 'Gathering Darkness', 'Digital Bark'],
};

let trackNum = 0;
let currentDimension = 'overworld';
let aud = new Audio();
async function playNextTrack() {
    if (trackNum > (tracks[currentDimension].length-1)) {
        trackNum = 0
    };

    console.log(tracks[currentDimension], currentDimension, trackNum, tracks[currentDimension][trackNum])

    aud.src = `./assets/music/${tracks[currentDimension][trackNum]}.mp3`;
    aud.currentTime = 0;
    aud.load();
    aud.play();

    trackNum += 1;

    aud.addEventListener('ended', function () {
        playNextTrack()
    });
}



let lastdim;
function chkAmbience(val) {
    let relCamNoise = fractalNoise(Math.round(camera.position.x), Math.round(camera.position.z));

    currentDimension = 'overworld';

    if (camera.position.y < (relCamNoise - 15)) {
        currentDimension = 'cave';
    }

    if (camera.position.y < (relCamNoise - 400)) {
        currentDimension = 'flesh pit';
    }

    if (lastdim !== currentDimension) {
         lastdim = currentDimension
        let skycol;

        if (currentDimension === 'overworld') {
            skycol = [189, 255, 254];
        } else if (currentDimension === 'cave') {
            skycol = [0, 0, 0]
        } else if (currentDimension === 'flesh pit') {
            skycol = [50, 0, 0]
        }
        
        playNextTrack();
        changeSkyColor(skycol[0], skycol[1], skycol[2]);
    }
}


var pressedKeys = {};
window.onkeyup = function (e) { pressedKeys[e.key.toLowerCase()] = false; }
window.onkeydown = function (e) { pressedKeys[e.key.toLowerCase()] = true; }

const blockIndex = {
    'dirt': { UV: [0, .9], transparent: false, sound: ['dirt'] },
    'grass': { UV: [.1, .9], transparent: false, sound: ['grass'] },
    'stone': { UV: [.2, .9], transparent: false, sound: ['stone'] },
    'bedrock': { UV: [.3, .9], transparent: false, sound: ['stone'], unbreakable: true },
    'log': { UV: [.4, .9], transparent: false, sound: ['wood', 'stone'] },
    'leaves': { UV: [.5, .9], transparent: true, sound: ['grass'] },
    'coal ore': { UV: [.6, .9], transparent: false, sound: ['stone'] },
    'iron ore': { UV: [.7, .9], transparent: false, sound: ['stone'] },
    'diamond ore': { UV: [.8, .9], transparent: false, sound: ['stone'] },
    'gold ore': { UV: [.9, .9], transparent: false, sound: ['stone'] },
    'ruby ore': { UV: [0, .8], transparent: false, sound: ['stone'] },
    'sapphire ore': { UV: [.1, .8], transparent: false, sound: ['stone'] },
    'glass': { UV: [.2, .8], transparent: true, sound: ['stone', 'wood'] },
    'snow': { UV: [.3, .8], transparent: false, sound: ['dirt'] },
    'planks': { UV: [.4, .8], transparent: false, sound: ['wood', 'stone'] },
    'sand': { UV: [.5, .8], transparent: false, sound: ['dirt'] },
    'water': { UV: [.6, .8], transparent: true, sound: [], unbreakable: true },
    'cobble': { UV: [.7, .8], transparent: false, sound: ['stone'] },
    'magma': { UV: [.8, .8], transparent: false, sound: ['stone'] },
    'lava': { UV: [.9, .8], transparent: false, sound: ['stone'] },
    'bloodstone': { UV: [0, .7], transparent: false, sound: ['squish', 'stone'] },
    'bones 1': { UV: [.1, .7], transparent: false, sound: ['squish', 'stone'] },
    'bones 2': { UV: [.2, .7], transparent: false, sound: ['squish', 'stone'] },
    'blood': { UV: [.3, .7], transparent: true, sound: [] },
}

const transparentBlocks = [null, 'leaves', 'glass', 'water'];


const TREE = [
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
]


const texture = textureLoader.load(`./assets/atlas.png`);
texture.magFilter = THREE.NearestFilter;
texture.minFilter = THREE.NearestFilter;
//texture.needsUpdate = true;

const blocktex = new THREE.MeshLambertMaterial({ map: texture }); //, transparent: true 


function playSound(url, vol = 1) {
    let aud = new Audio(url);
    aud.volume = vol;
    aud.play();
    return aud;
}

function randInt(max) {
    return Math.floor(Math.random() * max)
}

function fractalNoise(x, z) {
    let octaves = [3, 6, 12, 24];

    let nv1 = noise.perlin2(x / (octaves[0] * 33), z / (octaves[0] * 33)) * (octaves[0] * 8)
    let nv2 = noise.perlin2(x / (octaves[1] * 33), z / (octaves[1] * 33)) * (octaves[1] * 8)
    let nv3 = noise.perlin2(x / (octaves[2] * 33), z / (octaves[2] * 33)) * (octaves[2] * 8)
    let nv4 = noise.perlin2(x / (octaves[3] * 33), z / (octaves[3] * 33)) * (octaves[3] * 8)

    let noiseval = nv1;
    noiseval += 0.5 * nv2;
    noiseval += 0.25 * nv3;
    noiseval += 0.125 * nv4;
    noiseval = Math.round(noiseval) + 50

    return noiseval;
}

let xArray;
let yArray;
let zArray;

var defaultChunkSize = 8;
var generatedChunks = {};
async function generateChunk(xLocation, yLocation, zLocation, size = defaultChunkSize) {
    xArray = [];
    var bCount = 0;

    let treePositions = [];

    for (var x = 0; x < size; x++) {
        yArray = [];
        for (var y = 0; y < defaultChunkSize; y++) {
            zArray = [];
            for (var z = 0; z < size; z++) {
                let globalX = x + (xLocation * size);
                let globalY = y + (yLocation * size);
                let globalZ = z + (zLocation * size);

                let noiseval = fractalNoise(globalX, globalZ);

                var blockType = null;

                if ((blockType === null) && (globalY < 5)) {
                    blockType = 'water'
                }
                
                if (globalY === noiseval) {
                    blockType = 'grass'
                    if ((globalY > 8)) {
                        if (randInt(60) === 0) {
                            treePositions.push([globalX, globalY, globalZ, x, y, z]);
                        }
                    }

                    if (globalY > 200) {
                        blockType = 'snow'
                    }

                    if ((globalY < 7)) {
                        blockType = 'sand'
                    }
                }
                if (globalY < noiseval) {
                    blockType = 'dirt'
                }
                if (globalY < noiseval - 15) {
                    blockType = 'stone';

                    if (randInt(30) === 0) {
                        blockType = 'coal ore'
                    }
                    if (randInt(100) === 0) {
                        blockType = 'iron ore'
                    }
                    if (randInt(400) === 0) {
                        blockType = 'gold ore'
                    }
                    if (randInt(400) === 0) {
                        blockType = 'ruby ore'
                    }
                    if (randInt(400) === 0) {
                        blockType = 'sapphire ore'
                    }
                    if (randInt(1000) === 0) {
                        blockType = 'diamond ore'
                    }

                    if (noise.perlin3(globalX / 10, globalY / 10, globalZ / 10) > 0) {
                        blockType = null;
                    }
                }

                if (globalY === (noiseval - 400)) {
                    blockType = 'bedrock';
                }
                if (globalY === (noiseval - 399)) {
                    if (randInt(2) === 1) {
                        blockType = 'bedrock';
                    }
                }
                if (globalY === (noiseval - 401)) {
                    if (randInt(2) === 1) {
                        blockType = 'bedrock';
                    }
                }

                if (globalY < noiseval - 400) {
                    blockType = 'bloodstone';

                    if (randInt(30) === 0) {
                        blockType = 'bones 1'
                    }
                    if (randInt(100) === 0) {
                        blockType = 'bones 2'
                    }

                    if (noise.perlin3(globalX / 20, globalY / 20, globalZ / 20) > 0) {
                        if (globalY < -600) {
                            blockType = 'blood';
                        } else {
                            blockType = null;
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

    for (let t in treePositions) {
        let tr = treePositions[t];
        for (let b in TREE) {
            let block = TREE[b];
            putBlock(block.x + tr[0], block.y + tr[1], block.z + tr[2], block.type)
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

var renderedChunks = {};
async function loadChunk(chunk, timeout = true) {
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


                if (blockIndex[bType]) {
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

let pendingBlocks = {};
function putBlock(x, y, z, type, reload = false) {
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

function getBlock(x, y, z) {
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
        return null;
    }
}


//hand
let handMat = new THREE.MeshLambertMaterial({ color: 0xffd487 });
let hand = new THREE.Mesh(new THREE.BoxGeometry(.25, .25, .5), handMat);
hand.position.set(.6, -.5, -.8);
hand.lookAt(new THREE.Vector3(.5, 0, -2))
camera.add(hand);
//hand.onBeforeRender = function (renderer) {renderer.clearDepth();};
scene.add(camera);


//var waterTexture = textureLoader.load( './assets/water.png', function ( texture ) {
//
//    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
//    texture.offset.set( 0, 0 );
//    texture.repeat.set( 1000, 1000 );
//    texture.magFilter = THREE.NearestFilter;
//    texture.minFilter = THREE.NearestFilter;
//
//} );
//
//let ocean = new THREE.Mesh(
//    new THREE.PlaneGeometry(1000, 1000), 
//    new THREE.MeshPhongMaterial({ map: waterTexture, side: THREE.DoubleSide, transparent:true, opacity:.8} )
//);
//
//ocean.position.set(0, 4.4, 0);
//ocean.lookAt(new THREE.Vector3(0, 100, 0));
//
//scene.add(ocean)




renderer.domElement.onmousedown = function (e) {
    const raycaster = new THREE.Raycaster();
    const direction = new THREE.Vector3();

    camera.getWorldDirection(direction);
    raycaster.set(camera.position, direction);

    const intersects = raycaster.intersectObjects(Object.values(renderedChunks));

    if (intersects.length > 0) {
        var point = intersects[0].point;
        const normal = intersects[0].face.normal;
        const hit = intersects[0].object;

        let chunkx;
        let chunky;
        let chunkz;

        switch (e.which) {
            case 1:
                point.x -= normal.x * .5;
                point.y -= normal.y * .5;
                point.z -= normal.z * .5;

                putBlock(Math.round(point.x), Math.round(point.y), Math.round(point.z), null, true)
                playSound('./assets/sfx/destroy.ogg');

                break;
            case 3:
                if (selectedBlock) {
                    point.x += normal.x * .5;
                    point.y += normal.y * .5;
                    point.z += normal.z * .5;

                    putBlock(Math.round(point.x), Math.round(point.y), Math.round(point.z), selectedBlock, true)
                    playSound('./assets/sfx/place.ogg');

                    break;
                }
        }
    }
}

//function spawnCow(x, y, z) {
//    let mixer;
//    const loader = new FBXLoader();
//    loader.load( 'assets/creatures/cow.fbx', function ( object ) {
//        //mixer = new THREE.AnimationMixer( object );
//
//        //const action = mixer.clipAction( object.animations[ 0 ] );
//        //action.play();
//
//        scene.add( object );
//        object.scale.set(.02, .02, .02)
//        object.position.set(new THREE.Vector3(x, y, z))
//        object.geometry = new THREE.BoxGeometry();
//    });
//}

let spawnX = (Math.random() - .5) * 100;
let spawnZ = (Math.random() - .5) * 100;
camera.position.set(spawnX, fractalNoise(spawnX, spawnZ) + 2, spawnZ);

var playerVelocity = {
    x: 0,
    y: 0,
    z: 0,
    terminal_x: 5,
    terminal_y: 20,
    terminal_z: 5,
    airResistance: .5,
    walk_force: 1
}

//makes a raycast
function cast(origin, direction, length) {
    const raycaster = new THREE.Raycaster();
    raycaster.far = length;

    raycaster.set(origin, direction);

    return raycaster.intersectObjects(Object.values(renderedChunks));
}



async function chunkLoader() {
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



let renderDistX = 3;
let renderDistY = 3;
let renderDistZ = 3;

scene.fog = new THREE.Fog(0xbdfffe, (renderDistX * defaultChunkSize) / 2, renderDistX * defaultChunkSize);

function calculateDistance(point1, point2) {
    const dx = point1[0] - point2[0];
    const dy = point1[1] - point2[1];
    const dz = point1[2] - point2[2];
    
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

// Sorting function based on distance to the origin (0, 0, 0)
function sortByDistanceToOrigin(a, b) {
    const distanceA = calculateDistance(a, [0, -1, 0]);
    const distanceB = calculateDistance(b, [0, -1, 0]);

    return distanceA - distanceB;
}

let surrounding = [];

for (var x = -renderDistX; x < renderDistX; x++) {
    for (var y = -renderDistY; y < renderDistY; y++) {
        for (var z = -renderDistZ; z < renderDistZ; z++) {

            surrounding.push([x, y, z]);
            await loadChunk(await generateChunk(x + (Math.round(camera.position.x / defaultChunkSize)), y + (Math.round(camera.position.y / defaultChunkSize)), z + (Math.round(camera.position.z / defaultChunkSize))), false); //preload chunks
        }
    }
}

// Sort the coordinates array
//surrounding.sort(sortByDistanceToOrigin);

let oldCamX;
let oldCamY;
let oldCamZ;
let currentChunkX;
let currentChunkY;
let currentChunkZ;

chunkLoader();

let stepTimeout = 1;
async function stepSound(loop = false) {
    let speed = (Math.abs(playerVelocity.x + playerVelocity.z) * 10) + 500;
    speed = (1000 - speed)
    if (speed > 10) {
        stepTimeout = speed
    } else {
        stepTimeout = 10
    }

    let ground = getBlock(
        Math.round(camera.position.x),
        Math.round(camera.position.y - 2),
        Math.round(camera.position.z)
    )

    if (ground && (!underwater)) {
        let ranges = {
            'grass': {range:6, volume:.5},
            'dirt': {range:3, volume:1},
            'stone': {range:6, volume:.5},
            'wood': {range:3, volume:1},
            'squish': {range:4, volume:1}
        }

        if (!(playerVelocity.z === 0)) {
            for (let i of blockIndex[ground].sound) { //for sound combos
                playSound(`./assets/sfx/step/new/${i}${Math.ceil(Math.random() * ranges[i].range)}.wav`, ranges[i].volume);
            }
        }
    }

    if (loop) {
        setTimeout(() => {
            stepSound(true)
        }, stepTimeout);
    }
}

stepSound(true)

addEventListener("keyup", (e) => {
    for (let i of [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
        if (e.key === ("" + i)) {
            switchHotbarItem(i - 1)
        }
    }
});

var gravity = 1;
var underwater = false;
let oldCamPos;

//epic loop
var dt;
function animate() {
    dt = clock.getDelta();

    requestAnimationFrame(animate);

    oldCamPos = {
        'x': camera.position.x,
        'y': camera.position.y,
        'z': camera.position.z,
    }

    //ocean.position.x = Math.round(camera.position.x);
    //ocean.position.z = Math.round(camera.position.z);

    if (pressedKeys["w"]) {
        playerVelocity.z -= playerVelocity.walk_force
    }
    if (pressedKeys["s"]) {
        playerVelocity.z += playerVelocity.walk_force
    }
    if (pressedKeys["a"]) {
        playerVelocity.x -= playerVelocity.walk_force
    }
    if (pressedKeys["d"]) {
        playerVelocity.x += playerVelocity.walk_force
    }

    if (pressedKeys["shift"]) { // i think its a little stupid that minecraft uses double tap W to run instead of the standard shift, so im changing that
        playerVelocity[`terminal_z`] = 8
    } else {
        playerVelocity[`terminal_z`] = 4
    }




    //if (camera.position.y < ocean.position.y) { //the overlay only activates if the player is fully submerged
    //    document.getElementById('overlay').style.backgroundColor = 'rgba(0, 50, 255, 0.5)';
    //} else {
    //    document.getElementById('overlay').style.backgroundColor = 'rgba(0, 0, 0, 0)';
    //}

    //if (camera.position.y < (ocean.position.y + 1)) { //there is a margin here to create the bobbing effect while swimming, and to allow the player to leave the water
    //    gravity = .05
    //    playerVelocity.terminal_y = 1;
    //    playerVelocity.walk_force = .1;
    //    playerVelocity.airResistance = .05;
    //    underwater = true;
    //}

    //if (camera.position.y > (ocean.position.y + .5)) {
    //    gravity = 1
    //    playerVelocity.terminal_y = 10;
    //    playerVelocity.walk_force = 1;
    //    playerVelocity.airResistance = .5;
    //    underwater = false;
    //}

    camera.translateX(playerVelocity.x * dt);
    camera.translateZ(playerVelocity.z * dt);

    camera.position.y = oldCamPos.y;

    for (let v of ['x', 'y', 'z']) {
        if (playerVelocity[v] > playerVelocity[`terminal_${v}`]) {
            playerVelocity[v] = playerVelocity[`terminal_${v}`]
        }

        if (playerVelocity[v] < -playerVelocity[`terminal_${v}`]) {
            playerVelocity[v] = -playerVelocity[`terminal_${v}`]
        }

        if (!(v === 'y')) {
            if (playerVelocity[v] > 0) {
                playerVelocity[v] -= playerVelocity.airResistance
            }

            if (playerVelocity[v] < 0) {
                playerVelocity[v] += playerVelocity.airResistance
            }
        }
    }

    camera.position.y += playerVelocity.y * dt;

    chkAmbience();


    let casts = [
        // floor corner casts
        {
            direction: -1,
            offset: [-.4, 0, -.4],
            length: 1.6,
            axis: 'y'
        },

        {
            direction: -1,
            offset: [.4, 0, .4],
            length: 1.6,
            axis: 'y'
        },

        {
            direction: -1,
            offset: [-.4, 0, .4],
            length: 1.6,
            axis: 'y'
        },

        {
            direction: -1,
            offset: [.4, 0, -.4],
            length: 1.6,
            axis: 'y'
        },


        // ceiling corner casts
        {
            direction: 1,
            offset: [-.4, 0, -.4],
            length: .4,
            axis: 'y'
        },

        {
            direction: 1,
            offset: [.4, 0, .4],
            length: .4,
            axis: 'y'
        },

        {
            direction: 1,
            offset: [-.4, 0, .4],
            length: .4,
            axis: 'y'
        },

        {
            direction: 1,
            offset: [.4, 0, -.4],
            length: .4,
            axis: 'y'
        },




        // lower corner casts
        {
            direction: -1,
            offset: [0, -1, -.4],
            length: .4,
            axis: 'x'
        },

        {
            direction: -1,
            offset: [0, -1, .4],
            length: .4,
            axis: 'x'
        },

        {
            direction: 1,
            offset: [0, -1, -.4],
            length: .4,
            axis: 'x'
        },

        {
            direction: 1,
            offset: [0, -1, .4],
            length: .4,
            axis: 'x'
        },

        {
            direction: -1,
            offset: [-.4, -1, 0],
            length: .4,
            axis: 'z'
        },

        {
            direction: -1,
            offset: [.4, -1, 0],
            length: .4,
            axis: 'z'
        },


        {
            direction: 1,
            offset: [-.4, -1, 0],
            length: .4,
            axis: 'z'
        },

        {
            direction: 1,
            offset: [.4, -1, 0],
            length: .4,
            axis: 'z'
        },







        //upper corner casts
        {
            direction: -1,
            offset: [0, 0, -.4],
            length: .4,
            axis: 'x'
        },

        {
            direction: -1,
            offset: [0, 0, .4],
            length: .4,
            axis: 'x'
        },

        {
            direction: 1,
            offset: [0, 0, -.4],
            length: .4,
            axis: 'x'
        },

        {
            direction: 1,
            offset: [0, 0, .4],
            length: .4,
            axis: 'x'
        },

        {
            direction: -1,
            offset: [-.4, 0, 0],
            length: .4,
            axis: 'z'
        },

        {
            direction: -1,
            offset: [.4, 0, 0],
            length: .4,
            axis: 'z'
        },


        {
            direction: 1,
            offset: [-.4, 0, 0],
            length: .4,
            axis: 'z'
        },

        {
            direction: 1,
            offset: [.4, 0, 0],
            length: .4,
            axis: 'z'
        },
    ]

    for (let c of casts) {
        let vector;

        if (c.axis === 'x') {
            vector = [c.direction, 0, 0]
        } else if (c.axis === 'y') {
            vector = [0, c.direction, 0]
        } else if (c.axis === 'z') {
            vector = [0, 0, c.direction]
        }

        let ray = cast(
            new THREE.Vector3(camera.position.x + c.offset[0], camera.position.y + c.offset[1], camera.position.z + c.offset[2]),
            new THREE.Vector3(vector[0], vector[1], vector[2]), c.length);

        if (ray.length > 0) {
            if (c.direction === 1) {
                if (camera.position[c.axis] > oldCamPos[c.axis]) {
                    camera.position[c.axis] = oldCamPos[c.axis];
                }
            }

            if (c.direction === -1) {
                if (camera.position[c.axis] < oldCamPos[c.axis]) {
                    camera.position[c.axis] = oldCamPos[c.axis];
                }
            }

            if (c.axis === 'y') {
                playerVelocity.y = 0
            }
        }
    }

    if (underwater) {
        if (pressedKeys[" "]) {
            playerVelocity.y += 4
        }
    }

    if (pressedKeys[" "]) {
        if (!underwater) {
            if ((playerVelocity.y == 0) && getBlock(Math.round(camera.position.x), Math.round(camera.position.y - 2), Math.round(camera.position.z))) {
                playerVelocity.y = 14;
                //stepSound()
            }
        }
    }

    playerVelocity.y -= gravity;

    currentChunkX = Math.floor(camera.position.x / defaultChunkSize);
    currentChunkY = Math.floor(camera.position.y / defaultChunkSize);
    currentChunkZ = Math.floor(camera.position.z / defaultChunkSize);

    renderer.render(scene, camera);
}
animate();