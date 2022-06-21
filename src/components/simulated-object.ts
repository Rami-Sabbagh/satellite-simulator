import * as THREE from 'three';
import { Body, BodyShape, BodyType } from '../physics/body';

const _quaternion = new THREE.Quaternion();
const _matrix = new THREE.Matrix4();
const _target = new THREE.Vector3();
const _position = new THREE.Vector3();

export default class SimulatedObject extends THREE.Object3D implements Body {
    get physicsType() { return this._physicsType; }
    
    get mass() { return this._mass; }
    set mass(value: number) {
        this.velocity.multiplyScalar(Math.sqrt(this._mass / value));
        this._mass = value;
    }
    
    public velocity = new THREE.Vector3();
    public appliedForces = new THREE.Vector3();

    constructor(
        private readonly _physicsType: BodyType,
        private _mass: number,
        public faceArea: number = 0,
        public shape: BodyShape | number = BodyShape.sphere,
    ) {
        super();
    }

    override lookAt(vector: number | THREE.Vector3, y?: number | undefined, z?: number | undefined): void {
        if (vector instanceof THREE.Vector3) _target.copy(vector);
        else _target.set(vector, y as number, z as number);

        const parent = this.parent;

        this.updateWorldMatrix(true, false);

        _position.setFromMatrixPosition(this.matrixWorld);

        _matrix.lookAt(_target, _position, this.velocity);

        this.quaternion.setFromRotationMatrix(_matrix);

        if (parent) {
            _matrix.extractRotation(parent.matrixWorld);
            _quaternion.setFromRotationMatrix(_matrix);
            this.quaternion.premultiply(_quaternion.invert());
        }
    }
}