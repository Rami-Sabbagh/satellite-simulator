import * as THREE from 'three';

import { sunTexture } from 'textures';




export default class Sun extends THREE.Object3D {
	protected geometry = new THREE.SphereGeometry(this._radius, 64, 64);
	protected readonly material = new THREE.MeshBasicMaterial({
		map: sunTexture.colorMap ?? null,
	});
	
	protected mesh = new THREE.Mesh(this.geometry, this.material);
	protected light = new THREE.PointLight(0xffffff, 200_000, 0, 2);

	constructor(protected _radius = 50, distance = 200) {
		super();

		this.add(this.mesh);
		this.add(this.light);

		this.position.z = distance;
	}

	get wireframe() {
		return this.material.wireframe;
	}

	set wireframe(value: boolean) {
		this.material.wireframe = value;
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

	get distance() {
		return this.position.z;
	}

	set distance(value: number) {
		this.position.z = value;
	}

	get intensity() {
		return this.light.intensity;
	}

	set intensity(value: number) {
		this.light.intensity = value;
	}

	get color() {
		return this.light.color.toArray();
	}

	set color(value: number[]) {
		this.light.color.fromArray(value);
		this.material.color.fromArray(value);
	}
}