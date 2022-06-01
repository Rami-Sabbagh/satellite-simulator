import * as THREE from 'three';

import { sunTexture } from 'textures';

const geometry = new THREE.SphereGeometry(50, 64, 64);
const material = new THREE.MeshBasicMaterial({
	map: sunTexture.colorMap ?? null,
});

export default class Sun extends THREE.Object3D {
	private mesh = new THREE.Mesh(geometry, material);
	private light = new THREE.PointLight(0xffffff, 200_000, 0, 2);

	constructor() {
		super();

		this.add(this.mesh);
		this.add(this.light);
	}
}