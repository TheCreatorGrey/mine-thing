import * as THREE from 'three';
export const textureLoader = new THREE.TextureLoader();

export const timer = ms => new Promise(res => setTimeout(res, ms));

export function playSound(url, vol = 1) {
    let aud = new Audio(url);
    aud.volume = vol;
    aud.play();
    return aud;
}

export function randInt(max) {
    return Math.floor(Math.random() * max)
}

export function fractalNoise(x, z) {
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

export function calculateDistance(point1, point2) {
    const dx = point1[0] - point2[0];
    const dy = point1[1] - point2[1];
    const dz = point1[2] - point2[2];
    
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

export function sortByDistanceToOrigin(a, b) {
    const distanceA = calculateDistance(a, [0, -1, 0]);
    const distanceB = calculateDistance(b, [0, -1, 0]);

    return distanceA - distanceB;
}

export function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}