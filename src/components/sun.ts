import * as THREE from 'three';
import { Lensflare, LensflareElement } from 'three/examples/jsm/objects/Lensflare';

import { lensflareBaseTexture, lensflareExtraTexture, sunTexture } from 'textures';
import { EARTH_DISTANCE, SUN_RADIUS } from 'physics/constants';

export default class Sun extends THREE.Object3D {
	protected geometry = new THREE.SphereGeometry(this._radius, 64, 64);
	protected readonly material = new THREE.MeshBasicMaterial({
		map: sunTexture.colorMap ?? null,
	});

	protected mesh = new THREE.Mesh(this.geometry, this.material);
	protected light = new THREE.PointLight(0xffffff, 2 * Math.pow(10, 22.8), 0, 2);

	constructor(protected _radius = SUN_RADIUS, distance = EARTH_DISTANCE) {
		super();

		this.add(this.mesh);
		this.add(this.light);

		this.lensflareScaler = 1; // initialize the lensflare.

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
	set lensflareScaler(value: number) {
		this.light.clear();

		const lensflare = new Lensflare();
		lensflare.addElement(new LensflareElement(lensflareBaseTexture, 700 * value, 0, this.light.color));
		lensflare.addElement(new LensflareElement(lensflareExtraTexture, 60 * value, 0.1, this.light.color));
		lensflare.addElement(new LensflareElement(lensflareExtraTexture, 70 * value, 0.2, this.light.color));
		lensflare.addElement(new LensflareElement(lensflareExtraTexture, 120 * value, 0.3, this.light.color));
		
		this.light.add(lensflare);
	}
}