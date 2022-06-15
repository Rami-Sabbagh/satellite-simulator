import * as THREE from 'three';

import { Simulation } from 'physics/simulation';

import SimulatedObject from 'components/simulated-object';

export default class SimulatedSpace {
    protected readonly scene = new THREE.Scene();
    protected simulation: Simulation;

    constructor(timeResolution?: number) {
        this.simulation = new Simulation(timeResolution);
    }

    get timeResolution() {
        return this.simulation.timeResolution;
    }

    set timeResolution(value) {
        this.simulation.timeResolution = value;
    }

    add(body: SimulatedObject) {
        this.scene.add(body);
        this.simulation.add(body);
    }

    remove(body: SimulatedObject) {
        this.scene.remove(body);
        this.simulation.remove(body);
    }

    /**
     * Run the simulation for a given amount of time.
     * @param delta in seconds.
     */
    run(delta: number) {
        this.simulation.run(delta);
    }

    /**
     * Adds the scene of the simulated space into the given scene.
     */
    addTo(scene: THREE.Scene) {
        scene.add(this.scene);
    }

    /**
     * Removes the scene of the simulated space from the given scene.
     */
    removeFrom(scene: THREE.Scene) {
        scene.remove(this.scene);
    }
}