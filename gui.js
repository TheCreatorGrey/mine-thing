import * as THREE from 'three';
import { scene, camera } from './scn.js';
import { blocktex } from './chunker.js';
import { blockIndex } from './blockindex.js';
import { renderer, controls } from './scn.js';

export var paused = true;
const pauseMenu = document.getElementById("pauseMenu");

//hand
export let handMat = new THREE.MeshLambertMaterial({ color: 0xffd487 });
export let hand = new THREE.Mesh(new THREE.BoxGeometry(.25, .25, .5), handMat);
hand.position.set(.6, -.5, -.8);
hand.lookAt(new THREE.Vector3(.5, 0, -2))
camera.add(hand);
//hand.onBeforeRender = function (renderer) {renderer.clearDepth();};
scene.add(camera);


export var inventory = []
for (let i = 0; i < 8; i++) {
    inventory.push(0)
}

export function setInventory(value) {
    inventory = value
}

export function reloadHotBar() {
    for (let i = 0; i < 8; i++) {
        let name = blockIndex[inventory[i]].name;
        if (name === "air") {
            name = "_"
        }
        document.getElementById(`hotbar-${i}`).innerText = name
    }

    switchHotbor(hotbarSelectedIndex)
}

export function switchHotbor(index) {
    console.log(index)
    hotbarSelectedIndex = index;
    let child = hotbar.children[index];
    let itemID = inventory[index];

    for (let i of hotbar.children) {
        i.style.borderColor = 'grey'
    }


    console.log(selectedItem)
    selectedItem = itemID;

    child.style.borderColor = 'white';


    if (selectedItem === 0) {
        hand.material = handMat;
        hand.scale.set(1, 1, 1);
    } else {
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
                g.attributes.uv.array[i] += blockIndex[selectedItem].UV[0];
    
                tog = 'y'
            } else {
                g.attributes.uv.array[i] += blockIndex[selectedItem].UV[1];
    
                tog = 'x'
            }
        }
    
        g.attributes.uv.needsUpdate = true;
    }
}

export var selectedItem = 0;
export var hotbarSelectedIndex = 0;
export const hotbar = document.getElementById('hotbar');

for (let i = 0; i < 8; i++) {
    hotbar.insertAdjacentHTML('beforeend', `
    <span class="hotbar-item" id="hotbar-${i}">
    </span>
    `)
}

reloadHotBar()

document.getElementById("pm_resume").onclick = () => {
    paused = false;
    pauseMenu.hidden = true
    renderer.domElement.requestPointerLock();
}

document.addEventListener('pointerlockchange', () => {
    if (document.pointerLockElement) {
        console.log('Pointer is locked.');
    } else {
        paused = true
        pauseMenu.hidden = false
    }
});  