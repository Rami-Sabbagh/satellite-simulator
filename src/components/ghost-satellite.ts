import * as THREE from 'three';
import { StateVectors } from 'physics/kepler-math';

const geometry = new THREE.SphereGeometry(7, 4, 2);
const material = new THREE.MeshBasicMaterial({
    opacity: 0.5,
    color: 0x00ffff,
    wireframe: true,
});

const mesh = new THREE.Mesh(geometry, material);

const tempVector = new THREE.Vector3();

export default class GhostSatellite extends THREE.Object3D {
    protected positionArrow = new THREE.ArrowHelper(undefined, undefined, undefined, 0xff0000, .05, .01);
    protected velocityArrow = new THREE.ArrowHelper(undefined, undefined, undefined, 0xffff00, .1, .05);

    constructor() {
        super();

        this.add(this.positionArrow);
        this.add(this.velocityArrow);
        this.add(mesh);

        this.visible = false; // invisible by default.
        // this.positionArrow.visible = false;
    }

    set state({ position, velocity }: StateVectors) {
        this.velocityArrow.setLength(velocity.length());
        this.velocityArrow.setDirection(tempVector.copy(velocity).normalize());
        this.velocityArrow.position.copy(position);

        this.positionArrow.setLength(position.length());
        this.positionArrow.setDirection(tempVector.copy(position).normalize());
    }
}