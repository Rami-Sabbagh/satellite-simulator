import * as THREE from 'three';
import { StateVectors } from 'physics/kepler-math';

export default class StateVectorsArrow extends THREE.Object3D {
    protected positionArrow = new THREE.ArrowHelper(undefined, undefined, undefined, 0xff0000, .05, .01);
    protected velocityArrow = new THREE.ArrowHelper(undefined, undefined, undefined, 0xffff00, .1, .05);

    constructor() {
        super();

        this.add(this.positionArrow);
        this.add(this.velocityArrow);
    }

    set state({ position, velocity }: StateVectors) {
        this.velocityArrow.setLength(velocity.length());
        this.velocityArrow.setDirection(velocity.normalize());
        this.velocityArrow.position.copy(position);

        this.positionArrow.setLength(position.length());
        this.positionArrow.setDirection(position.normalize());
    }
}