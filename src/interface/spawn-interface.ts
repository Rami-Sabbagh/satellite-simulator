import GUI from 'lil-gui';
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

export default class SpawnInterface {
    protected folder = this.gui.addFolder('Satellite Creation');

    satelliteId = 1;

    preview = this.app.world.ghost.visible;
    mass = 10;

    manualFolder = this.folder.addFolder('• State Vectors');

    manual = {
        velocity: 7000,
        height: EARTH_RADIUS * 1.25,

        longitude: 0,
        latitude: 0,
        inclination: 0,
    };

    manualView = degreeView(this.manual);

    state: StateVectors = {
        position: new Vector3(this.manual.height, 0, 0),
        velocity: new Vector3(0, 0, -this.manual.velocity),
    };
    
    actions = {
        spawn: this.spawn.bind(this),
    };

    constructor(protected readonly gui: GUI, protected app: Application) {
        this.folder.open(false); // closed by default.
        this.manualFolder.open(false); // closed by default.

        this.manualFolder.add(this.manual, 'velocity').name('Velocity').min(2e0).max(2e6);
        this.manualFolder.add(this.manual, 'height').name('Height').min(EARTH_RADIUS * 1.25).max(EARTH_RADIUS * 10);
        
        this.manualFolder.add(this.manualView, 'longitude').name('Longitude').min(-180).max(180);
        this.manualFolder.add(this.manualView, 'latitude').name('Latitude').min(-180).max(180);
        this.manualFolder.add(this.manualView, 'inclination').name('Inclination').min(-180).max(180);
        
        this.manualFolder.onChange(this.applyManual.bind(this));

        this.folder.add(this, 'preview').name('Preview');
        this.folder.add(this, 'mass').name('Mass').min(1).max(1e6);
        this.folder.add(this.actions, 'spawn').name('Spawn Satellite');
        
        this.folder.onChange(this.apply.bind(this));
        this.apply();
    }

    hotReplaceApplication(app: Application) {
        this.app = app;
        this.apply();
    }

    protected apply() {
        this.app.world.ghost.visible = this.preview;
        this.app.world.ghost.state = this.state;
    }

    protected applyManual() {
        tempEuler.set(
            this.manual.inclination,
            this.manual.longitude,
            this.manual.latitude,
            'YZX'
        );

        this.state.position
            .set(this.manual.height, 0, 0)
            .applyEuler(tempEuler);

        this.state.velocity
            .set(0, 0, -this.manual.velocity)
            .applyEuler(tempEuler);
        
        this.app.world.ghost.state = this.state;
    }

    protected spawn() {
        const {position, velocity} = this.state;

        const satellite = Satellite.spawn(position, velocity, this.mass);
        satellite.name = `Satellite #${this.satelliteId++}`;

        this.app.world.addSatellite(satellite);
    }
}