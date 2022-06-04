import * as THREE from 'three';

import SimulatedSpace from 'components/simulated-space';
import Planet from 'components/planet';
import Sun from 'components/sun';

import { EARTH_RADIUS } from 'physics/constants';
import GhostSatellite from './ghost-satellite';

export default class World extends THREE.Scene {
    protected clock = new THREE.Clock();
    protected simulatedSpace = new SimulatedSpace(1e-6);

    readonly sun = new Sun();
    readonly planet = new Planet();
    readonly ghost = new GhostSatellite();

    timescale = 1;
    planetPeriod = 24;
    
    get timeResolution() {
        return this.simulatedSpace.timeResolution
    }

    set timeResolution(value) {
        this.simulatedSpace.timeResolution = value;
    } 

    constructor() {
        super();

        this.add(new THREE.AxesHelper(EARTH_RADIUS / 10));
        this.add(new THREE.AmbientLight(0xffffff, 0.5));
        
        this.add(this.sun);
        this.add(this.ghost);

        this.simulatedSpace.addTo(this);

        this.simulatedSpace.add(this.planet);
    }

    update() {
        const dt = this.clock.getDelta();
        this.simulatedSpace.run(dt * this.timescale);

        this.planet.rotateY(dt/this.planetPeriod * Math.PI * 2);
    }
}