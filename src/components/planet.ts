import * as THREE from 'three';

import { TexturePack } from 'textures';

import SimulatedObject from 'components/simulated-object';

import { Body, BodyType, ExertsForce, Rigid } from 'physics/body';
import { EARTH_MASS, EARTH_RADIUS, GRAVITATION_CONSTANT } from 'physics/constants';

const tempVector = new THREE.Vector3();

export default class Planet extends SimulatedObject implements ExertsForce, Rigid {
    private geometry = new THREE.SphereGeometry(this._radius, 64, 64);
    private readonly material = new THREE.MeshStandardMaterial();
    private mesh = new THREE.Mesh(this.geometry, this.material);

    private atmosphereGeometry = new THREE.SphereGeometry(this.radius + this.atmosphereHeight, 64, 64);
    private readonly atmosphereMaterial = new THREE.MeshStandardMaterial({
        transparent: true,
        opacity: 0.1,
        color: 0xACFFF3,
        metalness: 1,
    });
    private readonly atmosphere = new THREE.Mesh(this.atmosphereGeometry, this.atmosphereMaterial);

    private _atmosphereHeight = EARTH_RADIUS * 0.15;
    private _atmosphereDensity = 1.29e-10;

    public period = 24 * 3_600;

    constructor(private _radius = EARTH_RADIUS, mass = EARTH_MASS) {
        super(BodyType.Static, mass);

        this.add(this.mesh);
        this.add(this.atmosphere);

        this.atmosphere.visible = false;
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onCollision(): void { }

    get collisionRadius() { return this._radius }

    get angularVelocity() {
        return (Math.PI * 2) / this.period;
    }

    get radius() {
        return this._radius;
    }

    set radius(value: number) {
        this._radius = value;

        this.geometry.dispose();
        this.geometry = new THREE.SphereGeometry(this._radius, 64, 64);
        this.mesh.geometry = this.geometry;

        this.atmosphereHeight = this._atmosphereHeight; // to trigger the geometry update.
    }

    get atmosphereHeight() {
        return this._atmosphereHeight;
    }

    set atmosphereHeight(value) {
        this._atmosphereHeight = value;

        this.atmosphere.geometry.dispose();
        this.atmosphere.geometry = new THREE.SphereGeometry(this._radius + this._atmosphereHeight, 64, 64);
    }

    get atmosphereDensity() {
        return this._atmosphereDensity;
    }

    set atmosphereDensity(value) {
        this._atmosphereDensity = value;
        this.atmosphereMaterial.opacity = 0.5 - (-Math.log10(value / 1.29e-9) / 2) * 0.4; // idk what's this, but it's something, ~Rami.
    }

    get atmosphereVisible() {
        return this.atmosphere.visible;
    }

    set atmosphereVisible(value) {
        this.atmosphere.visible = value;
    }

    get color() {
        return this.material.color.toArray();
    }

    set color(value: number[]) {
        this.material.color.fromArray(value);
    }

    get wireframe() {
        return this.material.wireframe;
    }

    set wireframe(value: boolean) {
        this.material.wireframe = value;
    }

    get bumpScale() {
        return this.material.bumpScale;
    }

    set bumpScale(value: number) {
        this.material.bumpScale = value;
    }

    set texture(pack: Partial<TexturePack>) {
        this.material.map = pack.colorMap ?? null;
        this.material.bumpMap = pack.bumpMap ?? null;
        this.material.bumpScale = pack.bumpScale ?? 0;
        this.material.aoMap = pack.aoMap ?? null;
        this.material.emissiveMap = pack.emissiveMap ?? null;
        this.material.metalnessMap = pack.metalnessMap ?? null;

        this.material.needsUpdate = true;
    }

    exertForce(body: Body, force: THREE.Vector3): void {
        this.exertGravityForce(body, force);
        this.exertDragForce(body, force);
    }

    protected exertGravityForce(body: Body, force: THREE.Vector3) {
        tempVector.subVectors(this.position, body.position);

        const distanceSq = tempVector.lengthSq();
        tempVector.normalize().multiplyScalar((GRAVITATION_CONSTANT * this.mass * body.mass) / distanceSq);

        force.add(tempVector);
    }

    protected exertDragForce(body: Body, force: THREE.Vector3) {
        const distance = this.position.distanceTo(body.position);
        if (distance > this.radius + this.atmosphereHeight) return;

        const bodyVelocity = body.velocity.length();
        const atmosphereVelocity = this.angularVelocity * distance;
        const relativeVelocity = bodyVelocity - atmosphereVelocity;
        const relativeVelocitySq = relativeVelocity * relativeVelocity;

        const drag = 0.5 * this.atmosphereDensity * relativeVelocitySq * body.shape * body.faceArea;

        tempVector.copy(body.velocity).normalize().multiplyScalar(-drag);
        force.add(tempVector);
    }

    update(dt: number) {
        this.rotateY(dt / this.period * Math.PI * 2);
    }
}