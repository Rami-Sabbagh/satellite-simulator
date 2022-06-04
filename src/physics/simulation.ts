import * as THREE from 'three';
import { Body, BodyType, canExertForce, ExertsForce } from "./body";

const temporaryVector = new THREE.Vector3();

/**
 * A physics simulation using semi-implicit Euler integration.
 * https://en.wikipedia.org/wiki/Semi-implicit_Euler_method
 */
export class Simulation {
    protected bodies: Body[] = [];

    /**
     * Which can exert forces on other bodies.
     */
    protected activeBodies: ExertsForce[] = [];

    constructor(
        public timeResolution = 1e-2,
    ) {}

    add(body: Body) {
        this.bodies.push(body);

        if (canExertForce(body))
            this.activeBodies.push(body);
    }
    
    /**
     * Run the simulation for a given amount of time.
     * @param delta in seconds.
     */
    run(delta: number) {
        while (delta > 0) {
            const step = Math.min(delta, this.timeResolution);
            delta -= step;

            // calculate the applied forces for each body
            this.calculateAppliedForces();

            // integrate the acceleration into velocity
            this.integrateBodiesAcceleration(step);

            // integrate the velocity into displacement
            this.integrateBodiesVelocity(step);
        }
    }

    protected calculateAppliedForces() {
        for (const body of this.bodies) {
            body.appliedForces.set(0, 0, 0);

            for (const activeBody of this.activeBodies) {
                /**
                 * (alias for the shared temporary vector).
                 */
                const exertedForce = temporaryVector.set(0, 0, 0);

                activeBody.exertForce(body, exertedForce);
                body.appliedForces.add(exertedForce);
            }
        }
    }

    protected integrateBodiesAcceleration(step: number) {
        for (const body of this.bodies) {
            /**
             * (alias for the shared temporary vector).
             */
            const acceleration = temporaryVector.copy(body.appliedForces).divideScalar(body.mass);

            /**
             * (alias for the shared temporary vector).
             */
            const deltaVelocity = acceleration.multiplyScalar(step);

            body.velocity.add(deltaVelocity);
        }
    }

    protected integrateBodiesVelocity(step: number) {
        for (const body of this.bodies) {
            // skip any static object.
            if (body.physicsType === BodyType.Static) continue;

            /**
             * (alias for the shared temporary vector).
             */
            const displacement = temporaryVector.copy(body.velocity).multiplyScalar(step);

            body.position.add(displacement);
        }
    }
}