import * as THREE from 'three';
import { Body, BodyType } from '../physics/body';

export default class SimulatedObject extends THREE.Object3D implements Body {
    get physicsType() { return this._physicsType; }
    get mass() { return this._mass; }
    set mass(value: number) {
        this.velocity.multiplyScalar(Math.sqrt(this._mass / value));
        this._mass = value;
    }
    
    velocity = new THREE.Vector3();
    appliedForces = new THREE.Vector3();

    constructor(
        private readonly _physicsType: BodyType,
        private _mass: number,
    ) {
        super();
    }
}