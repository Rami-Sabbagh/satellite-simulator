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

function getDefaultElements(): OrbitalElements {
    return {
        eccentricity: 0,
        semiMajorAxis: 0,
        inclination: 0,
        longitudeOfAscendingNode: 0,
        argumentOfPeriapsis: 0,
        trueAnomaly: 0
    };
}

export function calculateOrbitalElements({ velocity, position }: StateVectors, mass: number, elements = getDefaultElements()): OrbitalElements {
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

    elements.eccentricity = eccentricity;
    elements.semiMajorAxis = semiMajorAxis;
    elements.inclination = inclination;
    elements.longitudeOfAscendingNode = longitudeOfAscendingNode;
    elements.argumentOfPeriapsis = argumentOfPeriapsis;
    elements.trueAnomaly = trueAnomaly;

    return elements;
}

function getDefaultVectors(): StateVectors {
    return {
        position: new Vector3(),
        velocity: new Vector3(),
    };
}

export function calculateStateVectors({
    eccentricity, semiMajorAxis,
    inclination, longitudeOfAscendingNode,
    argumentOfPeriapsis, trueAnomaly,
}: OrbitalElements, mass: number, state = getDefaultVectors()): StateVectors {

    const length = (semiMajorAxis * (1 - eccentricity * eccentricity)) / (1 + eccentricity * Math.cos(trueAnomaly));

    const standardGravitationalParameter = GRAVITATION_CONSTANT * mass;

    const velocityLength = Math.sqrt(standardGravitationalParameter * (2 / length - 1 / semiMajorAxis));

    const pane = new Euler(inclination, longitudeOfAscendingNode, 0, "XYZ");

    state.position.set(Math.cos(argumentOfPeriapsis), 0, -Math.sin(argumentOfPeriapsis)).multiplyScalar(length).applyEuler(pane);
    state.velocity.set(-Math.sin(argumentOfPeriapsis), 0, -Math.cos(argumentOfPeriapsis)).multiplyScalar(velocityLength).applyEuler(pane);

    return state;
}
