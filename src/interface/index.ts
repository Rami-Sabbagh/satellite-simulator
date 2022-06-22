import GUI from 'lil-gui';
import type Application from 'app';

import SimulationInterface from './simulation-interface';
import CameraInterface from './camera-interface';
import PlanetInterface from './planet-interface';
import SatellitesInterface from './satellites-interface';
import SunInterface from './sun-interface';
import GUIInterface from './gui-styles-interface';

export default class Interface {
    readonly gui = new GUI({
        title: 'Satellites Simulator VI: Deluxe Edition',
        width: 500,
    });

    /**
     * This file is fishy... Adding a new folder requires us to add
     * code to three different places in this file. Maybe we could
     * have an array of folders and loop over them for instantiation/HMR?
     */
    protected readonly simulation: SimulationInterface;
    protected readonly sun: SunInterface;
    protected readonly planet: PlanetInterface;
    protected readonly satellites: SatellitesInterface;
    protected readonly camera: CameraInterface;
    protected readonly guiStyles: GUIInterface

    constructor(protected app: Application) {
        this.simulation = new SimulationInterface(this.gui, app);
        this.sun = new SunInterface(this.gui, app);
        this.planet = new PlanetInterface(this.gui, app);
        this.satellites = new SatellitesInterface(this.gui, app);
        this.camera = new CameraInterface(this.gui, app);
        this.guiStyles = new GUIInterface(this.gui, app);
    }

    hotReplaceApplication(app: Application) {
        this.simulation.hotReplaceApplication(app);
        this.sun.hotReplaceApplication(app);
        this.camera.hotReplaceApplication(app);
        this.planet.hotReplaceApplication(app);
        this.satellites.hotReplaceApplication(app);
    }

    destroy() {
        this.gui.destroy();
    }
}
