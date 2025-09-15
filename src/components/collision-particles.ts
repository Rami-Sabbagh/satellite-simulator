import * as THREE from 'three';
// Reference: https://codepen.io/Xanmia/pen/nqyMgJ

export default class CollisionParticles extends THREE.Object3D {
    private geometry = new THREE.BufferGeometry();
    private material = new THREE.PointsMaterial({
        color: 0xffbb11,
        size: 0.2e6,
        transparent: true,
        opacity: 1

    });
    private mesh = new THREE.Points(this.geometry, this.material);

    private particlesMovementSpeed = 0.5e6;
    private particles: Float32Array;
    /**
     * Each particle (x, y, z) has a velocity (vx, vy, vz)
     * so it can spread out.
     */
    private particleVelocities: Float32Array;
    private PARTICLES_COUNT = 100;

    /**
     * The rate at which the particles material fades out per second.
     */
    private fadeOutFactor = 0.001;

    constructor(
        private collisionPosition = new THREE.Vector3(0, 0, 0)
    ) {
        super();
        // Create particles and velocities arrays
        this.particles = new Float32Array(this.PARTICLES_COUNT * 3);
        this.particleVelocities = new Float32Array(this.PARTICLES_COUNT * 3);

        // Set the position attribute in the geometry buffer to take values from the particles array
        this.geometry.setAttribute('position', new THREE.BufferAttribute(this.particles, 3));
        this.initializeParticles();
        this.add(this.mesh);
    }

    private initializeParticles() {
        for (let i = 0; i < this.PARTICLES_COUNT; i++) {
            this.particles[i * 3 + 0] = this.collisionPosition.x;
            this.particles[i * 3 + 1] = this.collisionPosition.y;
            this.particles[i * 3 + 2] = this.collisionPosition.z;

            this.particleVelocities[i * 3 + 0] = Math.random() * this.particlesMovementSpeed - this.particlesMovementSpeed / 2;
            this.particleVelocities[i * 3 + 1] = Math.random() * this.particlesMovementSpeed - this.particlesMovementSpeed / 2;
            this.particleVelocities[i * 3 + 2] = Math.random() * this.particlesMovementSpeed - this.particlesMovementSpeed / 2;
        }
    }

    public update(dt: number) {
        // Don't forget that it's multiplied by 3 here!
        for (let i = 0; i < this.PARTICLES_COUNT * 3; i++) {
            this.particles[i] += this.particleVelocities[i];
        }

        this.material.opacity -= this.fadeOutFactor * dt;
        this.geometry.attributes.position.needsUpdate = true;
    }

    /**
     * Returns whether the collision animation is done.
     */
    public isDone(): boolean {
        return this.material.opacity <= 0;
    }
}
