import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
const textureLoader = new THREE.TextureLoader();

const renderer = new THREE.WebGLRenderer({
    antialias: false,
    alpha: true,
});

function distanceTo (p1x, p1y, p2x, p2y){
    return Math.sqrt((Math.pow(p1x-p2x,2))+(Math.pow(p1y-p2y,2)));
};

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new PointerLockControls(camera, renderer.domElement);

renderer.domElement.addEventListener("click", async () => {
    renderer.domElement.requestPointerLock();
});


const tracks = ['Immersed', 'Heavy Heart', 'Healing'];

let trackNum = 0
async function playNextTrack() {
    let aud = playSound(`./assets/music/${tracks[trackNum]}.mp3`);
    trackNum += 1;

    if (trackNum === tracks.length) {
        trackNum = 0
    };

    aud.addEventListener('ended', function() {
        playNextTrack()
    });
}

function startTracks() {
    playNextTrack();
    renderer.domElement.removeEventListener("click", startTracks);
}

renderer.domElement.addEventListener("click", startTracks);


var pressedKeys = {};
window.onkeyup = function(e) { pressedKeys[e.key] = false; }
window.onkeydown = function(e) { pressedKeys[e.key] = true; }


//light thingy
let sun = new THREE.DirectionalLight( 0xffffff );
sun.position.set( 400, 400, 400 );
let soft = new THREE.DirectionalLight( 0x939393 );
soft.position.set( -400, 400, -400 );
let neath = new THREE.DirectionalLight( 0x5f5f5f );
neath.position.set( 0, -400, 0 );
scene.add(sun);
scene.add(soft);
scene.add(neath);



let pendingStructureBlocks = {
}


const TREE = [
    //log
    {x:0, y:0, z:0, type:'log'},
    {x:0, y:1, z:0, type:'log'},
    {x:0, y:2, z:0, type:'log'},
    {x:0, y:3, z:0, type:'log'},
    {x:0, y:4, z:0, type:'log'},
    {x:0, y:5, z:0, type:'log'},

    //upper tuft
    {x:0, y:6, z:0, type:'leaves'},
    {x:0, y:6, z:1, type:'leaves'},
    {x:0, y:6, z:-1, type:'leaves'},
    {x:1, y:6, z:0, type:'leaves'},
    {x:-1, y:6, z:0, type:'leaves'},

    //lower tuft
    {x:0, y:5, z:1, type:'leaves'},
    {x:0, y:5, z:-1, type:'leaves'},
    {x:1, y:5, z:0, type:'leaves'},
    {x:-1, y:5, z:0, type:'leaves'},
    {x:1, y:5, z:1, type:'leaves'},
    {x:-1, y:5, z:-1, type:'leaves'},
    {x:-1, y:5, z:1, type:'leaves'},
    {x:1, y:5, z:-1, type:'leaves'},


    //upper bulk layer
    {x:0, y:4, z:1, type:'leaves'},
    {x:0, y:4, z:-1, type:'leaves'},
    {x:1, y:4, z:0, type:'leaves'},
    {x:-1, y:4, z:0, type:'leaves'},
    {x:1, y:4, z:1, type:'leaves'},
    {x:-1, y:4, z:-1, type:'leaves'},
    {x:-1, y:4, z:1, type:'leaves'},
    {x:1, y:4, z:-1, type:'leaves'},
    {x:2, y:4, z:-2, type:'leaves'},
    {x:-2, y:4, z:2, type:'leaves'},
    {x:2, y:4, z:2, type:'leaves'},
    {x:-2, y:4, z:-2, type:'leaves'},
    {x:1, y:4, z:-2, type:'leaves'},
    {x:0, y:4, z:-2, type:'leaves'},
    {x:-1, y:4, z:-2, type:'leaves'},
    {x:1, y:4, z:2, type:'leaves'},
    {x:0, y:4, z:2, type:'leaves'},
    {x:-1, y:4, z:2, type:'leaves'},
    {x:2, y:4, z:1, type:'leaves'},
    {x:2, y:4, z:0, type:'leaves'},
    {x:2, y:4, z:-1, type:'leaves'},
    {x:-2, y:4, z:1, type:'leaves'},
    {x:-2, y:4, z:0, type:'leaves'},
    {x:-2, y:4, z:-1, type:'leaves'},

    //lower bulk layer
    {x:0, y:3, z:1, type:'leaves'},
    {x:0, y:3, z:-1, type:'leaves'},
    {x:1, y:3, z:0, type:'leaves'},
    {x:-1, y:3, z:0, type:'leaves'},
    {x:1, y:3, z:1, type:'leaves'},
    {x:-1, y:3, z:-1, type:'leaves'},
    {x:-1, y:3, z:1, type:'leaves'},
    {x:1, y:3, z:-1, type:'leaves'},
    {x:2, y:3, z:-2, type:'leaves'},
    {x:-2, y:3, z:2, type:'leaves'},
    {x:2, y:3, z:2, type:'leaves'},
    {x:-2, y:3, z:-2, type:'leaves'},
    {x:1, y:3, z:-2, type:'leaves'},
    {x:0, y:3, z:-2, type:'leaves'},
    {x:-1, y:3, z:-2, type:'leaves'},
    {x:1, y:3, z:2, type:'leaves'},
    {x:0, y:3, z:2, type:'leaves'},
    {x:-1, y:3, z:2, type:'leaves'},
    {x:2, y:3, z:1, type:'leaves'},
    {x:2, y:3, z:0, type:'leaves'},
    {x:2, y:3, z:-1, type:'leaves'},
    {x:-2, y:3, z:1, type:'leaves'},
    {x:-2, y:3, z:0, type:'leaves'},
    {x:-2, y:3, z:-1, type:'leaves'},
]


const texture = textureLoader.load(`./assets/tile.png`);
texture.magFilter = THREE.NearestFilter;
texture.minFilter = THREE.NearestFilter;
//texture.needsUpdate = true;

const blocktex = new THREE.MeshLambertMaterial({ map: texture});


function playSound(url) {
    let aud = new Audio(url);
    aud.play();
    return aud;
}

function randInt(max) {
    return Math.floor(Math.random()*max)
}

let xArray;
let yArray;
let zArray;

var defaultChunkSize = 8;
var generatedChunks = {};
function generateChunk(xLocation, yLocation, zLocation, size=defaultChunkSize, height=8) {
    xArray = [];
    var bCount = 0;
    let empty = true;

    let treePositions = [];

    for (var x = 0; x < size; x++) {
        yArray = [];
        for (var y = 0; y < height; y++) {
            zArray = [];
            for (var z = 0; z < size; z++) {
                let globalX = x+(xLocation*size);
                let globalY = y+(yLocation*size);
                let globalZ = z+(zLocation*size);

                noise.seed

                let amp = 15;
                let noiseval = Math.round(noise.perlin2(globalX/50, globalZ/50)*amp);

                var blockType = null;
                if (globalY === noiseval) {
                    blockType = 'grass'
                    //if (randInt(60) === 0) {
                    //    treePositions.push([x, y, z]);
                    //}

                    if (globalY > 200) {
                        blockType = 'snow'
                    }
                }
                if (globalY < noiseval) {
                    blockType = 'dirt'
                }
                if (globalY < noiseval - 40) {
                    blockType = 'stone';

                    if (randInt(30) === 0) {
                        blockType = 'coal-ore'
                    }
                    if (randInt(100) === 0) {
                        blockType = 'iron-ore'
                    }
                    if (randInt(400) === 0) {
                        blockType = 'gold-ore'
                    }
                    if (randInt(400) === 0) {
                        blockType = 'ruby-ore'
                    }
                    if (randInt(400) === 0) {
                        blockType = 'sapphire-ore'
                    }
                    if (randInt(1000) === 0) {
                        blockType = 'diamond-ore'
                    }
                }

                let struct = pendingStructureBlocks[`${globalX}/${globalY}/${globalZ}`];
                if (struct) {
                    console.log(struct)
                    blockType = struct
                }

                if (globalY === -64) {
                    blockType = 'bedrock'
                }

                if (blockType) {
                    bCount += 1;
                    empty = false
                }

                zArray.push(blockType);
            }
            yArray.push(zArray)
        }
        xArray.push(yArray)
    }

    if (empty) { //for some reason everything turns white when one of the chunks is empty, this is a temporary solution
        console.log(xArray[5][5][5])
        xArray[0][0][0] = 'bedrock'
    }

    //for (let t in treePositions) {
    //    let tr = treePositions[t];
    //    for (let b in TREE) {
    //        let block = TREE[b];
    //        try {
    //            xArray[block.x + tr[0]][block.y + tr[1]][block.z + tr[2]] = block.type
    //        } catch {
    //            pendingStructureBlocks[`${block.x}/${block.y}/${block.z}`] = block.type
    //        }
    //    }
    //}

    generatedChunks[`${xLocation}/${yLocation}/${zLocation}`] = {
        x:xLocation,
        y:yLocation,
        z:zLocation,
        size:size,
        height:height,
        blocks:xArray,
        bCount:bCount
    }

    return generatedChunks[`${xLocation}/${yLocation}/${zLocation}`];
}

const colors = {
    'grass':new THREE.Color("rgb(0, 100, 0)"),
    'dirt':new THREE.Color("rgb(60, 40, 0)"),
    'stone':new THREE.Color("rgb(50, 50, 50)"),
    'bedrock':new THREE.Color("rgb(20, 20, 20)"),
    'leaves':new THREE.Color("rgb(0, 60, 0)"),
    'log':new THREE.Color("rgb(40, 20, 0)"),
    'planks':new THREE.Color("rgb(150, 140, 50)"),
    'snow':new THREE.Color("rgb(200, 200, 200)"),
}

var renderedChunks = {};
function loadChunk(chunk) {
    if (renderedChunks[`${chunk.x}/${chunk.y}/${chunk.z}`]) {
        scene.remove(renderedChunks[`${chunk.x}/${chunk.y}/${chunk.z}`]);
        renderedChunks[`${chunk.x}/${chunk.y}/${chunk.z}`].geometry.dispose();
    }

    const geometry = new THREE.BoxGeometry();
    const chunkGeom = new THREE.InstancedMesh(geometry, blocktex, chunk.bCount);

    let empty = true;

    var totalIter = 0;
    for (var x = 0; x < chunk.size; x++) {
        for (var y = 0; y < chunk.height; y++) {
            for (var z = 0; z < chunk.size; z++) {
                let bType = chunk.blocks[x][y][z];

                let exposed = false;
                if (x === 0 ||
                    z === 0 ||
                    x === (chunk.size-1) ||
                    z === (chunk.size-1) ||
                    y === 0 ||
                    y === (chunk.height-1)
                    ){
                    exposed = true;

                } else if (
                    chunk.blocks[x][y+1][z] === null ||
                    chunk.blocks[x][y-1][z] === null ||
                    chunk.blocks[x+1][y][z] === null ||
                    chunk.blocks[x-1][y][z] === null ||
                    chunk.blocks[x][y][z+1] === null ||
                    chunk.blocks[x][y][z-1] === null
                    ){
                    exposed = true;
                }

                if (bType && exposed) {
                    const matrix = new THREE.Matrix4();
                    matrix.setPosition(x, y, z);
                    chunkGeom.setMatrixAt(totalIter, matrix);
                    empty = false;

                    if (colors[bType]) {
                        chunkGeom.setColorAt(totalIter, colors[bType]);
                    }
                    
                    totalIter += 1;
                }
            }
        }
    }

    scene.add(chunkGeom);
    chunkGeom.position.x = chunk.x*chunk.size;
    chunkGeom.position.y = chunk.y*chunk.size;
    chunkGeom.position.z = chunk.z*chunk.size;

    renderedChunks[`${chunk.x}/${chunk.y}/${chunk.z}`] = chunkGeom;
}

renderer.domElement.onmousedown = function(e) {
    const raycaster = new THREE.Raycaster();
    const direction = new THREE.Vector3();
    
    camera.getWorldDirection(direction);
    raycaster.set(camera.position, direction);
    
    const intersects = raycaster.intersectObjects(scene.children);
    
    if (intersects.length > 0) {
        var point = intersects[0].point;
        const normal = intersects[0].face.normal;
        const hit = intersects[0].object;

        let chunkx;
        let chunky;
        let chunkz;

        console.log(hit.position)

        switch (e.which) {
            case 1:
                point.x -= normal.x*.5;
                point.y -= normal.y*.5;
                point.z -= normal.z*.5;
        
                chunkx = hit.position.x/defaultChunkSize;
                chunky = hit.position.y/defaultChunkSize;
                chunkz = hit.position.z/defaultChunkSize;

                point.x -=  chunkx*defaultChunkSize;
                point.y -=  chunky*defaultChunkSize;
                point.z -=  chunkz*defaultChunkSize;

                generatedChunks[`${chunkx}/${chunky}/${chunkz}`].blocks[Math.round(point.x)][Math.round(point.y)][Math.round(point.z)] = null;
                loadChunk(generatedChunks[`${chunkx}/${chunky}/${chunkz}`])

                playSound('./assets/sfx/block.mp3');

                break;
            case 3:
                point.x += normal.x*.99;
                point.y += normal.y*.99;
                point.z += normal.z*.99;
        
                chunkx = Math.floor(point.x/defaultChunkSize);
                chunky = Math.floor(point.y/defaultChunkSize);
                chunkz = Math.floor(point.z/defaultChunkSize);

                point.x -=  chunkx*defaultChunkSize;
                point.y -=  chunky*defaultChunkSize;
                point.z -=  chunkz*defaultChunkSize;

                generatedChunks[`${chunkx}/${chunky}/${chunkz}`].blocks[Math.round(point.x)][Math.round(point.y)][Math.round(point.z)] = 'planks';
                loadChunk(generatedChunks[`${chunkx}/${chunky}/${chunkz}`])

                playSound('./assets/sfx/block.mp3');

                break;
          }
    }
}

var playerYVelocity = 0;
camera.position.y = 10;

//makes a raycast
function cast(origin, direction, length) {
    const raycaster = new THREE.Raycaster();
    raycaster.far = length;

    raycaster.set(origin, direction);

    return raycaster.intersectObjects(scene.children);
}



let renderDistX = 2;
let renderDistY = 2;

let surrounding = [];

for (var x = -renderDistX; x < renderDistX; x++) {
    for (var y = -renderDistY; y < renderDistY; y++) {
        for (var z = -renderDistX; z < renderDistX; z++) {

            surrounding.push([x, y, z]);
        }
    }
}

let oldCamX;
let oldCamY;
let oldCamZ;
let currentChunkX;
let currentChunkY;
let currentChunkZ;

//epic loop
var dt;
var prevTime = 0;
function animate() {
    const currentTime = performance.now();
    const dt = (currentTime - prevTime) / 1000;

    requestAnimationFrame(animate);

    camera.position.y += playerYVelocity*dt;

    oldCamX = camera.position.x;
    oldCamY = camera.position.y;
    oldCamZ = camera.position.z;

    if (pressedKeys["w"]) {
        camera.translateZ(-5*dt)
    }
    if (pressedKeys["s"]) {
        camera.translateZ(5*dt)
    }
    if (pressedKeys["a"]) {
        camera.translateX(-5*dt)
    }
    if (pressedKeys["d"]) {
        camera.translateX(5*dt)
    }

    camera.position.y = oldCamY;
    

    
    if (cast(camera.position, new THREE.Vector3(0, 0, 1), .4).length > 0) {
        camera.position.z = oldCamZ;
    }
    if (cast(camera.position, new THREE.Vector3(0, 0, -1), .4).length > 0) {
        camera.position.z = oldCamZ;
    }

    if (cast(camera.position, new THREE.Vector3(1, 0, 0), .4).length > 0) {
        camera.position.x = oldCamX;
    }
    if (cast(camera.position, new THREE.Vector3(-1, 0, 0), .4).length > 0) {
        camera.position.x = oldCamX;
    }


    //lower wall raycasts (make sure the player doesnt go through walls)
    if (cast(new THREE.Vector3(camera.position.x, camera.position.y-1, camera.position.z), new THREE.Vector3(0, 0, 1), .4).length > 0) {
        camera.position.z = oldCamZ;
    }
    if (cast(new THREE.Vector3(camera.position.x, camera.position.y-1, camera.position.z), new THREE.Vector3(0, 0, -1), .4).length > 0) {
        camera.position.z = oldCamZ;
    }

    if (cast(new THREE.Vector3(camera.position.x, camera.position.y-1, camera.position.z), new THREE.Vector3(1, 0, 0), .4).length > 0) {
        camera.position.x = oldCamX;
    }
    if (cast(new THREE.Vector3(camera.position.x, camera.position.y-1, camera.position.z), new THREE.Vector3(-1, 0, 0), .4).length > 0) {
        camera.position.x = oldCamX;
    }


    //floor raycast (makes sure the player can't go through the floor)
    if (cast(camera.position, new THREE.Vector3(0, -1, 0), 1.5).length === 0) {
        //var intersectPoint = intersects[0].point;

        if (playerYVelocity > -10) {
            playerYVelocity -= 1;
        }
    } else {
        if (pressedKeys[" "]) {
            if (playerYVelocity === 0) {
                playerYVelocity = 8
            }
        }

        if (playerYVelocity < 0) {
            playerYVelocity = 0;
        }
    }


    //head raycast (makes sure the player can't go through the ceiling)
    if (cast(camera.position, new THREE.Vector3(0, 1, 0), .5).length > 0) {
        if (playerYVelocity > 0) {
            playerYVelocity = 0;
        }
    }



    currentChunkX = Math.round(camera.position.x/defaultChunkSize);
    currentChunkY = Math.round(camera.position.y/defaultChunkSize);
    currentChunkZ = Math.round(camera.position.z/defaultChunkSize);

    for (let ch in surrounding) {
        let chunkCoords = [surrounding[ch][0] + currentChunkX, surrounding[ch][1] + currentChunkY, surrounding[ch][2] + currentChunkZ];

        if (! renderedChunks[`${chunkCoords[0]}/${chunkCoords[1]}/${chunkCoords[2]}`]) {
            if (generatedChunks[`${chunkCoords[0]}/${chunkCoords[1]}/${chunkCoords[2]}`]) {
                loadChunk(generatedChunks[`${chunkCoords[0]}/${chunkCoords[1]}/${chunkCoords[2]}`]);
                
            } else {
                loadChunk(generateChunk(chunkCoords[0], chunkCoords[1], chunkCoords[2]));
            }
        }
    }

    for (let ch in renderedChunks) {
        let chunk = renderedChunks[ch];
    
        if (distanceTo(camera.position.x, camera.position.z, chunk.position.x, chunk.position.z) > defaultChunkSize*renderDistX+1) {
            delete renderedChunks[`${chunk.position.x/defaultChunkSize}/${chunk.position.y/defaultChunkSize}/${chunk.position.z/defaultChunkSize}`];
            scene.remove(chunk);
            chunk.geometry.dispose();
        }

        //if (! surrounding.includes([chunk.position.x, chunk.position.y, chunk.position.z])) {
        //    delete renderedChunks[`${chunk.position.x/defaultChunkSize}/${chunk.position.z/defaultChunkSize}`];
        //    scene.remove(chunk);
        //    chunk.geometry.dispose();
        //}
    }

    prevTime = currentTime;

    renderer.render(scene, camera);
}
animate();