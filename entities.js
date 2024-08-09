import * as THREE from 'three';
import { getBlock, renderedChunks, findEntityChunk } from './chunker.js';
import { blockIndex, liquids, nonCollisionBlocks } from './blockindex.js';
import { paused } from './gui.js';

export var worldEntities = [];

let calcmesh = new THREE.Mesh();
export function translate(axis="X", r) {
    calcmesh.position.set(0, 0, 0);
    //calcmesh.rotation.set(r)
    calcmesh[`translate${axis}`](1);
    return {
        x:calcmesh.position.x,
        x:calcmesh.position.y,
        x:calcmesh.position.z
    }
}

//makes a raycast
function cast(origin, direction, length) {
    const raycaster = new THREE.Raycaster();
    raycaster.far = length;

    raycaster.set(origin, direction);

    return raycaster.intersectObjects(Object.values(renderedChunks));
}

export class Entity {
    constructor(obj, objOffset=[0, .6, 0], scale=[.6, 1.8, .6]) {
        this.object = obj;
        this.scale = scale;
        this.objOffset = objOffset;

        this.velocity = {
            x: 0,
            y: 0,
            z: 0,
            airResistance: 10,
            walk_force: 4
        }

        this.attemptedVelocity = {
            for:false,
            back:false,
            left:false,
            right:false,
            running:false,
            jumping:false
        }

        this.id = worldEntities.length;
        worldEntities.push(this);
        this.onupdate = null;
    }

    walk(xAmt, zAmt, force=1) {
        const matrix = new THREE.Matrix4().makeRotationFromEuler(this.object.rotation);
        const localZ = new THREE.Vector3(xAmt, 0, zAmt).applyMatrix4(matrix);
        localZ.multiplyScalar(-force);
        //this.velocity.x = localZ.x;
        //this.velocity.z = localZ.z;

        this.velocity.x += localZ.x
        this.velocity.z += localZ.z
    }

    update(dt) {
        if (findEntityChunk(this.object.position.x, this.object.position.y, this.object.position.z)) {
            let oldPos = {
                x: this.object.position.x,
                y: this.object.position.y,
                z: this.object.position.z,
            }
        
            if (this.attemptedVelocity.for) {
                this.walk(0, 1)
            }
            if (this.attemptedVelocity.back) {
                this.walk(0, -1)
            }
            if (this.attemptedVelocity.left) {
                this.walk(1, 0)
            }
            if (this.attemptedVelocity.right) {
                this.walk(-1, 0)
            }
        
            for (let v of ['x', 'y', 'z']) {
                this.velocity[v] *= 1 - .1

                this.object.position[v] += (this.velocity[v] * dt);
            }

            let checkpoints = [
                [.5, -.5, .5, 'y', -1],
                [-.5, -.5, -.5, 'y', -1],
                [-.5, -.5, .5, 'y', -1],
                [.5, -.5, -.5, 'y', -1],

                [.5, .5, .5, 'y', 1],
                [-.5, .5, -.5, 'y', 1],
                [-.5, .5, .5, 'y', 1],
                [.5, .5, -.5, 'y', 1],

                [.5, -.5, .5, 'x', 1],
                [-.5, -.5, .5, 'x', -1],
                [.5, -.5, -.5, 'x', 1],
                [-.5, -.5, -.5, 'x', -1],

                [.5, .5, .5, 'x', 1],
                [-.5, .5, .5, 'x', -1],
                [.5, .5, -.5, 'x', 1],
                [-.5, .5, -.5, 'x', -1],


                [.5, -.5, .5, 'z', 1],
                [.5, -.5, -.5, 'z', 1],
                [-.5, -.5, .5, 'z', -1],
                [-.5, -.5, -.5, 'z', -1],

                [.5, .5, .5, 'z', 1],
                [.5, .5, -.5, 'z', 1],
                [-.5, .5, .5, 'z', -1],
                [-.5, .5, -.5, 'z', -1]
            ]

            for (let c of checkpoints) {
                let x = (c[0]*this.scale[0])+this.object.position.x;
                let y = (c[1]*this.scale[1])+this.object.position.y;
                let z = (c[2]*this.scale[2])+this.object.position.z;
                let dir = c[3];
                let norm = c[4];

                let difference = {
                    'x':x-Math.round(x),
                    'y':y-Math.round(y),
                    'z':z-Math.round(z)
                }

                let b = getBlock(x, y, z);
                if (!blockIndex[b].nocollide) {
                    this.object.position[dir] = oldPos[dir]
                    this.velocity[dir] = 0
                }
            }
        
            if (this.attemptedVelocity.jumping) {
                if ((this.velocity.y == 0) && getBlock(this.object.position.x, this.object.position.y - 1.6, this.object.position.z)) {
                    this.velocity.y = 20;
                    //stepSound()
                }
            }
            this.velocity.y -= 1
    
            if (this.onupdate) {
                this.onupdate()
            }
        }
    }

    destroy() {
        worldEntities.splice(worldEntities.indexOf(this), 1);
    }
}