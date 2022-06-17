import GUI, { Controller } from 'lil-gui';
import type Application from 'app';

import { Euler, Vector3 } from 'three';

import { EARTH_RADIUS } from 'physics/constants';
import { StateVectors } from 'physics/structures';
import Satellite from 'components/satellite';

const TO_DEGREE = 180 / Math.PI;
const TO_RADIAN = Math.PI / 180;

const tempEuler = new Euler();

function degreeView(record: Record<string, number>): typeof record {
    const descriptors: PropertyDescriptorMap = {};

    for (const key in record) {
        descriptors[key] = {
            get() { return record[key] * TO_DEGREE; },
            set(value: number) { record[key] = value * TO_RADIAN; }
        };
    }

    return Object.defineProperties({}, descriptors);
}

const UNSELECTED = '(new)';

export default class SatellitesInterface {
    protected folder = this.gui.addFolder('Satellites');

    nextSatelliteId = 1;
    /**
     * |           |                     |
     * |-----------|---------------------|
     * | `id = -1` | new satellite.      |
     * | `id >= 0` | existing satellite. |
     */
    satelliteId = -1;

    preview = this.app.world.ghost.visible;
    name = `Satellite #${this.nextSatelliteId++}`;

    mass = 10;
    velocity = 7000;
    height = EARTH_RADIUS * 1.25;

    angles = {
        longitude: 0,
        latitude: 0,
        inclination: 0,
        theta: Math.PI / 2,
    };

    anglesDegree = degreeView(this.angles);

    state: StateVectors = {
        position: new Vector3(this.height, 0, 0),
        velocity: new Vector3(0, 0, -this.velocity),
    };

    actions = {
        spawn: this.spawn.bind(this),
    };

    get satellite() {
        if (!this.app.world.satellites[this.satelliteId]) this.satelliteId = -1;
        if (this.satelliteId === -1) return UNSELECTED;
        return `${this.satelliteId}: ${this.app.world.satellites[this.satelliteId].name}`;
    }

    set satellite(name: string) {
        if (name === UNSELECTED) {
            this.satelliteId = -1;
            return;
        }

        this.satelliteId = Number.parseInt(name.split(':')[0]);
        if (!this.app.world.satellites[this.satelliteId]) this.satelliteId = -1;
    }

    private readonly satelliteOptions = [UNSELECTED];
    private satelliteController: Controller;

    updateSatellitesList() {
        this.satelliteOptions.length = 1;
        this.satelliteOptions.push(...this.app.world.satellites.map(({name},id) => `${id}: ${name}`));

        this.satelliteController = this.satelliteController.options(this.satelliteOptions);
    }

    constructor(protected readonly gui: GUI, protected app: Application) {
        // this.folder.open(false); // closed by default.

        // Had to use a folder, because then the controller is updated, it's placed at the end of the folder.
        // And so storing it in a folder alone would prevent it from being pushed to the end of the list.
        this.satelliteController = this.folder.addFolder('').add(this, 'satellite', this.satelliteOptions).name('Satellite');
        
        this.folder.add(this, 'preview').name('Preview');
        this.folder.add(this, 'name').name('Name');
        this.folder.add(this, 'mass').name('Mass').min(1).max(1e6);
        
        this.folder.add(this, 'velocity').name('Velocity').min(1e3).max(1e5);
        this.folder.add(this, 'height').name('Height').min(EARTH_RADIUS * 1.25).max(EARTH_RADIUS * 10);
        
        this.folder.add(this.anglesDegree, 'longitude').name('Longitude').min(-180).max(180);
        this.folder.add(this.anglesDegree, 'latitude').name('Latitude').min(-180).max(180);
        this.folder.add(this.anglesDegree, 'inclination').name('Inclination').min(-180).max(180);
        this.folder.add(this.anglesDegree, 'theta').name('Theta').min(-180).max(180);
        
        this.folder.add(this.actions, 'spawn').name('Spawn Satellite');
        
        
        this.folder.onChange(this.apply.bind(this));
        this.apply();
    }

    hotReplaceApplication(app: Application) {
        this.app = app;
        this.apply();
    }

    protected apply() {
        tempEuler.set(
            this.angles.inclination,
            this.angles.longitude,
            this.angles.latitude,
            'YZX'
        );

        this.state.position
            .set(this.height, 0, 0)
            .applyEuler(tempEuler);

        this.state.velocity
            .set(Math.cos(this.angles.theta), 0, Math.sin(this.angles.theta))
            .multiplyScalar(-this.velocity)
            .applyEuler(tempEuler);
        
        this.app.world.ghost.state = this.state;
        this.app.world.ghost.visible = this.preview;
    }

    protected spawn() {
        const {position, velocity} = this.state;

        const satellite = Satellite.spawn(position, velocity, this.mass);
        satellite.name = this.name;

        this.name = `Satellite #${this.nextSatelliteId++}`;
        this.app.world.addSatellite(satellite);

        this.updateSatellitesList();
        this.folder.controllersRecursive().forEach(controller => controller.updateDisplay());
    }
}