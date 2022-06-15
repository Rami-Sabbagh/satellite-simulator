import * as THREE from 'three';

import { TexturePack } from 'textures';

import SimulatedObject from 'components/simulated-object';

import { Body, BodyType, ExertsForce, Rigid } from 'physics/body';
import { EARTH_MASS, EARTH_RADIUS, GRAVITATION_CONSTANT } from 'physics/constants';

export default class Planet extends SimulatedObject implements ExertsForce, Rigid {
    private geometry = new THREE.SphereGeometry(this._radius, 64, 64);

    private readonly material = new THREE.MeshStandardMaterial();

    private mesh = new THREE.Mesh(this.geometry, this.material);

    private _radiusSq = this._radius * this._radius;

    constructor(private _radius = EARTH_RADIUS, mass = EARTH_MASS) {
        super(BodyType.Static, mass);
        this.add(this.mesh);
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onCollision(): void {}

    get collisionRadiusSq() { return this._radiusSq }
    
    get radius() {
        return this._radius;
    }

    set radius(value: number) {
        this._radius = value;
        this._radiusSq = value * value;
        
        this.geometry.dispose();
        this.geometry = new THREE.SphereGeometry(this._radius, 64, 64);
        this.mesh.geometry = this.geometry;
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
        // set (temporary) the force to be the distance vector between the 2 objects.
        force.subVectors(this.position, body.position);

        const distanceSq = force.lengthSq();
        force.normalize().multiplyScalar((GRAVITATION_CONSTANT * this.mass * body.mass) / distanceSq);

        // the force is now calculated properly and ready to use.
    }

}