import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';


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

function changeSkyColor(r, g, b) {
    document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    scene.fog.color = new THREE.Color(`rgb(${r}, ${g}, ${b})`);
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

function distanceTo (p1x, p1y, p2x, p2y){
    return Math.sqrt((Math.pow(p1x-p2x,2))+(Math.pow(p1y-p2y,2)));
};

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new PointerLockControls(camera, renderer.domElement);

document.addEventListener("click", async () => {
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

//renderer.domElement.addEventListener("click", startTracks);


var pressedKeys = {};
window.onkeyup = function(e) { pressedKeys[e.key.toLowerCase()] = false; }
window.onkeydown = function(e) { pressedKeys[e.key.toLowerCase()] = true; }


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

const blockIndex = {
    'dirt':{UV:[0, .9], transparent:false, sound:'gravel'},
    'grass':{UV:[.1, .9], transparent:false, sound:'grass'},
    'stone':{UV:[.2, .9], transparent:false, sound:'stone'},
    'bedrock':{UV:[.3, .9], transparent:false, sound:'stone', unbreakable:true},
    'log':{UV:[.4, .9], transparent:false, sound:'wood'},
    'leaves':{UV:[.5, .9], transparent:true, sound:'cloth'},
    'coal ore':{UV:[.6, .9], transparent:false, sound:'stone'},
    'iron ore':{UV:[.7, .9], transparent:false, sound:'stone'},
    'diamond ore':{UV:[.8, .9], transparent:false, sound:'stone'},
    'gold ore':{UV:[.9, .9], transparent:false, sound:'stone'},
    'ruby ore':{UV:[0, .8], transparent:false, sound:'stone'},
    'sapphire ore':{UV:[.1, .8], transparent:false, sound:'stone'},
    'glass':{UV:[.2, .8], transparent:true, sound:'glass'},
    'snow':{UV:[.3, .8], transparent:false, sound:'snow'},
    'planks':{UV:[.4, .8], transparent:false, sound:'wood'},
    'sand':{UV:[.5, .8], transparent:false, sound:'sand'},
    'water':{UV:[.6, .8], transparent:true, sound:'stone', unbreakable:true},
    'cobble':{UV:[.7, .8], transparent:false, sound:'stone'},
}

const transparentBlocks = [null, 'leaves', 'glass', 'water'];


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


const texture = textureLoader.load(`./assets/atlas.png`);
texture.magFilter = THREE.NearestFilter;
texture.minFilter = THREE.NearestFilter;
//texture.needsUpdate = true;

const blocktex = new THREE.MeshLambertMaterial({ map: texture }); //, transparent: true 


function playSound(url, vol=1) {
    let aud = new Audio(url);
    aud.volume = vol;
    aud.play();
    return aud;
}

function randInt(max) {
    return Math.floor(Math.random()*max)
}

function fractalNoise(x, z) {
    let octaves = [3, 6, 12, 24];

    let nv1 = noise.perlin2(x/(octaves[0]*33), z/(octaves[0]*33))*(octaves[0]*8)
    let nv2 = noise.perlin2(x/(octaves[1]*33), z/(octaves[1]*33))*(octaves[1]*8)
    let nv3 = noise.perlin2(x/(octaves[2]*33), z/(octaves[2]*33))*(octaves[2]*8)
    let nv4 = noise.perlin2(x/(octaves[3]*33), z/(octaves[3]*33))*(octaves[3]*8)

    let noiseval = nv1;
    noiseval += 0.5 * nv2;
    noiseval += 0.25 * nv3;
    noiseval += 0.125 * nv4;
    noiseval = Math.round(noiseval)+50

    return noiseval;
}

let xArray;
let yArray;
let zArray;

var defaultChunkSize = 16;
var generatedChunks = {};
async function generateChunk(xLocation, yLocation, zLocation, size=defaultChunkSize) {
    xArray = [];
    var bCount = 0;

    let treePositions = [];

    for (var x = 0; x < size; x++) {
        yArray = [];
        for (var y = 0; y < defaultChunkSize; y++) {
            zArray = [];
            for (var z = 0; z < size; z++) {
                let globalX = x+(xLocation*size);
                let globalY = y+(yLocation*size);
                let globalZ = z+(zLocation*size);

                let noiseval = fractalNoise(globalX, globalZ);

                var blockType = null;
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

                    if (noise.perlin3(globalX/10, globalY/10, globalZ/10) > 0) {
                        blockType = null;
                    }
                }

                if (globalY === -128) {
                    blockType = 'bedrock'
                }

                if (globalY === -127) {
                    if ((Math.random()*2)>1) {
                        blockType = 'bedrock'
                    }
                }

                if (globalY < -128) {
                    blockType = null
                }

                //if ((blockType === null) && (globalY < 5)) {
                //    blockType = 'water'
                //}

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
        x:xLocation,
        y:yLocation,
        z:zLocation,
        size:size,
        blocks:xArray,
        bCount:bCount
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
async function loadChunk(chunk, timeout=true) {
    const matrix = new THREE.Matrix4();

    const pxGeometry = new THREE.PlaneGeometry( 1, 1 );
    pxGeometry.rotateY( Math.PI / 2 );
    pxGeometry.translate( .5, 0, 0 );

    const nxGeometry = new THREE.PlaneGeometry( 1, 1 );
    nxGeometry.rotateY( - Math.PI / 2 );
    nxGeometry.translate( - .5, 0, 0 );

    const pyGeometry = new THREE.PlaneGeometry( 1, 1 );

    pyGeometry.rotateX( - Math.PI / 2 );
    pyGeometry.translate( 0, .5, 0 );

    const nyGeometry = new THREE.PlaneGeometry( 1, 1 );
    nyGeometry.rotateX(Math.PI / 2 );
    nyGeometry.translate( 0, - .5, 0 );

    const pzGeometry = new THREE.PlaneGeometry( 1, 1 );
    pzGeometry.translate( 0, 0, .5 );

    const nzGeometry = new THREE.PlaneGeometry( 1, 1 );
    nzGeometry.rotateY( Math.PI );
    nzGeometry.translate( 0, 0, - .5 );

    const geometries = [];

    var totalIter = 0;
    for (var x = 0; x < chunk.size; x++) {
        if (timeout) {
            await timer(.05);
        }
        
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
                    posX:false,
                    negX:false,
                    posY:false,
                    negY:false,
                    posZ:false,
                    negZ:false,
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

                if (x === chunk.size-1) {
                    exposed.posX = true
                }
                if (y === chunk.size-1) {
                    exposed.posY = true
                }
                if (z === chunk.size-1) {
                    exposed.posZ = true
                }

                if (! exposed.posX) {
                    if (transparentBlocks.includes(chunk.blocks[x+1][y][z]) && ! (chunk.blocks[x+1][y][z] === bType)) {
                        exposed.posX = true
                    }
                }
                if (! exposed.negX) {
                    if (transparentBlocks.includes(chunk.blocks[x-1][y][z]) && ! (chunk.blocks[x-1][y][z] === bType)) {
                        exposed.negX = true
                    }
                }

                if (! exposed.posY) {
                    if (transparentBlocks.includes(chunk.blocks[x][y+1][z]) && ! (chunk.blocks[x][y+1][z] === bType)) {
                        exposed.posY = true
                    }
                }
                if (! exposed.negY) {
                    if (transparentBlocks.includes(chunk.blocks[x][y-1][z]) && ! (chunk.blocks[x][y-1][z] === bType)) {
                        exposed.negY = true
                    }
                }

                if (! exposed.posZ) {
                    if (transparentBlocks.includes(chunk.blocks[x][y][z+1]) && ! (chunk.blocks[x][y][z+1] === bType)) {
                        exposed.posZ = true
                    }
                }
                if (! exposed.negZ) {
                    if (transparentBlocks.includes(chunk.blocks[x][y][z-1]) && ! (chunk.blocks[x][y][z-1] === bType)) {
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
                        geometries.push( pyGeometry.clone().applyMatrix4( matrix ) );
                    }
                    if (exposed.negY) {
                        geometries.push( nyGeometry.clone().applyMatrix4( matrix ) );
                    }

                    if (exposed.posX) {
                        geometries.push( pxGeometry.clone().applyMatrix4( matrix ) );
                    }
                    if (exposed.negX) {
                        geometries.push( nxGeometry.clone().applyMatrix4( matrix ) );
                    }

                    if (exposed.posZ) {
                        geometries.push( pzGeometry.clone().applyMatrix4( matrix ) );
                    }
                    if (exposed.negZ) {
                        geometries.push( nzGeometry.clone().applyMatrix4( matrix ) );
                    }
                    
                    totalIter += 1;
                }
            }
        }
    }

    let geometry;

    if (geometries.length > 0) { //the geometry merger throws errors when there is no geometry to merge, so i add this invisible geometry filler
        geometry = BufferGeometryUtils.mergeGeometries( geometries );
        geometry.computeBoundingSphere();
    } else {
        geometry = new THREE.BoxGeometry(0, 0)
    }

    let oldChunk = renderedChunks[`${chunk.x}/${chunk.y}/${chunk.z}`];

    const mesh = new THREE.Mesh( geometry, blocktex );
    scene.add( mesh );

    mesh.position.x = chunk.x*chunk.size;
    mesh.position.y = chunk.y*chunk.size;
    mesh.position.z = chunk.z*chunk.size;

    renderedChunks[`${chunk.x}/${chunk.y}/${chunk.z}`] = mesh;

    //destroy previous chunk
    if (oldChunk) {
        scene.remove(oldChunk);
        oldChunk.geometry.dispose();
    }
}

let pendingBlocks = {};
function putBlock(x, y, z, type, reload=false) {
    let chunkPos = {
        x:Math.floor(x/defaultChunkSize),
        y:Math.floor(y/defaultChunkSize),
        z:Math.floor(z/defaultChunkSize)
    }

    let blockPos = {
        x:((x % defaultChunkSize) + defaultChunkSize) % defaultChunkSize,
        y:((y % defaultChunkSize) + defaultChunkSize) % defaultChunkSize,
        z:((z % defaultChunkSize) + defaultChunkSize) % defaultChunkSize
    }

    if (generatedChunks[`${chunkPos.x}/${chunkPos.y}/${chunkPos.z}`]) {
        generatedChunks[`${chunkPos.x}/${chunkPos.y}/${chunkPos.z}`].blocks[blockPos.x][blockPos.y][blockPos.z] = type;

        if (reload) {
            loadChunk(generatedChunks[`${chunkPos.x}/${chunkPos.y}/${chunkPos.z}`], false)
        }
    } else {
        if (! pendingBlocks[`${chunkPos.x}/${chunkPos.y}/${chunkPos.z}`]) {
            pendingBlocks[`${chunkPos.x}/${chunkPos.y}/${chunkPos.z}`] = []
        }

        pendingBlocks[`${chunkPos.x}/${chunkPos.y}/${chunkPos.z}`].push([x, y, z, type])
    }
}

function getBlock(x, y, z) {
    let chunkPos = {
        x:Math.floor(x/defaultChunkSize),
        y:Math.floor(y/defaultChunkSize),
        z:Math.floor(z/defaultChunkSize)
    }

    let blockPos = {
        x:((x % defaultChunkSize) + defaultChunkSize) % defaultChunkSize,
        y:((y % defaultChunkSize) + defaultChunkSize) % defaultChunkSize,
        z:((z % defaultChunkSize) + defaultChunkSize) % defaultChunkSize
    }

    if (generatedChunks[`${chunkPos.x}/${chunkPos.y}/${chunkPos.z}`]) {
        return generatedChunks[`${chunkPos.x}/${chunkPos.y}/${chunkPos.z}`].blocks[blockPos.x][blockPos.y][blockPos.z]
    } else {
        return null;
    }
}


//hand
let handMat = new THREE.MeshLambertMaterial({ color: 0xffd487 } );
let hand = new THREE.Mesh(new THREE.BoxGeometry(.25, .25, .5), handMat);
hand.position.set( .6, -.5, -.8);
hand.lookAt(new THREE.Vector3(.5, 0, -2))
camera.add(hand);
//hand.onBeforeRender = function (renderer) {renderer.clearDepth();};
scene.add(camera);


var waterTexture = textureLoader.load( './assets/water.png', function ( texture ) {

    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.offset.set( 0, 0 );
    texture.repeat.set( 1000, 1000 );
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;

} );

let ocean = new THREE.Mesh(
    new THREE.PlaneGeometry(1000, 1000), 
    new THREE.MeshPhongMaterial({ map: waterTexture, side: THREE.DoubleSide, transparent:true, opacity:.8} )
);

ocean.position.set(0, 4.4, 0);
ocean.lookAt(new THREE.Vector3(0, 100, 0));

scene.add(ocean)




renderer.domElement.onmousedown = function(e) {
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
                point.x -= normal.x*.5;
                point.y -= normal.y*.5;
                point.z -= normal.z*.5;
        
                putBlock(Math.round(point.x), Math.round(point.y), Math.round(point.z), null, true)
                playSound('./assets/sfx/destroy.ogg');

                break;
            case 3:
                if (selectedBlock) {
                    point.x += normal.x*.5;
                    point.y += normal.y*.5;
                    point.z += normal.z*.5;
            
                    putBlock(Math.round(point.x), Math.round(point.y), Math.round(point.z), selectedBlock, true)
                    playSound('./assets/sfx/place.ogg');
    
                    break;
                }
          }
    }
}

let spawnX = (Math.random() - .5)*100;
let spawnZ = (Math.random() - .5)*100;
camera.position.set(spawnX, fractalNoise(spawnX, spawnZ)+2, spawnZ);

var playerVelocity = {
    x:0,
    y:0,
    z:0,
    terminal_x:5,
    terminal_y:10,
    terminal_z:5,
    airResistance:.5,
    walk_force:1
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

        if (! renderedChunks[`${chunkCoords[0]}/${chunkCoords[1]}/${chunkCoords[2]}`]) {
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

        let chX = Math.round((chunk.position.x-camera.position.x)/defaultChunkSize);
        let chY = Math.round((chunk.position.y-camera.position.y)/defaultChunkSize);
        let chZ = Math.round((chunk.position.z-camera.position.z)/defaultChunkSize);

        let deload = false;

        if (chX > (renderDistX+1)) {
            deload = true
        }
        if (chX < -(renderDistX+1)) {
            deload = true
        }

        if (chZ > (renderDistX+1)) {
            deload = true
        }
        if (chZ < -(renderDistX+1)) {
            deload = true
        }

        if (chY > (renderDistY+1)) {
            deload = true
        }
        if (chY < -(renderDistY+1)) {
            deload = true
        }


        if (deload) {
            delete renderedChunks[`${chunk.position.x/defaultChunkSize}/${chunk.position.y/defaultChunkSize}/${chunk.position.z/defaultChunkSize}`];
            scene.remove(chunk);
            chunk.geometry.dispose();
        }
    }

    setTimeout(() => {
        chunkLoader()
    }, 100);
}



let renderDistX = 2;
let renderDistY = 2;

scene.fog = new THREE.Fog(0xbdfffe, (renderDistX*defaultChunkSize)/2, renderDistX*defaultChunkSize);

let surrounding = [];

for (var x = -renderDistX; x < renderDistX; x++) {
    for (var y = -renderDistY; y < renderDistY; y++) {
        for (var z = -renderDistX; z < renderDistX; z++) {

            surrounding.push([x, y, z]);
            await loadChunk(await generateChunk(x + (Math.round(camera.position.x/defaultChunkSize)), y + (Math.round(camera.position.y/defaultChunkSize)), z + (Math.round(camera.position.z/defaultChunkSize))), false); //preload chunks
        }
    }
}

let oldCamX;
let oldCamY;
let oldCamZ;
let currentChunkX;
let currentChunkY;
let currentChunkZ;

chunkLoader();

async function stepSound() { //wh- what are you doing step-sound?? (im sorry (not really))
    let ground = getBlock(
        Math.round(camera.position.x), 
        Math.round(camera.position.y-2), 
        Math.round(camera.position.z)
    )
    
    if (ground && (! underwater)) {
        let ranges = {
            'cloth':4,
            'glass':4,
            'grass':6,
            'gravel':4,
            'sand':5,
            'snow':4,
            'stone':6,
            'wood':6
        }
    
        if (! (playerVelocity.z === 0)) {
            playSound(`./assets/sfx/step/${blockIndex[ground].sound}${Math.ceil(Math.random()*ranges[blockIndex[ground].sound])}.ogg`, .2);
        }
    }
}

setInterval(stepSound, 500)

addEventListener("keyup", (e) => {
    for (let i of [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
        if (e.key === ("" + i)) {
            switchHotbarItem(i - 1)
        }
    }
});

var gravity = 1;
var underwater = false;

//epic loop
var dt;
function animate() {
    dt = clock.getDelta();

    requestAnimationFrame(animate);

    camera.position.y += playerVelocity.y*dt;

    oldCamX = camera.position.x;
    oldCamY = camera.position.y;
    oldCamZ = camera.position.z;

    let oldCamPos = {
        x:camera.position.x,
        y:camera.position.y,
        z:camera.position.z,
    }

    ocean.position.x = Math.round(camera.position.x);
    ocean.position.z = Math.round(camera.position.z);

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




    if (camera.position.y < ocean.position.y) { //the overlay only activates if the player is fully submerged
        document.getElementById('overlay').style.backgroundColor = 'rgba(0, 50, 255, 0.5)';
    } else {
        document.getElementById('overlay').style.backgroundColor = 'rgba(0, 0, 0, 0)';
    }

    if (camera.position.y < (ocean.position.y + 1)) { //there is a margin here to create the bobbing effect while swimming, and to allow the player to leave the water
        gravity = .05
        playerVelocity.terminal_y = 1;
        playerVelocity.walk_force = .1;
        playerVelocity.airResistance = .05;
        underwater = true;
    }

    if (camera.position.y > (ocean.position.y + .5)) {
        gravity = 1
        playerVelocity.terminal_y = 10;
        playerVelocity.walk_force = 1;
        playerVelocity.airResistance = .5;
        underwater = false;
    }

    //if (camera.position.y < 50) {
    //    changeSkyColor(0, 0, 0);
    //} else {
    //    changeSkyColor(189, 255, 254);
    //}

    camera.translateX(playerVelocity.x*dt);
    camera.translateZ(playerVelocity.z*dt);

    camera.position.y = oldCamY;

    for (let v of ['x', 'y', 'z']) {
        if (playerVelocity[v] > playerVelocity[`terminal_${v}`]) {
            playerVelocity[v] = playerVelocity[`terminal_${v}`]
        }

        if (playerVelocity[v] < -playerVelocity[`terminal_${v}`]) {
            playerVelocity[v] = -playerVelocity[`terminal_${v}`]
        }

        if (! (v === 'y')) {
            if (playerVelocity[v] > 0) {
                playerVelocity[v] -= playerVelocity.airResistance
            }
    
            if (playerVelocity[v] < 0) {
                playerVelocity[v] += playerVelocity.airResistance
            }
        }
    }

    let casts = [
        {
            direction:1, 
            offset:[0, -1, 0],
            length:.4,
            axis: 'z'
        },

        {
            direction:-1, 
            offset:[0, -1, 0],
            length:.4,
            axis: 'z'
        },
        
        {
            direction:1, 
            offset:[0, -1, 0],
            length:.4,
            axis: 'x'
        },
        
        {
            direction:-1, 
            offset:[0, -1, 0],
            length:.4,
            axis: 'x'
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
            new THREE.Vector3(camera.position.x+c.offset[0], camera.position.y+c.offset[1], camera.position.z+c.offset[2]), 
            new THREE.Vector3(vector[0], vector[1], vector[2]), c.length);

        if (ray.length > 0) {
            if (c.direction === 1) { // I couldnt find a better way to do this so i made this monstrous thing
                if (camera.position[c.axis] > oldCamPos[x.axis]) {
                    camera.position[c.axis] = oldCamPos[x.axis];
                }
            }

            if (c.direction === -1) {
                if (camera.position[c.axis] < oldCamPos[x.axis]) {
                    camera.position[c.axis] = oldCamPos[x.axis];
                }
            }
        }
    }



    //floor raycast (makes sure the player can't go through the floor)
    let floorCast = cast(camera.position, new THREE.Vector3(0, -1, 0), 1.5);

    if (underwater) {
        if (pressedKeys[" "]) {
            playerVelocity.y += 1
        }
    }

    if (floorCast.length === 0) {
        //var intersectPoint = intersects[0].point;

        if (playerVelocity.y > -10) {
            playerVelocity.y -= gravity;
        }
    } else {
        if (pressedKeys[" "]) {
            if (! underwater) {
                if (playerVelocity.y === 0) {
                    playerVelocity.y = 14;
                    stepSound()
                }
            }
        }

        if (playerVelocity.y < 0) {
            playerVelocity.y = 0;
        }
    }


    //head raycast (makes sure the player can't go through the ceiling)
    if (cast(camera.position, new THREE.Vector3(0, 1, 0), .5).length > 0) {
        if (playerVelocity.y > 0) {
            playerVelocity.y = 0;
        }
    }



    currentChunkX = Math.round(camera.position.x/defaultChunkSize);
    currentChunkY = Math.round(camera.position.y/defaultChunkSize);
    currentChunkZ = Math.round(camera.position.z/defaultChunkSize);

    renderer.render(scene, camera);
}
animate();