import * as THREE from 'three';

import { Simulation } from 'physics/simulation';

import SimulatedObject from 'components/simulated-object';

export default class SimulatedSpace {
    readonly scene = new THREE.Scene();
    protected simulation: Simulation;

    constructor(timeResolution?: number) {
        this.simulation = new Simulation(timeResolution);
    }

    add(body: SimulatedObject) {
        this.scene.add(body);
        this.simulation.add(body);
    }

    /**
     * Run the simulation for a given amount of time.
     * @param delta in seconds.
     */
    run(delta: number) {
        this.simulation.run(delta);
    }
}