import { Euler, Vector3 } from 'three';

export interface StateVectors {
    velocity: Vector3,
    position: Vector3,
}

export default class InitialElements {

    public inclination = 0;
    public trueAnomaly = 0;
    public semiMajorAxis = 0;
    public velocityValue = 0;

    calculateStateVectors(): StateVectors {
        const pane = new Euler(this.inclination, this.trueAnomaly, 0, "YXZ");

        const position = new Vector3(1, 0, 0).multiplyScalar(this.semiMajorAxis);
        const velocity = new Vector3(0, 0, 1).multiplyScalar(this.velocityValue);

        position.applyEuler(pane);
        velocity.applyEuler(pane);

        return { position, velocity };
    }
}