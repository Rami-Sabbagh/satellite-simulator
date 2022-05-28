import * as THREE from 'three';

import SimulatedSpace from 'components/simulated-space';
import Planet from 'components/planet';
import { AxesHelper } from 'three';
export default class World extends THREE.Scene {
    protected clock = new THREE.Clock();
    protected simulatedSpace = new SimulatedSpace(1e-6);

    readonly planet = new Planet();

    constructor() {
        super();

        const light = new THREE.PointLight(0xffffff, 1000, 100, 2);
        light.position.set(1, 10, 10);
        this.add(light);

        this.add(new AxesHelper(.2));
        this.simulatedSpace.addToScene(this);
        
        this.simulatedSpace.add(this.planet);
    }

    update() {
        const dt = this.clock.getDelta();
        this.simulatedSpace.run(dt / 1000);
    }
}