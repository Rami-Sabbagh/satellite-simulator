import * as THREE from 'three';

// The instances can be shared, because all debug cubes have the same shape, material, etc...

const geometry = new THREE.SphereGeometry(.5, 4, 4);
const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
});

const mesh = new THREE.Mesh(geometry, material);

// And the object 3d will apply all the wished transformations per each instance,
// such as scaling, position, rotation etc...

export default class DebugSphere extends THREE.Object3D {
    constructor() {
        super();

        this.add(mesh);
    }
}