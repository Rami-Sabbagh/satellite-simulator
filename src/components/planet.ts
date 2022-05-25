import * as THREE from 'three';

import SimulatedObject from 'components/simulated-object';
import { Body, BodyType, ExertsForce } from 'physics/body';
import { GRAVITATION_CONSTANT } from 'physics/constants';

const geometry = new THREE.SphereGeometry(.5, 16, 16);

export default class Planet extends SimulatedObject implements ExertsForce {
    private readonly material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
    });

    private readonly mesh = new THREE.Mesh(geometry, this.material);

    constructor() {
        super(BodyType.Static, 1_000_000);
        this.add(this.mesh);
    }

    get color() {
        return this.material.color;
    }

    exertForce(body: Body, force: THREE.Vector3): void {
        // set (temporary) the force to be the distance vector between the 2 objects.
        force.subVectors(this.position, body.position);

        const distanceSq = force.lengthSq();
        force.normalize().multiplyScalar((GRAVITATION_CONSTANT * this.mass * body.mass) / distanceSq);

        // the force is now calculated properly and ready to use.
    }
}