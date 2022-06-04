import { Vector3 } from 'three';

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

export function cartesianToEuler(cartesian: Vector3, euler: EulerComponents = {longitude: 0, latitude:0, radius: 0}): EulerComponents {
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