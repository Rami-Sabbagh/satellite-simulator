import * as THREE from 'three';

const collisionRadius = 2e6;
const geometry = new THREE.SphereGeometry(collisionRadius, 64, 64);

export default class CollisionSphere extends THREE.Object3D {
    private material = new THREE.PointsMaterial({
        color: 0xff0000,
        size: 0.2,
        opacity: 1,
        transparent: true
    });
    private mesh = new THREE.Points(geometry, this.material);
    
    /**
     * The rate at which the collision sphere scales per second.
     */
    private scaleFactor = 0.003;

    /**
     * The rate at which the collision sphere fades out per second.
     */
    private fadeOutFactor = 0.003;

    constructor(
        private collisionPosition: THREE.Vector3 = new THREE.Vector3(0, 0, 0)
    ) {
        super();
        this.add(this.mesh);

        this.scale.set(0, 0, 0);
        this.position.copy(collisionPosition);
    }

    public update(dt: number) {
        this.scale.x += this.scaleFactor * dt;
        this.scale.y += this.scaleFactor * dt;
        this.scale.z += this.scaleFactor * dt;
        this.material.opacity -= this.fadeOutFactor * dt;
    }

    /**
     * Returns whether the collision animation is done.
     */
    public isDone(): boolean {
        return this.material.opacity <= 0;
    }
}
