import * as THREE from 'three';
import { Rigid } from './body';

const temporaryVector = new THREE.Vector3();

// Read more on https://developer.mozilla.org/en-US/docs/Games/Techniques/3D_collision_detection
export const sphereCollidesWithSphere = (body: Rigid, otherBody: Rigid) => {
    const distance = temporaryVector.subVectors(body.position, otherBody.position).length();
    const didCollisionHappen = distance <= body.collisionRadius + otherBody.collisionRadius;
    return didCollisionHappen;
};
