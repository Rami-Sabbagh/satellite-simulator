import * as THREE from 'three';

import SimulatedSpace from 'components/simulated-space';
import Planet from 'components/planet';
import Satellite from 'components/satellite';
import { AxesHelper } from 'three';
import { calculateStateVectors, OrbitalElements } from 'physics/kepler-math';

export default class World extends THREE.Scene {
    protected clock = new THREE.Clock();
    protected simulatedSpace = new SimulatedSpace(1e-6);

    protected orbitalElements: OrbitalElements = {
        trueAnomaly: 0,
        argumentOfPeriapsis: 0,

        eccentricity: 0,
        semiMajorAxis: 1,

        inclination: 0,
        longitudeOfAscendingNode: 0,
    };

    protected satellite: Satellite;

    constructor() {
        super();

        this.add(new AxesHelper(.2));
        this.add(this.simulatedSpace.scene);

        this.simulatedSpace.add(new Planet());

        const {position, velocity} = calculateStateVectors(this.orbitalElements, 1 + 1_000_000);
        this.satellite = Satellite.spawn(position, velocity)
        this.simulatedSpace.add(this.satellite);
    }

    update() {
        const dt = this.clock.getDelta();
        this.simulatedSpace.run(dt/1000);
    }
}