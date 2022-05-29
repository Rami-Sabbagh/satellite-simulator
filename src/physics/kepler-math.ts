import { Euler, Vector3 } from 'three';
import { GRAVITATION_CONSTANT } from './constants';

export interface StateVectors {
    velocity: Vector3,
    position: Vector3,
}

export interface OrbitalElements {
    eccentricity: number,
    semiMajorAxis: number,
    inclination: number,
    longitudeOfAscendingNode: number,
    argumentOfPeriapsis: number,
    trueAnomaly: number,
}

export function calculateOrbitalElements({ velocity, position }: StateVectors, mass: number): OrbitalElements {
    const specificAngularMomentum = new Vector3()
        .crossVectors(position, velocity);

    const standardGravitationalParameter = GRAVITATION_CONSTANT * mass;

    const positionUnitVector = new Vector3()
        .copy(position)
        .normalize();

    const eccentricityVector = new Vector3()
        .crossVectors(velocity, specificAngularMomentum)
        .divideScalar(standardGravitationalParameter)
        .sub(positionUnitVector);
    
    const eccentricity = eccentricityVector.length();

    const semiLutusRectum = specificAngularMomentum.lengthSq() / standardGravitationalParameter;
    const semiMajorAxis = semiLutusRectum / (1 - eccentricity * eccentricity);

    const angularMomentum = new Vector3()
        .copy(specificAngularMomentum)
        .divideScalar(mass);
    
    const inclination = Math.acos(angularMomentum.y / angularMomentum.length());

    let longitudeOfAscendingNode = 0;
    {
        const n = new Vector3(specificAngularMomentum.z, specificAngularMomentum.x, 0);
        longitudeOfAscendingNode = Math.acos(n.x / n.length());
        if (n.y < 0) longitudeOfAscendingNode = 2 * Math.PI - longitudeOfAscendingNode;
        if (isNaN(longitudeOfAscendingNode)) longitudeOfAscendingNode = 0;
    }

    const argumentOfPeriapsis = Math.atan2(-eccentricityVector.z, eccentricityVector.x);

    const trueAnomaly = Math.acos(eccentricityVector.dot(position) / (eccentricity * position.length()));

    return {
        eccentricity,
        semiMajorAxis,
        inclination,
        longitudeOfAscendingNode,
        argumentOfPeriapsis,
        trueAnomaly,
    };
}

export function calculateStateVectors({
    eccentricity, semiMajorAxis,
    inclination, longitudeOfAscendingNode,
    argumentOfPeriapsis, trueAnomaly,
}: OrbitalElements, mass: number): StateVectors {

    const length = (semiMajorAxis * (1 - eccentricity * eccentricity)) / (1 + eccentricity * Math.cos(trueAnomaly));

    const standardGravitationalParameter = GRAVITATION_CONSTANT * mass;

    const velocityLength = Math.sqrt(standardGravitationalParameter * (2 / length - 1 / semiMajorAxis));

    const pane = new Euler(inclination, longitudeOfAscendingNode, 0, "XYZ");

    const position = new Vector3(Math.cos(argumentOfPeriapsis), 0, -Math.sin(argumentOfPeriapsis)).multiplyScalar(length);
    const velocity = new Vector3(-Math.sin(argumentOfPeriapsis), 0, -Math.cos(argumentOfPeriapsis)).multiplyScalar(velocityLength);

    position.applyEuler(pane);
    velocity.applyEuler(pane);

    return { position, velocity };
}
