import * as THREE from 'three';

import SimulatedSpace from 'components/simulated-space';
import Planet from 'components/planet';
import Sun from 'components/sun';

import { EARTH_RADIUS } from 'physics/constants';
import GhostSatellite from 'components/ghost-satellite';
import Satellite from 'components/satellite';
import _ from 'lodash';
import { skyBoxTexture } from 'textures';

export type SatelliteDestructionListener = (satellite: Satellite) => void;

export default class World extends THREE.Scene {
    protected clock = new THREE.Clock();
    protected simulatedSpace = new SimulatedSpace(1e-2);

    readonly sun = new Sun();
    readonly planet = new Planet();
    readonly ghost = new GhostSatellite();

    readonly satellites: Satellite[] = [];

    timescale = 1;
    planetPeriod = 24;

    get timeResolution() {
        return this.simulatedSpace.timeResolution
    }

    set timeResolution(value) {
        this.simulatedSpace.timeResolution = value;
    }

    onSatelliteDestruction: SatelliteDestructionListener | undefined;

    constructor() {
        super();

        this.add(new THREE.AxesHelper(EARTH_RADIUS / 10));
        this.add(new THREE.AmbientLight(0xffffff, 0.5));

        this.add(this.sun);
        this.add(this.ghost);

        this.simulatedSpace.addTo(this);

        this.simulatedSpace.add(this.planet);

        this.background = skyBoxTexture;
    }

    update() {
        const dt = this.clock.getDelta() % (1 / 30);
        this.simulatedSpace.run(dt * this.timescale);

        this.planet.rotateY(dt / this.planetPeriod * Math.PI * 2);

        this.satellites.forEach((satellite) => {
            satellite.lookat(this.planet.position.x, this.planet.position.y, this.planet.position.z);
        })
    }

    addSatellite(satellite: Satellite) {
        this.satellites.push(satellite);
        this.simulatedSpace.add(satellite);

        satellite.onDestruction.then(() => {
            this.removeSatellite(satellite);
            if (this.onSatelliteDestruction) this.onSatelliteDestruction(satellite);
        });
    }

    removeSatellite(satellite: Satellite) {
        console.info('adios satellite');
        _.remove(this.satellites, (obj) => obj === satellite);
        this.simulatedSpace.remove(satellite);
    }
}