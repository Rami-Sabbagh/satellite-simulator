import * as THREE from 'three';

import { BodyType } from 'physics/body';
import SimulatedObject from 'components/simulated-object';

const geometry = new THREE.SphereGeometry(7e5, 4, 2);
const material = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    wireframe: true,
});



export default class Satellite extends SimulatedObject {
    protected readonly mesh = new THREE.Mesh(geometry, material);

    constructor() {
        super(BodyType.Dynamic, 10);
        this.add(this.mesh);
    }

    static spawn(position: THREE.Vector3, velocity: THREE.Vector3): Satellite {
        const satellite = new Satellite();
        satellite.position.copy(position);
        satellite.velocity.copy(velocity);
        return satellite;
    }
}