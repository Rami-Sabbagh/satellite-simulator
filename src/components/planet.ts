import * as THREE from 'three';

import { TexturePack } from 'textures';

import SimulatedObject from 'components/simulated-object';

import { Body, BodyType, ExertsForce } from 'physics/body';
import { GRAVITATION_CONSTANT } from 'physics/constants';


export default class Planet extends SimulatedObject implements ExertsForce {
    public radius = .5;

    private readonly material = new THREE.MeshStandardMaterial();
    private readonly geometry = new THREE.SphereGeometry(this.radius, 64, 64);

    private mesh = new THREE.Mesh(this.geometry, this.material);

    constructor() {
        super(BodyType.Static, 1_000_000);
        this.add(this.mesh);
    }

    get color() {
        return this.material.color;
    }

    get wireframe() {
        return this.material.wireframe;
    }

    set wireframe(value: boolean) {
        this.material.wireframe = value;
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