import * as THREE from 'three';

import { satelliteModel } from 'models';

import { BodyType, Rigid } from 'physics/body';
import SimulatedObject from 'components/simulated-object';

const geometry = new THREE.SphereGeometry(7e5, 4, 2);
const material = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    wireframe: true,
});

const _q1 = new THREE.Quaternion();
const _m1 = new THREE.Matrix4();
const _target = new THREE.Vector3();
const _position = new THREE.Vector3();

export default class Satellite extends SimulatedObject implements Rigid {
    protected readonly mesh = new THREE.Mesh(geometry, material);

    collisionRadius = 7e5;

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private _onDestruction: ((value: unknown) => void) = () => { };
    public onDestruction = new Promise((resolve) => this._onDestruction = resolve);

    constructor(mass = 10) {
        super(BodyType.Dynamic, mass);
        this.add(this.mesh);

        satelliteModel.then(({ scene }) => {
            const model = scene.clone(true);
            model.scale.multiplyScalar(7e4);

            this.remove(this.mesh);
            this.add(model);
        });
    }

    onCollision(): void {
        this._onDestruction(undefined);
    }

    static spawn(position: THREE.Vector3, velocity: THREE.Vector3, mass = 10): Satellite {
        const satellite = new Satellite(mass);
        satellite.position.copy(position);
        satellite.velocity.copy(velocity);
        return satellite;
    }

    // Modified version of THREE.Object3D.lookAt
    lookat(x: number, y: number, z: number) {
        _target.set(x, y, z);

        const parent = this.parent;

        this.updateWorldMatrix(true, false);

        _position.setFromMatrixPosition(this.matrixWorld);

        _m1.lookAt(_target, _position, this.velocity);

        this.quaternion.setFromRotationMatrix(_m1);

        if (parent) {
            _m1.extractRotation(parent.matrixWorld);
            _q1.setFromRotationMatrix(_m1);
            this.quaternion.premultiply(_q1.invert());
        }
    }
}