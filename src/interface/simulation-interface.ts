import GUI from 'lil-gui';
import type Application from 'app';

export default class SimulationInterface {
    protected readonly folder = this.gui.addFolder('Simulation');

    protected resolution = Math.log10(this.app.world.timeResolution);
    protected timescale = this.app.world.timescale;
    protected paused = false;

    constructor(protected readonly gui: GUI, protected app: Application) {
        this.folder.open(false); // closed by default.

        this.folder.add(this, 'resolution').name('Time resolution').min(-8).max(2).step(1);
        this.folder.add(this, 'timescale').name('Time scale').min(0.1).max(1e4).step(1);
        this.folder.add(this, 'paused').name('Pause');

        this.folder.onChange(this.apply.bind(this));
    }

    hotReplaceApplication(app: Application) {
        this.app = app;
        this.apply();
    }

    protected apply() {
        this.app.world.timeResolution = Math.pow(10, this.resolution);
        this.app.world.timescale = this.timescale;
        this.app.world.paused = this.paused;
    }
}