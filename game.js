// initializes threejs and allat goofy stuff
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

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

camera.position.z = 5;


//light thingy
sun = new THREE.DirectionalLight( 0xffffff );
sun.position.set( 400, 400, 400 );
soft = new THREE.DirectionalLight( 0x939393 );
soft.position.set( -400, 400, -400 );
neath = new THREE.DirectionalLight( 0x5f5f5f );
neath.position.set( 0, -400, 0 );
scene.add(sun);
scene.add(soft);
scene.add(neath);


const blockIndex = ['dirt', 'grass', 'stone', 'bedrock', 'coal-ore', 'iron-ore', 'gold-ore', 'diamond-ore', 'ruby-ore', 'sapphire-ore', 'planks', 'log', 'brick', 'stone-brick']
const textureLoader = new THREE.TextureLoader();
function loadBlockTexture(name) {
    const texture = textureLoader.load(`https://raw.githubusercontent.com/Spiceinajar/mine-thing/main/assets/textures/${name}.png`);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.needsUpdate = true;

    const material = new THREE.MeshLambertMaterial({ map: texture});

    return material
}


textures = {}
for (var t in blockIndex) {
    let tex = blockIndex[t];

    textures[tex] = loadBlockTexture(tex);
}

//adds a block to the scene
function newBlock(x, y, z, type='dirt') {
    if (type) {
        const geometry = new THREE.BoxGeometry();
        const cube = new THREE.Mesh(geometry, textures[type]);
        scene.add(cube);
    
        cube.position.x = Math.round(x);
        cube.position.y = Math.round(y);
        cube.position.z = Math.round(z);
    }
}

//you know what this does
function randInt(max) {
    return Math.floor(Math.random()*max)
}

//generates a chunk
var generatedChunks = {};
function generateChunk(xLocation, zLocation, size=8, height=20) {
    xArray = [];
    for (var x = 0; x < 8; x++) {
        yArray = [];
        for (var y = 0; y < height; y++) {
            zArray = [];
            for (var z = 0; z < 8; z++) {
                let globalX = x+(xLocation*size);
                let globalZ = z+(zLocation*size);

                let amp = 3;
                let noiseval = Math.round(noise.perlin2(globalX/10, globalZ/10)*amp)+(height-(amp+1));

                var blockType = null;
                if (y === noiseval) {
                    blockType = 'grass'
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

                zArray.push(blockType)
            }
            yArray.push(zArray)
        }
        xArray.push(yArray)
    }

    generatedChunks[`${xLocation}/${zLocation}`] = {
        x:xLocation,
        z:zLocation,
        size:size,
        height:height,
        blocks:xArray
    }

    return generatedChunks[`${xLocation}/${zLocation}`];
}

//takes a chunk and adds it to the scene
async function loadChunk(chunk) {
    for (var x = 0; x < 8; x++) {
        for (var y = 0; y < chunk.height; y++) {
            for (var z = 0; z < 8; z++) {
                let globalX = x+(chunk.x*chunk.size);
                let globalZ = z+(chunk.z*chunk.size);
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

                if (exposed) {
                    newBlock(globalX, y-(chunk.height+1), globalZ, bType)
                }
            }
        }
    }
}


for (var x = 0; x < 2; x++) {
    for (var z = 0; z < 2; z++) {
        loadChunk(generateChunk(x, z, 8, 10))
    }
}

//places or erases (hey that kinda rhymes) blocks when you click your mouse
renderer.domElement.onmousedown = async function(e) {
    const raycaster = new THREE.Raycaster();
    const direction = new THREE.Vector3();
    
    camera.getWorldDirection(direction);
    raycaster.set(camera.position, direction);
    
    const intersects = raycaster.intersectObjects(scene.children);
    
    if (intersects.length > 0) {
        var intersectPoint = intersects[0].point;
        const normal = intersects[0].face.normal;
        const hit = intersects[0].object;

        intersectPoint.x += normal.x*.99;
        intersectPoint.y += normal.y*.99;
        intersectPoint.z += normal.z*.99;

        switch (e.which) {
            case 1:
                scene.remove(hit);
                break;
            case 3:
                newBlock(intersectPoint.x,
                    intersectPoint.y,
                    intersectPoint.z,
                    'stone-brick')
                break;
          }
    }
}

var playerYVelocity = 0;

//makes a raycast, obviously
function cast(origin, direction, length) {
    const raycaster = new THREE.Raycaster();
    raycaster.far = length;

    raycaster.set(origin, direction);

    return raycaster.intersectObjects(scene.children);
}


//epic loop
function animate() {
    requestAnimationFrame(animate);

    camera.position.y += playerYVelocity;

    oldCamX = camera.position.x;
    oldCamY = camera.position.y;
    oldCamZ = camera.position.z;

    if (pressedKeys["w"]) {
        camera.translateZ(-0.1)
    }
    if (pressedKeys["s"]) {
        camera.translateZ(0.1)
    }
    if (pressedKeys["a"]) {
        camera.translateX(-0.1)
    }
    if (pressedKeys["d"]) {
        camera.translateX(0.1)
    }
    if (pressedKeys[" "]) {
        playerYVelocity += .1;
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
    if (cast(camera.position, new THREE.Vector3(0, -1, 0), 2).length === 0) {
        //var intersectPoint = intersects[0].point;

        if (playerYVelocity > -.3) {
            playerYVelocity -= .05;
        }
    } else {
        if (playerYVelocity < 0) {
            playerYVelocity = 0;
        }
    }


    //head raycast (makes sure the player can't go through the ceiling)
    if (cast(camera.position, new THREE.Vector3(0, 1, 0), 1).length > 0) {
        if (playerYVelocity > 0) {
            playerYVelocity = 0;
        }
    }



    renderer.render(scene, camera);
}
animate();

//im not gonna label this entire thing bro im too lazy