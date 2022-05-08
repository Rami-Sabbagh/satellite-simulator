import DebugCube from 'components/debug-cube';
import * as THREE from 'three';

export default class World extends THREE.Scene {
    constructor() {
        super();

        this.add(new DebugCube());
    }
}