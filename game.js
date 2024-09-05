import * as THREE from 'three';
import { blockIndex } from './blockindex.js';
import { Entity, worldEntities } from './entities.js';
import { getBlock, putBlock, chunkLoader, chunkGenerator, generatedChunks, setChunks } from './chunker.js';
import { playSound, fractalNoise, textureLoader, calculateDistance, download } from './utils.js';
import { scene, camera, clock, renderer } from './scn.js';
import { chkAmbience } from './ambience.js';
import { switchHotbor, paused, selectedItem, hotbarSelectedIndex, handMat, inventory, reloadHotBar, setInventory } from './gui.js';
import { Stats } from './stats.js';

const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

let spawnPos = new THREE.Vector3(0, 0, 0);
let ls_save = localStorage.getItem("VXLS_save");
if (ls_save) {
    ls_save = JSON.parse(ls_save)

    setChunks(ls_save.world.chunks);

    setInventory(ls_save.player.inventory);

    spawnPos.set(
        ls_save.player.x,
        ls_save.player.y,
        ls_save.player.z
    )

    camera.rotation.set(
        ls_save.player.rox,
        ls_save.player.roy,
        ls_save.player.roz
    )
} else {
    console.log("no save")

    let spawnX = (Math.random() - .5) * 100;
    let spawnZ = (Math.random() - .5) * 100;
    spawnPos.set(0, fractalNoise(spawnX, spawnZ)+10, 0);
}


window.addEventListener("resize", (event) => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
});

var pressedKeys = {};
window.onkeyup = function (e) { pressedKeys[e.key.toLowerCase()] = false; }
window.onkeydown = function (e) { pressedKeys[e.key.toLowerCase()] = true; }

//texture.needsUpdate = true;



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

document.body.onmousedown = function (e) {
    const intersects = camCast();

    if (intersects.length > 0) {
        var point = intersects[0].point;
        const normal = intersects[0].face.normal;
        const hit = intersects[0].object;

        let chunkx;
        let chunky;
        let chunkz;

        switch (e.which) {
            case 3:
                if (selectedItem > 0) {
                    point.x += normal.x * .5;
                    point.y += normal.y * .5;
                    point.z += normal.z * .5;

                    putBlock(Math.round(point.x), Math.round(point.y), Math.round(point.z), selectedItem, true)
                    playSound('./assets/sfx/place.ogg');

                    break;
                }
        }
    }
}

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

    return raycaster.intersectObjects(scene.children);
}

function blockCast(precision=.01) {
    let direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    direction.x *= precision;
    direction.y *= precision;
    direction.z *= precision;

    let cast = new THREE.Vector3();
    cast.copy(camera.position);
    let limit = 1000;

    let target;
    let iteration = 0;
    while (!target) {
        iteration += 1

        if (iteration > limit) {
            break
        }

        cast.x += direction.x;
        cast.y += direction.y;
        cast.z += direction.z;

        let block = getBlock(cast.x, cast.y, cast.z);
        if (block !== 0) {
            target = block
        }
    }

    if (target) {
        return [
            target,
            Math.round(cast.x),
            Math.round(cast.y),
            Math.round(cast.z)
        ];
    }
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


let player = new THREE.Mesh(new THREE.BoxGeometry(.6, 1.6, .6), handMat);
player.position.copy(spawnPos)
let playerPhys = new Entity(player);

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
        entity.object.position.x,
        entity.object.position.y - 1,
        entity.object.position.z
    )

    if (ground) {
        let ranges = {
            'grass': {range:6, volume:.5},
            'dirt': {range:3, volume:1},
            'stone': {range:6, volume:.5},
            'wood': {range:3, volume:1},
            'squish': {range:4, volume:1}
        }

        if (entity.attemptedVelocity.for || entity.attemptedVelocity.back || entity.attemptedVelocity.left || entity.attemptedVelocity.right) {
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


function load() {
    var input = document.getElementById('fileInput');

    if (input.files.length > 0) {
        var file = input.files[0];
        
        var reader = new FileReader();
  
        reader.onload = function(e) {
          var fileContent = e.target.result;
  
          let w = fileContent;
          localStorage.setItem('VXLS_save', w)
          window.location.reload(false)
        };
  
        reader.readAsText(file);
    }
}

document.getElementById('fileInput').onchange = load;


function save() {
    let w = {
        version:3,

        world:{
            chunks:generatedChunks
        },

        player:{
            x:camera.position.x,
            y:camera.position.y,
            z:camera.position.z,
            rox:camera.rotation.x,
            roy:camera.rotation.y,
            roz:camera.rotation.z,
            inventory:inventory
        }
    }

    download(JSON.stringify(w), "world.vxls")
}

document.getElementById("pm_save").onclick = save
document.getElementById("pm_load").onclick = () => {document.getElementById('fileInput').click()}


addEventListener("keyup", (e) => {
    for (let i of [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
        if (e.key === ("" + i)) {
            switchHotbor(i - 1)
        }
    }

    if (e.key === "r") {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
        var image = renderer.domElement.toDataURL("image/png").replace("image/png", "image/octet-stream");
        window.location.href=image;
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
var lastCursPos;
var hoveredBlock;

function animate() {
    stats.update();
    dt = clock.getDelta();
    requestAnimationFrame(animate);

    if (!paused) {
        for (let e of worldEntities) {
            if (e) {
                e.update(dt)
            }
        }

        camera.position.set(
            player.position.x,
            player.position.y+.8,
            player.position.z
        )

        player.rotation.set(
            camera.rotation.x,
            camera.rotation.y,
            camera.rotation.z
        )
    
        let cursCast = blockCast();
        if (cursCast) {
            cursor.position.set(
                cursCast[1],
                cursCast[2],
                cursCast[3]
            );

            let hoveredBlock = cursCast[0];
            breakTicks = blockIndex[hoveredBlock].strength;
            cursortexture.offset.set(0, (Math.round((breakProgress/breakTicks)*10)/10)-.1);
            
            if (pressedKeys.mouseLeft) {
                breakProgress -= 100*dt;
    
                if (lastCursPos !== `${cursor.position.x}/${cursor.position.y}/${cursor.position.z}`) {
                    breakProgress = breakTicks
                }
        
                if (breakProgress < 0) {
                    breakProgress = breakTicks;
                    putBlock(Math.round(cursor.position.x), Math.round(cursor.position.y), Math.round(cursor.position.z), 0, true);
                    //new itemDrop(cursor.position.x, cursor.position.y, cursor.position.z);
                    playSound('./assets/sfx/destroy.ogg');
        
                    inventory[hotbarSelectedIndex] = hoveredBlock;
                    reloadHotBar()
                }
    
                lastCursPos = `${cursor.position.x}/${cursor.position.y}/${cursor.position.z}` // stupid as hell but at least it works
            } else {
                breakProgress = breakTicks
            }
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
    }

    renderer.render(scene, camera);
}
animate();