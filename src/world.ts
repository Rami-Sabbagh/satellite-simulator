import * as THREE from 'three';

import SimulatedSpace from 'components/simulated-space';
import Planet from 'components/planet';
import Satellite from 'components/satellite';
import { AxesHelper } from 'three';
import { calculateStateVectors, OrbitalElements } from 'physics/kepler-math';

export default class World extends THREE.Scene {
    protected clock = new THREE.Clock();
    protected simulatedSpace = new SimulatedSpace(1e-6);

    constructor() {
        super();
        this.add(this.simulatedSpace.scene);

        this.add(new AxesHelper(.2));

        this.simulatedSpace.add(new Planet());

        const orbitalElements: OrbitalElements = {
            trueAnomaly: 0,
            argumentOfPeriapsis: Math.PI * 0,

            eccentricity: 0.2,
            semiMajorAxis: 1,

            inclination: Math.PI * 0,
            longitudeOfAscendingNode: Math.PI * 0,
        };

        console.info('Initial Orbital Elements:');
        console.table(orbitalElements);

        const stateVectors = calculateStateVectors(orbitalElements, 1 + 1_000_000);

        console.info('Initial state vectors:');
        console.table(stateVectors);

        this.simulatedSpace.add(Satellite.spawn(
            stateVectors.position,
            stateVectors.velocity,
            // new THREE.Vector3(1.3, 0, 0), //position
            // new THREE.Vector3(0, 0, -800), //velocity
        ));
    }

    update() {
        const dt = this.clock.getDelta();
        this.simulatedSpace.run(dt/1000);
    }
}