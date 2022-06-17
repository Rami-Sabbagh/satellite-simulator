import * as THREE from 'three';

import { satelliteModel } from 'models';

import { BodyType, Rigid } from 'physics/body';
import SimulatedObject from 'components/simulated-object';

const geometry = new THREE.SphereGeometry(7e5, 4, 2);
const material = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    wireframe: true,
});

type DestructionListener = (satellite: Satellite) => void;

export default class Satellite extends SimulatedObject implements Rigid {
    protected readonly mesh = new THREE.Mesh(geometry, material);

    collisionRadius = 7e5;

    private readonly destructionListeners: DestructionListener[] = [];

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
        this.destructionListeners.forEach((listener) => listener(this));
    }

    onDestruction(listener: DestructionListener) {
        this.destructionListeners.push(listener);
    }

    static spawn(position: THREE.Vector3, velocity: THREE.Vector3, mass = 10): Satellite {
        const satellite = new Satellite(mass);
        satellite.position.copy(position);
        satellite.velocity.copy(velocity);
        return satellite;
    }
}