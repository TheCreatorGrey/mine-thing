import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

export const scene = new THREE.Scene();
//scene.fog = new THREE.Fog(0xbdfffe, ((renderDistX * defaultChunkSize) / 2)-10, (renderDistX * defaultChunkSize) / 2);
export const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);

export const clock = new THREE.Clock();

export const renderer = new THREE.WebGLRenderer({
    antialias: false,
    alpha: true,
});

export const controls = new PointerLockControls(camera, renderer.domElement);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);