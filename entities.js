import * as THREE from 'three';
import { getBlock, renderedChunks, findEntityChunk } from './chunker.js';
import { liquids } from './blockindex.js';
import { paused } from './gui.js';

export var worldEntities = [];
var gravity = 1;

//makes a raycast
function cast(origin, direction, length) {
    const raycaster = new THREE.Raycaster();
    raycaster.far = length;

    raycaster.set(origin, direction);

    return raycaster.intersectObjects(Object.values(renderedChunks));
}

export class Entity {
    constructor(obj, height=1.6) {
        this.object = obj;

        this.casts = [
            // floor corner casts
            {
                direction: -1,
                offset: [-.4, 0, -.4],
                length: height,
                axis: 'y'
            },
        
            {
                direction: -1,
                offset: [.4, 0, .4],
                length: height,
                axis: 'y'
            },
        
            {
                direction: -1,
                offset: [-.4, 0, .4],
                length: height,
                axis: 'y'
            },
        
            {
                direction: -1,
                offset: [.4, 0, -.4],
                length: height,
                axis: 'y'
            },
        
        
            // ceiling corner casts
            {
                direction: 1,
                offset: [-.4, 0, -.4],
                length: .4,
                axis: 'y'
            },
        
            {
                direction: 1,
                offset: [.4, 0, .4],
                length: .4,
                axis: 'y'
            },
        
            {
                direction: 1,
                offset: [-.4, 0, .4],
                length: .4,
                axis: 'y'
            },
        
            {
                direction: 1,
                offset: [.4, 0, -.4],
                length: .4,
                axis: 'y'
            },
        
        
        
        
            // lower corner casts
            {
                direction: -1,
                offset: [0, -1, -.4],
                length: .4,
                axis: 'x'
            },
        
            {
                direction: -1,
                offset: [0, -1, .4],
                length: .4,
                axis: 'x'
            },
        
            {
                direction: 1,
                offset: [0, -1, -.4],
                length: .4,
                axis: 'x'
            },
        
            {
                direction: 1,
                offset: [0, -1, .4],
                length: .4,
                axis: 'x'
            },
        
            {
                direction: -1,
                offset: [-.4, -1, 0],
                length: .4,
                axis: 'z'
            },
        
            {
                direction: -1,
                offset: [.4, -1, 0],
                length: .4,
                axis: 'z'
            },
        
        
            {
                direction: 1,
                offset: [-.4, -1, 0],
                length: .4,
                axis: 'z'
            },
        
            {
                direction: 1,
                offset: [.4, -1, 0],
                length: .4,
                axis: 'z'
            },
        
        
        
        
        
        
        
            //upper corner casts
            {
                direction: -1,
                offset: [0, 0, -.4],
                length: .4,
                axis: 'x'
            },
        
            {
                direction: -1,
                offset: [0, 0, .4],
                length: .4,
                axis: 'x'
            },
        
            {
                direction: 1,
                offset: [0, 0, -.4],
                length: .4,
                axis: 'x'
            },
        
            {
                direction: 1,
                offset: [0, 0, .4],
                length: .4,
                axis: 'x'
            },
        
            {
                direction: -1,
                offset: [-.4, 0, 0],
                length: .4,
                axis: 'z'
            },
        
            {
                direction: -1,
                offset: [.4, 0, 0],
                length: .4,
                axis: 'z'
            },
        
        
            {
                direction: 1,
                offset: [-.4, 0, 0],
                length: .4,
                axis: 'z'
            },
        
            {
                direction: 1,
                offset: [.4, 0, 0],
                length: .4,
                axis: 'z'
            },
        ]

        this.velocity = {
            x: 0,
            y: 0,
            z: 0,
            terminal_x: 5,
            terminal_y: 20,
            terminal_z: 5,
            airResistance: .5,
            walk_force: 1
        }

        this.attemptedVelocity = {
            for:false,
            back:false,
            left:false,
            right:false,
            running:false,
            jumping:false
        }

        this.underwater = false;

        this.id = worldEntities.length;
        worldEntities.push(this);
        this.onupdate = null;
    }

    update(dt) {
        if (findEntityChunk(this.object.position.x, this.object.position.y, this.object.position.z)) {
            let oldPos = {
                x: this.object.position.x,
                y: this.object.position.y,
                z: this.object.position.z,
            }
        
            if (this.attemptedVelocity.for) {
                this.velocity.z -= this.velocity.walk_force
            }
            if (this.attemptedVelocity.back) {
                this.velocity.z += this.velocity.walk_force
            }
            if (this.attemptedVelocity.left) {
                this.velocity.x -= this.velocity.walk_force
            }
            if (this.attemptedVelocity.right) {
                this.velocity.x += this.velocity.walk_force
            }
        
            if (this.attemptedVelocity.running) {
                this.velocity[`terminal_z`] = 8
            } else {
                this.velocity[`terminal_z`] = 4
            }
        
        
        
        
            //if (this.object.position.y < ocean.position.y) { //the overlay only activates if the player is fully submerged
            //    document.getElementById('overlay').style.backgroundColor = 'rgba(0, 50, 255, 0.5)';
            //} else {
            //    document.getElementById('overlay').style.backgroundColor = 'rgba(0, 0, 0, 0)';
            //}
        
            //if (this.object.position.y < (ocean.position.y + 1)) { //there is a margin here to create the bobbing effect while swimming, and to allow the player to leave the water
            //    gravity = .05
            //    this.velocity.terminal_y = 1;
            //    this.velocity.walk_force = .1;
            //    this.velocity.airResistance = .05;
            //    underwater = true;
            //}
        
            //if (this.object.position.y > (ocean.position.y + .5)) {
            //    gravity = 1
            //    this.velocity.terminal_y = 10;
            //    this.velocity.walk_force = 1;
            //    this.velocity.airResistance = .5;
            //    underwater = false;
            //}
        
            this.object.translateX(this.velocity.x * dt);
            this.object.translateZ(this.velocity.z * dt);
            this.object.position.y = oldPos.y;
        
            for (let v of ['x', 'y', 'z']) {
                if (this.velocity[v] > this.velocity[`terminal_${v}`]) {
                    this.velocity[v] = this.velocity[`terminal_${v}`]
                }
        
                if (this.velocity[v] < -this.velocity[`terminal_${v}`]) {
                    this.velocity[v] = -this.velocity[`terminal_${v}`]
                }
        
                if (!(v === 'y')) {
                    if (this.velocity[v] > 0) {
                        this.velocity[v] -= this.velocity.airResistance
                    }
        
                    if (this.velocity[v] < 0) {
                        this.velocity[v] += this.velocity.airResistance
                    }
                }
            }
        
            this.object.position.y += this.velocity.y * dt;
        
        
            for (let c of this.casts) {
                let vector;
        
                if (c.axis === 'x') {
                    vector = [c.direction, 0, 0]
                } else if (c.axis === 'y') {
                    vector = [0, c.direction, 0]
                } else if (c.axis === 'z') {
                    vector = [0, 0, c.direction]
                }
        
                let ray = cast(
                    new THREE.Vector3(this.object.position.x + c.offset[0], this.object.position.y + c.offset[1], this.object.position.z + c.offset[2]),
                    new THREE.Vector3(vector[0], vector[1], vector[2]), c.length);
        
                if (ray.length > 0) {
                    let fp = ray[0].point;
                    const normal = ray[0].face.normal;
            
                    fp.x -= normal.x * .5;
                    fp.y -= normal.y * .5;
                    fp.z -= normal.z * .5;
    
                    let fb = getBlock(
                        Math.round(fp.x),
                        Math.round(fp.y),
                        Math.round(fp.z)
                    );
                    
                    if (! (liquids.includes(fb))) {
                        if (c.direction === 1) {
                            if (this.object.position[c.axis] > oldPos[c.axis]) {
                                this.object.position[c.axis] = oldPos[c.axis];
                            }
                        }
            
                        if (c.direction === -1) {
                            if (this.object.position[c.axis] < oldPos[c.axis]) {
                                this.object.position[c.axis] = oldPos[c.axis];
                            }
                        }
            
                        if (c.axis === 'y') {
                            this.velocity.y = 0
                        }
                    }
                }
            }
        
            if (this.underwater) {
                if (this.attemptedVelocity.jumping) {
                    this.velocity.y += 4
                }
            }
        
            if (this.attemptedVelocity.jumping) {
                if (!this.underwater) {
                    if ((this.velocity.y == 0) && getBlock(Math.round(this.object.position.x), Math.round(this.object.position.y - 2), Math.round(this.object.position.z))) {
                        this.velocity.y = 14;
                        //stepSound()
                    }
                }
            }
        
            this.velocity.y -= gravity;
    
            if (this.onupdate) {
                this.onupdate()
            }
        }
    }

    destroy() {
        worldEntities.splice(worldEntities.indexOf(this), 1);
    }
}