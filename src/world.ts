import * as THREE from 'three';

import DebugCube from 'components/debug-cube';

export default class World extends THREE.Scene {
    protected clock = new THREE.Clock();

    constructor() {
        super();

        this.add(new DebugCube());
    }

    update() {
        const dt = this.clock.getDelta();
        
    }
}