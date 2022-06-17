import SimulatedObject from 'components/simulated-object';
import { Vector3, Quaternion, Matrix4 } from 'three';

export interface EulerComponents {
    /**
     * The angle of rotation around the Y-axis. In radians.
     */
    longitude: number,
    /**
     * The angle of rotation around the Z-axis. In radians.
     */
    latitude: number,
    /**
     * (in other words: the length of the vector).
     */
    radius: number,
}

export function cartesianToEuler(cartesian: Vector3, euler: EulerComponents = { longitude: 0, latitude: 0, radius: 0 }): EulerComponents {
    euler.longitude = Math.atan2(cartesian.x, cartesian.z);
    euler.latitude = Math.atan2(cartesian.y, cartesian.x);
    euler.radius = cartesian.length();
    return euler;
}

export function eulerToCartesian(euler: EulerComponents, cartesian = new Vector3()): Vector3 {
    return cartesian.set(
        euler.radius * Math.cos(euler.longitude) * Math.cos(euler.latitude),
        euler.radius * Math.sin(euler.latitude),
        euler.radius * Math.sin(euler.longitude) * Math.cos(euler.latitude),
    );
}

const _quaternion = new Quaternion();
const _matrix = new Matrix4();
const _target = new Vector3();
const _position = new Vector3();

// Modified version of THREE.Object3D.lookAt
export function simulatedObjectLookAt(object: SimulatedObject, x: number, y: number, z: number) {
    _target.set(x, y, z);

    const parent = object.parent;

    object.updateWorldMatrix(true, false);

    _position.setFromMatrixPosition(object.matrixWorld);

    _matrix.lookAt(_target, _position, object.velocity);

    object.quaternion.setFromRotationMatrix(_matrix);

    if (parent) {
        _matrix.extractRotation(parent.matrixWorld);
        _quaternion.setFromRotationMatrix(_matrix);
        object.quaternion.premultiply(_quaternion.invert());
    }
}