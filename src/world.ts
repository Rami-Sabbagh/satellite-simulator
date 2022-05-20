import * as THREE from 'three';

import DebugSphere from 'components/debug-sphere';

export default class World extends THREE.Scene {
    protected clock = new THREE.Clock();

    constructor() {
        super();

        this.add(new DebugSphere());
    }

    update() {
        const dt = this.clock.getDelta();
        
    }
}