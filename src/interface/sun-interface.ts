import GUI from 'lil-gui';
import type Application from 'app';

export default class SunInterface {
    protected readonly folder = this.gui.addFolder('Sun');

    protected distance = this.app.world.sun.distance;
    protected intensity = Math.log10(this.app.world.sun.intensity / 2);
    protected radius = this.app.world.sun.radius;
    protected color = this.app.world.sun.color;
    protected wireframe = this.app.world.sun.wireframe;
    protected lensflareScale = 1;

    constructor(protected readonly gui: GUI, protected app: Application) {
        this.folder.open(false); // closed by default.

        const minIntensity = this.intensity - 2;
        const maxIntensity = this.intensity + 1;

        this.folder.add(this, 'distance', 60, this.app.world.sun.distance).name('Distance');
        this.folder.add(this, 'radius', 0, this.app.world.sun.radius).name('Radius');
        this.folder.add(this, 'intensity', minIntensity, maxIntensity).name('Light Intensity');
        this.folder.addColor(this, 'color').name('Color');
        this.folder.add(this, 'wireframe').name('Wireframe');
        this.folder.add(this, 'lensflareScale').name('Lensflare').min(0.1).max(30).step(0.1);
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
        this.app.world.sun.lensflareScaler = this.lensflareScale;
    }
}