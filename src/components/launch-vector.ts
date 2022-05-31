import * as THREE from 'three';
import {StateVectors} from "../physics/initial-elements-math";

export default class LaunchVector extends THREE.Object3D{

    private mesh = new THREE.ArrowHelper(new THREE.Vector3(1,0,0) , this.position, 1, 0xffff00 ,.1,.05);

    constructor() {
        super();
        this.add(this.mesh);
    }

    set state(stateVectors: StateVectors){
        this.mesh.setLength(stateVectors.velocity.length());
        this.mesh.setDirection(stateVectors.velocity.normalize());
        this.position.set(stateVectors.position.x, stateVectors.position.y, stateVectors.position.z);
    }

}