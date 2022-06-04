import GUI from 'lil-gui';


import type Application from 'app';

import SimulationInterface from './simulation-interface';
import CameraInterface from './camera-interface';
import PlanetInterface from './planet-interface';
import SpawnInterface from './spawn-interface';
import SunInterface from './sun-interface';
export default class Interface {
    readonly gui = new GUI({
        title: 'Satellites Simulator VI: Deluxe Edition',
        width: 500,
    });

    protected readonly simulation: SimulationInterface;
    protected readonly sun: SunInterface;
    protected readonly planet: PlanetInterface;
    protected readonly spawn: SpawnInterface;
    protected readonly camera: CameraInterface;

    constructor(protected app: Application) {
        this.simulation = new SimulationInterface(this.gui, app);
        this.sun = new SunInterface(this.gui, app);
        this.planet = new PlanetInterface(this.gui, app);
        this.spawn = new SpawnInterface(this.gui, app);
        this.camera = new CameraInterface(this.gui, app);
    }

    hotReplaceApplication(app: Application) {
        this.simulation.hotReplaceApplication(app);
        this.sun.hotReplaceApplication(app);
        this.camera.hotReplaceApplication(app);
        this.planet.hotReplaceApplication(app);
        this.spawn.hotReplaceApplication(app);
    }

    destroy() {
        this.gui.destroy();
    }
}
