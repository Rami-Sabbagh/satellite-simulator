import * as THREE from 'three';

import { satelliteModel } from 'models';

import { BodyType, Rigid } from 'physics/body';
import SimulatedObject from 'components/simulated-object';
import DebugSphere from './debug-sphere';

const geometry = new THREE.SphereGeometry(7e5, 4, 2);
const material = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    wireframe: true,
});

export default class Satellite extends SimulatedObject implements Rigid {
    protected readonly mesh = new THREE.Mesh(geometry, material);
    
    collisionRadius = 7e5;

    protected readonly debugCollision = new DebugSphere(this.collisionRadius);

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private _onDestruction: ((value: unknown) => void) = () => {};
    public onDestruction = new Promise((resolve) => this._onDestruction = resolve);

    constructor(mass = 10) {
        super(BodyType.Dynamic, mass);
        this.add(this.debugCollision);
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
}