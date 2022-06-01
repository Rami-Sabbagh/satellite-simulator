import GUI from 'lil-gui';
import type Application from 'app';
import { ManualElements } from 'physics/kepler-math';

export default class SpawnInterface {
    protected folder = this.gui.addFolder('Satellite Creation');

    protected spawnElements: ManualElements = {
        inclination: 0,
        trueAnomaly: 0,
        semiMajorAxis: .7,
        velocity: 1,
    };

    constructor(protected readonly gui: GUI, protected app: Application) {
        this.folder.open(false); // closed by default.

        const minRadius = this.app.world.planet.radius;
        const maxRadius = this.app.world.planet.radius * 2;

        this.folder.add(this.spawnElements, 'inclination').name('Inclination').min(0).max(Math.PI);
        this.folder.add(this.spawnElements, 'trueAnomaly').name('True Anomaly').min(0).max(Math.PI * 2);
        this.folder.add(this.spawnElements, 'semiMajorAxis').name('Semi-Major Axis').min(minRadius).max(maxRadius);
        this.folder.add(this.spawnElements, 'velocity').name('Velocity').min(0).max(5);
    }

    hotReplaceApplication(app: Application) {
        this.app = app;
    }
}