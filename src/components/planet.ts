import * as THREE from 'three';

import SimulatedObject from 'components/simulated-object';
import { Body, BodyType, ExertsForce } from 'physics/body';
import { GRAVITATION_CONSTANT } from 'physics/constants';

export const planetProperties = { color: 0xFFF };

const geometry = new THREE.SphereGeometry(.5, 16, 16);
const material = new THREE.MeshBasicMaterial({
    color: planetProperties.color,
    wireframe: true,
});

const mesh = new THREE.Mesh(geometry, material);

export default class Planet extends SimulatedObject implements ExertsForce {
    constructor() {
        super(BodyType.Static, 1_000_000);
        this.add(mesh);
    }

    exertForce(body: Body, force: THREE.Vector3): void {
        // set (temporary) the force to be the distance vector between the 2 objects.
        force.subVectors(this.position, body.position);

        const distanceSq = force.lengthSq();
        force.normalize().multiplyScalar((GRAVITATION_CONSTANT * this.mass * body.mass) / distanceSq);

        // the force is now calculated properly and ready to use.

        // This should be in a method that gets called every frame
        mesh.material.color = new THREE.Color(planetProperties.color);
    }
}