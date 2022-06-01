import GUI from 'lil-gui';
import type Application from 'app';
import { EARTH_RADIUS } from 'physics/constants';

export default class CameraInterface {
    protected readonly folder = this.gui.addFolder('Camera');

    protected actions = {
        reset: this.reset.bind(this),
        lookAtOrigin: this.lookAtOrigin.bind(this),
        lookAtX: this.lookAtX.bind(this),
        lookAtY: this.lookAtY.bind(this),
        lookAtZ: this.lookAtZ.bind(this),
    };

    constructor(protected readonly gui: GUI, protected app: Application) {
        this.folder.open(false); // closed by default.

        this.folder.add(this.actions, 'lookAtX').name('Look at X axis');
        this.folder.add(this.actions, 'lookAtY').name('Look at Y axis');
        this.folder.add(this.actions, 'lookAtZ').name('Look at Z axis');
        this.folder.add(this.actions, 'lookAtOrigin').name('Look at origin (planet)');
        this.folder.add(this.actions, 'reset').name('Reset');
    }

    hotReplaceApplication(app: Application) {
        this.app = app;
    }

    protected reset() {
        this.app.controls.reset();
        this.app.camera.position.z = EARTH_RADIUS * 4;
    }

    protected lookAtOrigin() {
        this.app.controls.target.set(0, 0, 0);
        this.app.controls.update();
    }

    protected lookAtX() {
        const distance = this.app.camera.position.length();
        this.app.camera.position.set(distance, 0, 0);
        this.app.controls.update();
    }

    protected lookAtY() {
        const distance = this.app.camera.position.length();
        this.app.camera.position.set(0, distance, 0);
        this.app.controls.update();
    }

    protected lookAtZ() {
        const distance = this.app.camera.position.length();
        this.app.camera.position.set(0, 0, distance);
        this.app.controls.update();
    }
}