import * as THREE from 'three';
import { getBlock, renderedChunks, findEntityChunk } from './chunker.js';
import { blockIndex } from './blockindex.js';
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
            airResistance: 5,
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

            
            let checks = [
                [0, -1, 0],
                [0, 1, 0],
                [0, 0, 1],
                [0, 0, -1],
                [1, 0, 0],
                [-1, 0, 0]
            ]

            for (let c of checks) {
                let block_pos = [
                    Math.round(this.object.position.x+(c[0]*(this.scale[0]/2))),
                    Math.round(this.object.position.y+(c[1]*(this.scale[1]/2))),
                    Math.round(this.object.position.z+(c[2]*(this.scale[2]/2)))
                ]
    
                let block = getBlock(
                    block_pos[0], 
                    block_pos[1], 
                    block_pos[2]
                );
                if (!blockIndex[block].nocollide) {
                    let block_min = [
                        block_pos[0] - .5,
                        block_pos[1] - .5,
                        block_pos[2] - .5
                    ]
                
                    let block_max = [
                        block_pos[0] + .5,
                        block_pos[1] + .5,
                        block_pos[2] + .5
                    ]
    
    
                    let plyr_min = [
                        this.object.position.x - (this.scale[0]/2),
                        this.object.position.y - (this.scale[1]/2),
                        this.object.position.z - (this.scale[2]/2)
                    ]
                
                    let plyr_max = [
                        this.object.position.x + (this.scale[0]/2),
                        this.object.position.y + (this.scale[1]/2),
                        this.object.position.z + (this.scale[2]/2)
                    ]
    
    
                    let overlap = [
                        Math.min(plyr_max[0], block_max[0]) - Math.max(plyr_min[0], block_min[0]),
                        Math.min(plyr_max[1], block_max[1]) - Math.max(plyr_min[1], block_min[1]),
                        Math.min(plyr_max[2], block_max[2]) - Math.max(plyr_min[2], block_min[2])
                    ]
                    let smallest = Math.min(...overlap)
                    let index = overlap.indexOf(smallest)
    
    
                    if (plyr_min[index] > block_min[index]) {
                        if (smallest > 0) {
                            if (index === 0) {
                                this.object.position.x += smallest
                                this.velocity.x = 0
                            }
                            if (index === 1) {
                                this.object.position.y += smallest
                                this.velocity.y = 0
                            }
                            if (index === 2) {
                                this.object.position.z += smallest
                                this.velocity.z = 0
                            }
                        }
                    }

                    if (plyr_min[index] < block_min[index]) {
                        if (smallest > 0) {
                            if (index === 0) {
                                this.object.position.x -= smallest
                                this.velocity.x = 0
                            }
                            if (index === 1) {
                                this.object.position.y -= smallest
                                this.velocity.y = 0
                            }
                            if (index === 2) {
                                this.object.position.z -= smallest
                                this.velocity.z = 0
                            }
                        }
                    }
    
                }
            }



        
            if (this.attemptedVelocity.jumping) {
                if ((this.velocity.y == 0) && getBlock(this.object.position.x, this.object.position.y - 1.6, this.object.position.z)) {
                    this.velocity.y = 20;
                    //stepSound()
                }
            }
            this.velocity.y -= 2
    
            if (this.onupdate) {
                this.onupdate()
            }
        }
    }

    destroy() {
        worldEntities.splice(worldEntities.indexOf(this), 1);
    }
}