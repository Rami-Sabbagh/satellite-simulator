import * as THREE from 'three';

export default class DebugSphere extends THREE.Object3D {
    protected geometry = new THREE.SphereGeometry(this._radius, 16, 16);
    protected material = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        wireframe: true,
    });

    protected mesh = new THREE.Mesh(this.geometry, this.material);

    constructor(
        private _radius = 1
    ) {
        super();

        this.add(this.mesh);
    }

    get radius() {
        return this._radius;
    }

    set radius(value: number) {
        this._radius = value;
        
        this.geometry.dispose();
        this.geometry = new THREE.SphereGeometry(this._radius, 64, 64);
        this.mesh.geometry = this.geometry;
    }
}