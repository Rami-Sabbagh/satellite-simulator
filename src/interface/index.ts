import GUI from 'lil-gui';


import type Application from 'app';

import CameraInterface from './camera-interface';
import PlanetInterface from './planet-interface';
import SpawnInterface from './spawn-interface';

export default class Interface {
    readonly gui = new GUI({
        title: 'Satellites Simulator VI: Deluxe Edition',
        width: 500,
    });

    protected readonly camera: CameraInterface;
    protected readonly planet: PlanetInterface;
    protected readonly spawn: SpawnInterface;

    constructor(protected app: Application) {
        this.planet = new PlanetInterface(this.gui, app);
        this.spawn = new SpawnInterface(this.gui, app);
        this.camera = new CameraInterface(this.gui, app);
    }

    hotReplaceApplication(app: Application) {
        this.camera.hotReplaceApplication(app);
        this.planet.hotReplaceApplication(app);
        this.spawn.hotReplaceApplication(app);
    }

    destroy() {
        this.gui.destroy();
    }
}
