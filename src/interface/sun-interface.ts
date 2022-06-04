import GUI from 'lil-gui';
import type Application from 'app';

export default class SunInterface {
    protected readonly folder = this.gui.addFolder('Sun');

    protected distance = this.app.world.sun.distance;
    protected intensity = Math.log10(this.app.world.sun.intensity / 2);
    protected radius = this.app.world.sun.radius;
    protected color = this.app.world.sun.color;
    protected wireframe = this.app.world.sun.wireframe;

    constructor(protected readonly gui: GUI, protected app: Application) {
        this.folder.open(false); // closed by default.

        this.folder.add(this, 'distance', 60, 1_000).name('Distance');
        this.folder.add(this, 'radius', 0, 1_000).name('Radius');
        this.folder.add(this, 'intensity', 16, 18).name('Light Intensity');
        this.folder.addColor(this, 'color').name('Color');
        this.folder.add(this, 'wireframe').name('Wireframe');

        this.folder.onChange(this.apply.bind(this));

        this.apply();
    }

    hotReplaceApplication(app: Application) {
        this.app = app;
        this.apply();
    }

    protected apply() {
        this.app.world.sun.distance = this.distance;
        this.app.world.sun.intensity = Math.pow(10, this.intensity) * 2;
        this.app.world.sun.radius = this.radius;
        this.app.world.sun.color = this.color;
        this.app.world.sun.wireframe = this.wireframe;
    }
}