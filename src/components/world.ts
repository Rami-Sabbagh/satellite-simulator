import * as THREE from 'three';

import SimulatedSpace from 'components/simulated-space';
import Planet from 'components/planet';
import { AxesHelper } from 'three';
import Sun from './sun';
export default class World extends THREE.Scene {
    protected clock = new THREE.Clock();
    protected simulatedSpace = new SimulatedSpace(1e-6);

    readonly planet = new Planet();

    constructor() {
        super();

        const ambient = new THREE.AmbientLight(0xffffff, 0.5);
        this.add(ambient);

        const pointLight = new THREE.PointLight(0xffffff, 5000, 100, 2);
        pointLight.position.set(1, 0, 50);
        this.add(pointLight);

        this.add(new AxesHelper(.2));

        const sun = new Sun();
        sun.position.set(1, 0, 200);
        this.add(sun);

        this.simulatedSpace.addTo(this);

        this.simulatedSpace.add(this.planet);
    }

    update() {
        const dt = this.clock.getDelta();
        this.simulatedSpace.run(dt / 1000);
    }
}