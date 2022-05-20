import * as THREE from 'three';

import { Body, BodyType } from 'physics/body';
import SimulatedObject from 'components/simulated-object';
import { calculateOrbitalElements, calculateStateVectors, OrbitalElements } from 'physics/kepler-math';

const geometry = new THREE.SphereGeometry(.1, 4, 2);
const material = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    wireframe: true,
});

const mesh = new THREE.Mesh(geometry, material);

export default class Satellite extends SimulatedObject {
    constructor() {
        super(BodyType.Dynamic, 1);
        this.add(mesh);
    }

    static spawn(position: THREE.Vector3, velocity: THREE.Vector3): Satellite {
        const satellite = new Satellite();
        satellite.position.copy(position);
        satellite.velocity.copy(velocity);

        const orbitalElements = calculateOrbitalElements({
            velocity, position,
        }, 1 + 1_000_000);

        console.info('Calculated Orbital Elements:');
        console.table(orbitalElements);

        const stateVectors = calculateStateVectors(orbitalElements, 1 + 1_000_000);

        console.info('Calculated State Vectors:');
        console.table(stateVectors);

        // satellite.position.copy(stateVectors.position);
        // satellite.velocity.copy(stateVectors.velocity);

        return satellite;
    }
}