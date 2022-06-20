import * as THREE from "three";

export const enum BodyType {
    /**
     * A body which moves in space and time.
     */
    Dynamic = "dynamic",

    /**
     * A body which is frozen in space and time, but can still apply forces on other objects.
     */
    Static = "static",
}

export enum BodyShape {
    sphere = 0.5,
    cylinder = 0.82,
    cube = 1.05,
    plate = 1.28,
}

/**
 * A body which exists and _may_ move in space and time.
 */
export interface Body {
    readonly physicsType: BodyType;

    /**
     * Important: the implementation should calculate a new velocity when the mass is changed.
     * (And conserve the total energy of the body).
     */
    mass: number;

    position: THREE.Vector3;
    velocity: THREE.Vector3;

    appliedForces: THREE.Vector3;

    faceArea: number;
    shape: BodyShape | number;
}

/**
 * Can apply forces to other bodies.
 */
export interface ExertsForce extends Body {
    /**
     * Apply a force on every body in the simulation.
     *
     * Why a parameter instead of a return value?
     * So that the parameter object can be reused by the engine.
     *
     * @param body ⚠️ **Never apply any changes to the body directly.**
     * @param force Replace with the force to apply.
     */
    exertForce(body: Body, force: THREE.Vector3): void;
}

export interface Rigid extends Body {
    /**
     * The radius of the collision sphere.
     */
    collisionRadius: number;

    /**
     * Callback.
     */
    onCollision(): void;
}


export function canExertForce(object: Object): object is ExertsForce {
    return "exertForce" in object;
}

export function isRigid(object: Object): object is Rigid {
    return "onCollision" in object;
}
