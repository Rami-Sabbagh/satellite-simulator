import * as THREE from 'three';
import { Body, BodyType } from '../physics/body';

export default class SimulatedObject extends THREE.Object3D implements Body {
    get physicsType() { return this._physicsType; }
    get mass() { return this._mass; }
    
    velocity = new THREE.Vector3();
    appliedForces = new THREE.Vector3();

    constructor(
        private readonly _physicsType: BodyType,
        private readonly _mass: number,
    ) {
        super();
    }
}