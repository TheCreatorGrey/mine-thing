import * as THREE from 'three';
import { scene, camera } from './scn.js';
import { blocktex } from './chunker.js';
import { blockIndex } from './blockindex.js';
import { renderer, controls } from './scn.js';

export var paused = true;
const pauseMenu = document.getElementById("pauseMenu");

//hand
export let handMat = new THREE.MeshBasicMaterial({ color: 0xffd487 });
export let hand = new THREE.Mesh(new THREE.BoxGeometry(.25, .25, .5), handMat);
console.log(hand.geometry.attributes.uv)
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

//0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0

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



        let newUvs = [];

        let faceUVs = [
            [0, 1],
            [1, 1],
            [0, 0],
            [1, 0]
        ]

        for (let i = 0; i < 6; i++) {
            for (let f in faceUVs) {
                let u = faceUVs[f][0];
                let v = faceUVs[f][1];

                let verticalUnit = 1/32;
                let horizontalUnit = 1/6;

                u /= 6;
                v /= 32;
                v += 1-verticalUnit;

                v -= verticalUnit*blockIndex[selectedItem].UV

                newUvs.push(...[u, v])
            }
        }


        hand.geometry.setAttribute('uv',
            new THREE.BufferAttribute(
                new Float32Array(newUvs),
                2
            )
        );

        hand.geometry.setAttribute('color',
            new THREE.BufferAttribute(
                new Float32Array(Array(3*4*6).fill(.3)),
                3
            )
        );
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