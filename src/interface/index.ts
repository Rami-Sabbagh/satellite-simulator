import GUI from 'lil-gui';


import type Application from 'app';

import SimulationInterface from './simulation-interface';
import CameraInterface from './camera-interface';
import PlanetInterface from './planet-interface';
import OrbitInterface from './orbit-interface';
import SunInterface from './sun-interface';
import GUIInterface from './gui-styles-interface';
export default class Interface {
    readonly gui = new GUI({
        title: 'Satellites Simulator VI: Deluxe Edition',
        width: 500,
    });

    protected readonly simulation: SimulationInterface;
    protected readonly sun: SunInterface;
    protected readonly planet: PlanetInterface;
    protected readonly orbit: OrbitInterface;
    protected readonly camera: CameraInterface;
    protected readonly guiStyles: GUIInterface

    constructor(protected app: Application) {
        this.simulation = new SimulationInterface(this.gui, app);
        this.sun = new SunInterface(this.gui, app);
        this.planet = new PlanetInterface(this.gui, app);
        this.orbit = new OrbitInterface(this.gui, app);
        this.camera = new CameraInterface(this.gui, app);
        this.guiStyles = new GUIInterface(this.gui, app);
    }

    hotReplaceApplication(app: Application) {
        this.simulation.hotReplaceApplication(app);
        this.sun.hotReplaceApplication(app);
        this.camera.hotReplaceApplication(app);
        this.planet.hotReplaceApplication(app);
        this.orbit.hotReplaceApplication(app);
    }

    destroy() {
        this.gui.destroy();
    }
}
