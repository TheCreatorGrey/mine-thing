import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { blockIndex } from './blockindex.js';
import { STRUCTURES } from './structures.js';

var worldEntities = [];

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

    //console.log(tracks[currentDimension], currentDimension, trackNum, tracks[currentDimension][trackNum])

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

const transparentBlocks = [null, 'leaves', 'glass', 'water', 'blood'];
const liquids = ['water', 'blood']

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
    noiseval = Math.round(noiseval) // +50

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

    let newStructures = [];

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
            putBlock(block.x + struct[1], block.y + struct[2], block.z + struct[3], block.type)
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

//renderer.domElement.onmousedown = function (e) {
//    const intersects = camCast();
//
//    if (intersects.length > 0) {
//        var point = intersects[0].point;
//        const normal = intersects[0].face.normal;
//        const hit = intersects[0].object;
//
//        let chunkx;
//        let chunky;
//        let chunkz;
//
//        switch (e.which) {
//            case 1:
//                point.x -= normal.x * .5;
//                point.y -= normal.y * .5;
//                point.z -= normal.z * .5;
//
//                putBlock(Math.round(point.x), Math.round(point.y), Math.round(point.z), null, true)
//                playSound('./assets/sfx/destroy.ogg');
//
//                break;
//            case 3:
//                if (selectedBlock) {
//                    point.x += normal.x * .5;
//                    point.y += normal.y * .5;
//                    point.z += normal.z * .5;
//
//                    putBlock(Math.round(point.x), Math.round(point.y), Math.round(point.z), selectedBlock, true)
//                    playSound('./assets/sfx/place.ogg');
//
//                    break;
//                }
//        }
//    }
//}

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


function camCast() {
    const raycaster = new THREE.Raycaster();
    const direction = new THREE.Vector3();

    camera.getWorldDirection(direction);
    raycaster.set(camera.position, direction);

    return raycaster.intersectObjects(Object.values(renderedChunks));
}

renderer.domElement.onmousedown = function (e) {
    switch (e.which) {
        case 1:
            pressedKeys.mouseLeft = true

            break;
        case 3:
            pressedKeys.mouseRight = true

            break;
    }
}

renderer.domElement.onmouseup = function (e) {
    switch (e.which) {
        case 1:
            pressedKeys.mouseLeft = false

            break;
        case 3:
            pressedKeys.mouseRight = false

            break;
    }
}



var gravity = 1;

class Entity {
    constructor(obj, height=1.6) {
        this.object = obj;

        this.casts = [
            // floor corner casts
            {
                direction: -1,
                offset: [-.4, 0, -.4],
                length: height,
                axis: 'y'
            },
        
            {
                direction: -1,
                offset: [.4, 0, .4],
                length: height,
                axis: 'y'
            },
        
            {
                direction: -1,
                offset: [-.4, 0, .4],
                length: height,
                axis: 'y'
            },
        
            {
                direction: -1,
                offset: [.4, 0, -.4],
                length: height,
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

        this.velocity = {
            x: 0,
            y: 0,
            z: 0,
            terminal_x: 5,
            terminal_y: 20,
            terminal_z: 5,
            airResistance: .5,
            walk_force: 1
        }

        this.attemptedVelocity = {
            for:false,
            back:false,
            left:false,
            right:false,
            running:false,
            jumping:false
        }

        this.underwater = false;

        this.id = worldEntities.length;
        worldEntities.push(this);
        this.onupdate = null;
    }

    update() {
        let oldPos = {
            'x': this.object.position.x,
            'y': this.object.position.y,
            'z': this.object.position.z,
        }
    
        if (this.attemptedVelocity.for) {
            this.velocity.z -= this.velocity.walk_force
        }
        if (this.attemptedVelocity.back) {
            this.velocity.z += this.velocity.walk_force
        }
        if (this.attemptedVelocity.left) {
            this.velocity.x -= this.velocity.walk_force
        }
        if (this.attemptedVelocity.right) {
            this.velocity.x += this.velocity.walk_force
        }
    
        if (this.attemptedVelocity.running) {
            this.velocity[`terminal_z`] = 8
        } else {
            this.velocity[`terminal_z`] = 4
        }
    
    
    
    
        //if (this.object.position.y < ocean.position.y) { //the overlay only activates if the player is fully submerged
        //    document.getElementById('overlay').style.backgroundColor = 'rgba(0, 50, 255, 0.5)';
        //} else {
        //    document.getElementById('overlay').style.backgroundColor = 'rgba(0, 0, 0, 0)';
        //}
    
        //if (this.object.position.y < (ocean.position.y + 1)) { //there is a margin here to create the bobbing effect while swimming, and to allow the player to leave the water
        //    gravity = .05
        //    this.velocity.terminal_y = 1;
        //    this.velocity.walk_force = .1;
        //    this.velocity.airResistance = .05;
        //    underwater = true;
        //}
    
        //if (this.object.position.y > (ocean.position.y + .5)) {
        //    gravity = 1
        //    this.velocity.terminal_y = 10;
        //    this.velocity.walk_force = 1;
        //    this.velocity.airResistance = .5;
        //    underwater = false;
        //}
    
        this.object.translateX(this.velocity.x * dt);
        this.object.translateZ(this.velocity.z * dt);
    
        this.object.position.y = oldPos.y;
    
        for (let v of ['x', 'y', 'z']) {
            if (this.velocity[v] > this.velocity[`terminal_${v}`]) {
                this.velocity[v] = this.velocity[`terminal_${v}`]
            }
    
            if (this.velocity[v] < -this.velocity[`terminal_${v}`]) {
                this.velocity[v] = -this.velocity[`terminal_${v}`]
            }
    
            if (!(v === 'y')) {
                if (this.velocity[v] > 0) {
                    this.velocity[v] -= this.velocity.airResistance
                }
    
                if (this.velocity[v] < 0) {
                    this.velocity[v] += this.velocity.airResistance
                }
            }
        }
    
        this.object.position.y += this.velocity.y * dt;
    
    
        for (let c of this.casts) {
            let vector;
    
            if (c.axis === 'x') {
                vector = [c.direction, 0, 0]
            } else if (c.axis === 'y') {
                vector = [0, c.direction, 0]
            } else if (c.axis === 'z') {
                vector = [0, 0, c.direction]
            }
    
            let ray = cast(
                new THREE.Vector3(this.object.position.x + c.offset[0], this.object.position.y + c.offset[1], this.object.position.z + c.offset[2]),
                new THREE.Vector3(vector[0], vector[1], vector[2]), c.length);
    
            if (ray.length > 0) {
                let fp = ray[0].point;
                const normal = ray[0].face.normal;
        
                fp.x -= normal.x * .5;
                fp.y -= normal.y * .5;
                fp.z -= normal.z * .5;

                let fb = getBlock(
                    Math.round(fp.x),
                    Math.round(fp.y),
                    Math.round(fp.z)
                );
                
                if (! (liquids.includes(fb))) {
                    if (c.direction === 1) {
                        if (this.object.position[c.axis] > oldPos[c.axis]) {
                            this.object.position[c.axis] = oldPos[c.axis];
                        }
                    }
        
                    if (c.direction === -1) {
                        if (this.object.position[c.axis] < oldPos[c.axis]) {
                            this.object.position[c.axis] = oldPos[c.axis];
                        }
                    }
        
                    if (c.axis === 'y') {
                        this.velocity.y = 0
                    }
                }
            }
        }
    
        if (this.underwater) {
            if (this.attemptedVelocity.jumping) {
                this.velocity.y += 4
            }
        }
    
        if (this.attemptedVelocity.jumping) {
            if (!this.underwater) {
                if ((this.velocity.y == 0) && getBlock(Math.round(this.object.position.x), Math.round(this.object.position.y - 2), Math.round(this.object.position.z))) {
                    this.velocity.y = 14;
                    //stepSound()
                }
            }
        }
    
        this.velocity.y -= gravity;

        if (this.onupdate) {
            this.onupdate()
        }
    }

    destroy() {
        worldEntities.splice(worldEntities.indexOf(this), 1);
    }
}

let playerPhys = new Entity(camera);




class Creature {
    constructor(type, x, y, z) {
        const loader = new GLTFLoader();
        loader.load( `assets/creatures/${type}.glb`, ( object ) => {
            scene.add( object.scene );
            //object.position.set(new THREE.Vector3(x, y, z))
    
            this.mixer = new THREE.AnimationMixer( object.scene );
            
            object.animations.forEach( ( clip ) => {
                let c = this.mixer.clipAction( clip );
                c.loop = THREE.LoopRepeat;
                c.play();
            } );
    
            let base = object.scene.children[0];
            this.entity = new Entity(base);
            this.entity.velocity.terminal_z = .01
    
            base.position.x = (x)
            base.position.y = (y)
            base.position.z = (z)
            base.scale.x = .5
            base.scale.y = .5
            base.scale.z = .5

            worldEntities.push(this);
    
            //base.rotation.y = randInt()

            stepSound(true, this.entity)
        });
    }

    update() {
        this.entity.attemptedVelocity.for = true;
        //this.entity.attemptedVelocity.jumping = true;
        //base.rotation.y += randInt()

        //object.scene.getObjectByName( "head" ).lookAt(camera.position)
        this.mixer.update(dt);
    }
}

setInterval(function() {
    for (let e of worldEntities) {
        if (e) {
            e.update()
        }
    }
}, 10)

let spawnX = (Math.random() - .5) * 100;
let spawnZ = (Math.random() - .5) * 100;
camera.position.set(spawnX, fractalNoise(spawnX, spawnZ) + 2, spawnZ);

new Creature('cow', camera.position.x, camera.position.y, camera.position.z);


class itemDrop {
    constructor(x, y, z) {
        this.material = new THREE.MeshLambertMaterial({ color: 0xffd487 });
        this.object = new THREE.Mesh(new THREE.BoxGeometry(.25, .25, .25), handMat);
        scene.add(this.object)
        this.object.position.set(x, y, z);

        this.entity = new Entity(this.object, .25);
        this.entity.onupdate = this.update;
    }

    update() {
        this.object.rotation.y += dt;

        let d = calculateDistance(
            [camera.position.x, camera.position.y, camera.position.z],
            [this.object.position.x, this.object.position.y, this.object.position.z]
        );

        if (d < 2) {
            this.entity.destroy();
            this.entity = null;
            //this.entity = null;
            
            scene.remove(this.object);
            delete this;
        }
    }
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
async function stepSound(loop = false, entity) {
    let speed = (Math.abs(entity.velocity.x + entity.velocity.z) * 10) + 500;
    speed = (1000 - speed)
    if (speed > 10) {
        stepTimeout = speed
    } else {
        stepTimeout = 10
    }

    let ground = getBlock(
        Math.round(entity.object.position.x),
        Math.round(entity.object.position.y - 2),
        Math.round(entity.object.position.z)
    )

    if (ground && (!entity.underwater)) {
        let ranges = {
            'grass': {range:6, volume:.5},
            'dirt': {range:3, volume:1},
            'stone': {range:6, volume:.5},
            'wood': {range:3, volume:1},
            'squish': {range:4, volume:1}
        }

        if (!(entity.velocity.z === 0)) {
            for (let i of blockIndex[ground].sound) { //for sound combos
                playSound(`./assets/sfx/step/new/${i}${Math.ceil(Math.random() * ranges[i].range)}.wav`, ranges[i].volume);
            }
        }
    }

    if (loop) {
        setTimeout(() => {
            stepSound(true, entity)
        }, stepTimeout);
    }
}

stepSound(true, playerPhys);

addEventListener("keyup", (e) => {
    for (let i of [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
        if (e.key === ("" + i)) {
            switchHotbarItem(i - 1)
        }
    }
});

const cursortexture = textureLoader.load(`./assets/break.png`);
cursortexture.magFilter = THREE.NearestFilter;
cursortexture.minFilter = THREE.NearestFilter;
cursortexture.repeat.set(1, .1);
//texture.needsUpdate = true;

let cursor = new THREE.Mesh(new THREE.BoxGeometry(1.01, 1.01, 1.01), new THREE.MeshLambertMaterial({ map: cursortexture, transparent:true }));
scene.add(cursor);

//epic loop
var dt;
var breakTicks = 100;
var breakProgress = breakTicks;
var prevCursorPos = {x:0,y:0,z:0};

function animate() {
    dt = clock.getDelta();

    requestAnimationFrame(animate);

    let cursCast = camCast();
    if (cursCast.length > 0) {
        var point = cursCast[0].point;
        const normal = cursCast[0].face.normal;
        const hit = cursCast[0].object;

        point.x -= normal.x * .5;
        point.y -= normal.y * .5;
        point.z -= normal.z * .5;

        cursor.position.set(
            Math.round(point.x),
            Math.round(point.y),
            Math.round(point.z),
        );
    }

    cursortexture.offset.set(0, (Math.round((breakProgress/breakTicks)*10)/10)-.1);

    if (pressedKeys.mouseLeft) {
        breakProgress -= 100*dt;

        if (breakProgress < 0) {
            breakProgress = breakTicks;
            putBlock(Math.round(cursor.position.x), Math.round(cursor.position.y), Math.round(cursor.position.z), null, true);
            //new itemDrop(cursor.position.x, cursor.position.y, cursor.position.z);
            playSound('./assets/sfx/destroy.ogg');
        }
    } else {
        breakProgress = breakTicks
    }

    if (pressedKeys["w"]) {
        playerPhys.attemptedVelocity.for = true
    } else {
        playerPhys.attemptedVelocity.for = false
    }
    if (pressedKeys["s"]) {
        playerPhys.attemptedVelocity.back = true
    } else {
        playerPhys.attemptedVelocity.back = false
    }
    if (pressedKeys["a"]) {
        playerPhys.attemptedVelocity.left = true
    } else {
        playerPhys.attemptedVelocity.left = false
    }
    if (pressedKeys["d"]) {
        playerPhys.attemptedVelocity.right = true
    } else {
        playerPhys.attemptedVelocity.right = false
    }

    if (pressedKeys[" "]) {
        playerPhys.attemptedVelocity.jumping = true
    } else {
        playerPhys.attemptedVelocity.jumping = false
    }

    if (pressedKeys["shift"]) { // i think its a little stupid that minecraft uses double tap W to run instead of the standard shift, so im changing that
        playerPhys.attemptedVelocity.running = true
    } else {
        playerPhys.attemptedVelocity.running = false
    }

    chkAmbience();

    currentChunkX = Math.floor(camera.position.x / defaultChunkSize);
    currentChunkY = Math.floor(camera.position.y / defaultChunkSize);
    currentChunkZ = Math.floor(camera.position.z / defaultChunkSize);

    renderer.render(scene, camera);
}
animate();