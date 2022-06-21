import { remove as _remove } from 'lodash';
import * as THREE from 'three';
import { Body, BodyType, canExertForce, ExertsForce, isRigid, Rigid } from "./body";
import { sphereCollidesWithSphere } from './collision';

const temporaryVector = new THREE.Vector3();

/**
 * A physics simulation using semi-implicit Euler integration.
 * https://en.wikipedia.org/wiki/Semi-implicit_Euler_method
 */
export class Simulation {
    protected bodies: Body[] = [];

    /**
     * Bodies which can exert forces on other bodies.
     */
    protected activeBodies: ExertsForce[] = [];
    
    /**
     * Bodies which can collide into other bodies.
     */
    protected rigidBodies: Rigid[] = [];

    constructor(
        public timeResolution = 1e-2,
    ) {}

    add(body: Body) {
        this.bodies.push(body);

        if (canExertForce(body)) this.activeBodies.push(body);
        if (isRigid(body)) this.rigidBodies.push(body);
    }

    remove(body: Body) {
        const filter = (other: Body) => other === body;

        _remove(this.bodies, filter);
        _remove(this.activeBodies, filter);
        _remove(this.rigidBodies, filter);
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

            this.checkCollisions();
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

    protected checkCollisions() {
        for (const body of this.rigidBodies) {
            for (const otherBody of this.rigidBodies) {
                if (body === otherBody) continue;

                if (sphereCollidesWithSphere(body, otherBody)) {
                    body.onCollision();
                    otherBody.onCollision();
                }
            }
        }
    }
}