import * as THREE from 'three';
import { StateVectors } from 'physics/structures';

const geometry = new THREE.SphereGeometry(7e5, 4, 2);
const material = new THREE.MeshBasicMaterial({
    opacity: .5,
    color: 0xff00ff,
    wireframe: true,
});

const tempVector = new THREE.Vector3();
/**
 * This is the invisible satellite that appears when the user
 * checks the `preview` box. This satellite has helper axes
 * which show the user where the satellite will orbit according
 * to the parameters he chooses from the gui.
 */
export default class GhostSatellite extends THREE.Object3D {
    protected positionArrow = new THREE.ArrowHelper(undefined, undefined, undefined, 0xff0000, .05, .01);
    protected velocityArrow = new THREE.ArrowHelper(undefined, undefined, undefined, 0xffff00, .1, .05);

    protected body = new THREE.Mesh(geometry, material);

    constructor() {
        super();

        this.add(this.positionArrow);
        this.add(this.velocityArrow);
        // this.add(this.body);

        this.visible = false; // invisible by default.
        // this.positionArrow.visible = false;
    }

    set state({ position, velocity }: StateVectors) {
        this.body.position.copy(position);

        this.velocityArrow.setLength(velocity.length() * 2e2);
        this.velocityArrow.setDirection(tempVector.copy(velocity).normalize());
        this.velocityArrow.position.copy(position);

        this.positionArrow.setLength(position.length());
        this.positionArrow.setDirection(tempVector.copy(position).normalize());
    }
}