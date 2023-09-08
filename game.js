const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
const textureLoader = new THREE.TextureLoader();

const renderer = new THREE.WebGLRenderer({
    antialias: false,
    alpha: true,
});

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new PointerLockControls(camera, renderer.domElement);

renderer.domElement.addEventListener("click", async () => {
    renderer.domElement.requestPointerLock();
});


var pressedKeys = {};
window.onkeyup = function(e) { pressedKeys[e.key] = false; }
window.onkeydown = function(e) { pressedKeys[e.key] = true; }


//light thingy
//sun = new THREE.DirectionalLight( 0xffffff );
//sun.position.set( 400, 400, 400 );
//soft = new THREE.DirectionalLight( 0x939393 );
//soft.position.set( -400, 400, -400 );
//neath = new THREE.DirectionalLight( 0x5f5f5f );
//neath.position.set( 0, -400, 0 );
//scene.add(sun);
//scene.add(soft);
//scene.add(neath);


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


//const blockIndex = ['dirt', 'grass', 'stone', 'bedrock', 'coal-ore', 'iron-ore', 'gold-ore', 'diamond-ore', 'ruby-ore', 'sapphire-ore', 'planks', 'log', 'brick', 'stone-brick']
//function loadBlockTexture(name) {
//    const texture = textureLoader.load(`https://raw.githubusercontent.com/Spiceinajar/mine-thing/main/assets/textures/${name}.png`);
//    texture.magFilter = THREE.NearestFilter;
//    texture.minFilter = THREE.NearestFilter;
//    texture.needsUpdate = true;
//
//    const material = new THREE.MeshBasicMaterial({ map: texture});
//    //material.side = THREE.DoubleSide;
//
//    return material
//}
//
//textures = {}
//for (var t in blockIndex) {
//    let tex = blockIndex[t];
//
//    textures[tex] = loadBlockTexture(tex);
//}


const texture = textureLoader.load(`https://media.discordapp.net/attachments/1043652794374160385/1149405236193148988/tile.png`);
texture.magFilter = THREE.NearestFilter;
texture.minFilter = THREE.NearestFilter;
texture.needsUpdate = true;

const blocktex = new THREE.MeshBasicMaterial({ map: texture});


function playSound(url) {
    let aud = new Audio(url);
    aud.play();
}

function randInt(max) {
    return Math.floor(Math.random()*max)
}

defaultChunkSize = 16;
var generatedChunks = {};
function generateChunk(xLocation, zLocation, size=defaultChunkSize, height=32) {
    xArray = [];
    var bCount = 0;

    let treePositions = [];

    for (var x = 0; x < size; x++) {
        yArray = [];
        for (var y = 0; y < height; y++) {
            zArray = [];
            for (var z = 0; z < size; z++) {
                let globalX = x+(xLocation*size);
                let globalZ = z+(zLocation*size);

                let amp = 15;
                let noiseval = Math.round(noise.perlin2(globalX/50, globalZ/50)*amp)+(height/2);

                var blockType = null;
                if (y === noiseval) {
                    blockType = 'grass'
                    if (randInt(60) === 0) {
                        treePositions.push([x, y, z]);
                    }

                }
                if (y < noiseval) {
                    blockType = 'dirt'
                }
                if (y < noiseval - (height/3)) {
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
                if (y === 0) {
                    blockType = 'bedrock'
                }

                if (blockType) {
                    bCount += 1
                }

                zArray.push(blockType)
            }
            yArray.push(zArray)
        }
        xArray.push(yArray)
    }

    for (let t in treePositions) {
        let tr = treePositions[t];
        for (let b in TREE) {
            try {
                let block = TREE[b];
                xArray[block.x + tr[0]][block.y + tr[1]][block.z + tr[2]] = block.type
            } catch {}
        }
    }

    generatedChunks[`${xLocation}/${zLocation}`] = {
        x:xLocation,
        z:zLocation,
        size:size,
        height:height,
        blocks:xArray,
        bCount:bCount
    }

    return generatedChunks[`${xLocation}/${zLocation}`];
}

const colors = {
    'grass':new THREE.Color("rgb(0, 100, 0)"),
    'dirt':new THREE.Color("rgb(60, 40, 0)"),
    'stone':new THREE.Color("rgb(50, 50, 50)"),
    'bedrock':new THREE.Color("rgb(20, 20, 20)"),
    'leaves':new THREE.Color("rgb(0, 60, 0)"),
    'log':new THREE.Color("rgb(40, 20, 0)"),
    'planks':new THREE.Color("rgb(150, 140, 50)"),
}

var renderedChunks = {};
async function loadChunk(chunk) {
    if (renderedChunks[`${chunk.x}/${chunk.z}`]) {
        scene.remove(renderedChunks[`${chunk.x}/${chunk.z}`]);
        renderedChunks[`${chunk.x}/${chunk.z}`].geometry.dispose();
    }

    const geometry = new THREE.BoxGeometry();
    const chunkGeom = new THREE.InstancedMesh(geometry, blocktex, chunk.bCount);

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
    chunkGeom.position.z = chunk.z*chunk.size;

    renderedChunks[`${chunk.x}/${chunk.z}`] = chunkGeom;
}

renderer.domElement.onmousedown = async function(e) {
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
        let chunkz;

        console.log(hit.position)

        console.log(`${chunkx}/${chunkz}`);

        switch (e.which) {
            case 1:
                point.x -= normal.x*.5;
                point.y -= normal.y*.5;
                point.z -= normal.z*.5;
        
                chunkx = hit.position.x/defaultChunkSize;
                chunkz = hit.position.z/defaultChunkSize;

                point.x -=  chunkx*defaultChunkSize;
                point.z -=  chunkz*defaultChunkSize;

                generatedChunks[`${chunkx}/${chunkz}`].blocks[Math.round(point.x)][Math.round(point.y)][Math.round(point.z)] = null;
                loadChunk(generatedChunks[`${chunkx}/${chunkz}`])

                playSound('./assets/break.ogg');

                break;
            case 3:
                point.x += normal.x*.99;
                point.y += normal.y*.99;
                point.z += normal.z*.99;
        
                chunkx = Math.floor(point.x/defaultChunkSize);
                chunkz = Math.floor(point.z/defaultChunkSize);

                point.x -=  chunkx*defaultChunkSize;
                point.z -=  chunkz*defaultChunkSize;

                generatedChunks[`${chunkx}/${chunkz}`].blocks[Math.round(point.x)][Math.round(point.y)][Math.round(point.z)] = 'planks';
                loadChunk(generatedChunks[`${chunkx}/${chunkz}`])

                playSound('./assets/place.ogg');

                break;
          }
    }
}

var playerYVelocity = 0;
camera.position.y = 50;

//makes a raycast
function cast(origin, direction, length) {
    const raycaster = new THREE.Raycaster();
    raycaster.far = length;

    raycaster.set(origin, direction);

    return raycaster.intersectObjects(scene.children);
}


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

    //upper wall raycasts (make sure the player doesnt go through walls)
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
    currentChunkZ = Math.round(camera.position.z/defaultChunkSize);

    surrounding = [[-1, -1], [-1, 0], [0, 0], [0, -1]];
    for (let ch in surrounding) {
        let chunkCoords = [surrounding[ch][0] + currentChunkX, surrounding[ch][1] + currentChunkZ];

        if (! renderedChunks[`${chunkCoords[0]}/${chunkCoords[1]}`]) {
            if (generatedChunks[`${chunkCoords[0]}/${chunkCoords[1]}`]) {
                loadChunk(generatedChunks[`${chunkCoords[0]}/${chunkCoords[1]}`]);
                
            } else {
                loadChunk(generateChunk(chunkCoords[0], chunkCoords[1]));
            }
        }
    }

    for (let ch in renderedChunks) {
        let chunk = renderedChunks[ch];

        if (((chunk.position.x - camera.position.x) > defaultChunkSize/2) || ((chunk.position.z - camera.position.z) > defaultChunkSize/2)) {
            delete renderedChunks[`${chunk.position.x/defaultChunkSize}/${chunk.position.z/defaultChunkSize}`];
            scene.remove(chunk);
            chunk.geometry.dispose();
        }
    }

    prevTime = currentTime;

    renderer.render(scene, camera);
}
animate();