import * as THREE from 'three';

import SimulatedSpace from 'components/simulated-space';
import Planet from 'components/planet';
import Satellite from 'components/satellite';

export default class World extends THREE.Scene {
    protected clock = new THREE.Clock();
    protected simulatedSpace = new SimulatedSpace(1e-6);

    constructor() {
        super();
        this.add(this.simulatedSpace.scene);

        this.simulatedSpace.add(new Planet());
        this.simulatedSpace.add(Satellite.spawn(
            new THREE.Vector3(1.3, 0, 0), //position
            new THREE.Vector3(0, 0, 800), //velocity
        ));
    }

    update() {
        const dt = this.clock.getDelta();
        this.simulatedSpace.run(dt/1000);
    }
}