import GUI, { Controller } from 'lil-gui';
import type Application from 'app';

import { Euler, Spherical, Vector3 } from 'three';

import { EARTH_RADIUS } from 'physics/constants';
import Satellite from 'components/satellite';

const TO_DEGREE = 180 / Math.PI;
const TO_RADIAN = Math.PI / 180;

const tempEuler = new Euler();
const tempSpherical = new Spherical();
const tempVector = new Vector3();

function fixAngle(radian: number): number {
    return (radian < -Math.PI) ? (radian + Math.PI + Math.PI) : radian;
}

function isCritical(angle: number): boolean {
    const critical = 1e-6, angle2 = Math.abs(angle);
    return angle2 > Math.PI - critical || angle2 < critical;
}

/**
 * The display name for creating a new satellite.
 */
const NEW_SATELLITE = '(new)';

// RAMI THIS CLASS IS TOO CHONKY
export default class SatellitesInterface {
    protected folder = this.gui.addFolder('Satellites');

    nextSatelliteId = 1;

    /**
     * |           |                     |
     * |-----------|---------------------|
     * | `id = -1` | new satellite.      |
     * | `id >= 0` | existing satellite. |
     */
    _satelliteId = -1;

    get satelliteId() {
        return this._satelliteId;
    }

    set satelliteId(value) {
        this._satelliteId = value;
        this.satellite = (value === -1) ? this.newDraftSatellite() : this.app.world.satellites[value];
        if (this.follow) this.follow = true; // trigger it to update the followed satellite
        this.refreshInterface();
    }

    protected readonly spawnPosition = new Vector3(EARTH_RADIUS * 1.25, 0, 0)
    protected readonly spawnVelocity = new Vector3(0, 0, -7e3);

    satellite = this.newDraftSatellite();

    get name() {
        return this.satellite.name;
    }

    set name(value) {
        this.satellite.name = value;
        if (this.satelliteId !== -1) this.updateSatellitesList();
    }

    get mass() {
        return this.satellite.mass;
    }

    set mass(value) {
        this.satellite.mass = value;
    }

    get shape() {
        return this.satellite.shape;
    }

    set shape(value) {
        this.satellite.shape = value;
    }

    get faceArea() {
        return this.satellite.faceArea;
    }

    set faceArea(value) {
        this.satellite.faceArea = value;
    }

    _calculatedPosition = new Vector3();
    _height = 0;
    _longitude = 0;
    _latitude = 0;

    protected updatePosition() {
        if (this._calculatedPosition.equals(this.satellite.position)) return; // doesn't need updating.

        this._calculatedPosition.copy(this.satellite.position);
        this._height = this._calculatedPosition.length();

        tempSpherical.setFromVector3(this._calculatedPosition);
        this._latitude = Math.PI / 2 - tempSpherical.phi;
        if (!isCritical(this._latitude + Math.PI / 2)) this._longitude = fixAngle(tempSpherical.theta - Math.PI / 2);
    }

    protected applyPosition() {
        tempEuler.set(0, this._longitude, this._latitude, 'YZX');
        this.satellite.position.set(this._height, 0, 0).applyEuler(tempEuler);
        this.applyVelocity();
    }

    get height() {
        this.updatePosition();
        return this._height;
    }

    set height(value) {
        this.satellite.position.normalize().multiplyScalar(value);
    }

    get longitude() {
        this.updatePosition();
        return this._longitude * TO_DEGREE;
    }

    set longitude(value) {
        this._longitude = value * TO_RADIAN;
        this.applyPosition();
    }

    get latitude() {
        this.updatePosition();
        return this._latitude * TO_DEGREE;
    }

    set latitude(value) {
        this._latitude = value * TO_RADIAN;
        this.applyPosition();
    }

    _calculatedVelocity = new Vector3();
    _velocity = 0;
    _inclination = 0;
    _theta = 90 * TO_RADIAN;
    _scale = 1;

    protected updateVelocity() {
        if (this._calculatedVelocity.equals(this.satellite.velocity)) return; // doesn't need updating.

        this._calculatedVelocity.copy(this.satellite.velocity);
        this._velocity = this._calculatedVelocity.length();

        this.updatePosition();
        tempEuler.set(Math.PI, -this._longitude, -this._latitude - Math.PI / 2, 'XZY'); // undo the orbital pane.
        tempVector.copy(this._calculatedVelocity).applyEuler(tempEuler);

        tempSpherical.setFromVector3(tempVector);
        this._theta = Math.PI - tempSpherical.phi;
        if (!isCritical(this._theta)) this._inclination = tempSpherical.theta;

        if (Math.abs(this._inclination) < 1e-6) this._inclination = 0;

        if (this.preview) this.app.world.ghost.state = this.satellite;
    }

    protected applyVelocity() {
        tempEuler.set(this._inclination, this._longitude, this._latitude, 'YZX');
        this.satellite.velocity
            .set(Math.cos(this._theta), 0, Math.sin(this._theta))
            .multiplyScalar(-this._velocity).applyEuler(tempEuler);
    }

    get velocity() {
        this.updateVelocity();
        return this._velocity;
    }

    set velocity(value) {
        this.satellite.velocity.normalize().multiplyScalar(value);
    }

    get inclination() {
        this.updateVelocity();
        return this._inclination * TO_DEGREE;
    }

    set inclination(value) {
        this._inclination = value * TO_RADIAN;
        this.applyVelocity();
    }

    get theta() {
        this.updateVelocity();
        return this._theta * TO_DEGREE;
    }

    set theta(value) {
        this._theta = value * TO_RADIAN;
        this.applyVelocity();
    }

    get scale() {
        return this._scale;
    }
    set scale(value) {
        this._scale = value;
        this.satellite.scale.set(value, value, value);
        this.satellite.collisionRadius = Satellite.defaultCollisionRadius * value;
    }
    preview = this.app.world.ghost.visible;

    get follow() {
        return this.app.followedObject !== undefined;
    }

    set follow(value) {
        this.app.followedObject = value ? this.satellite : undefined;
    }

    actionBound = this.action.bind(this);

    get selectedSatelliteOption() {
        return (this.satelliteId === -1) ? NEW_SATELLITE : `${this.satelliteId}: ${this.satellite.name}`;
    }

    set selectedSatelliteOption(name: string) {
        this.satelliteId = (name === NEW_SATELLITE) ? -1 : parseInt(name.split(':')[0]);
    }

    private satelliteController: Controller;
    private actionController: Controller;

    constructor(protected readonly gui: GUI, protected app: Application) {
        // this.folder.open(false); // closed by default.

        // Had to use a folder, because then the controller is updated, it's placed at the end of the folder.
        // And so storing it in a folder alone would prevent it from being pushed to the end of the list.
        this.satelliteController = this.folder.addFolder('').add(this, 'selectedSatelliteOption', [NEW_SATELLITE]).name('Satellite');

        this.folder.add(this, 'preview').name('Preview');
        this.folder.add(this, 'follow').name('Follow');
        this.folder.add(this, 'name').name('Name');
        this.folder.add(this, 'scale').name('Scale').min(0.000001).max(1).step(0.0001);
        this.folder.add(this, 'mass').name('Mass').min(1).max(1e6);

        this.folder.add(this, 'shape').name('Shape').min(0).max(1);
        this.folder.add(this, 'faceArea').name('Face Area').min(1).max(1e4);

        this.folder.add(this, 'velocity').name('Velocity').min(1e3).max(1e5);
        this.folder.add(this, 'height').name('Height').min(EARTH_RADIUS * 1.25).max(EARTH_RADIUS * 10);

        this.folder.add(this, 'longitude').name('Longitude').min(-180).max(180).listen();
        this.folder.add(this, 'latitude').name('Latitude').min(-90).max(90).listen();
        this.folder.add(this, 'inclination').name('Inclination').min(-180).max(180).listen();
        this.folder.add(this, 'theta').name('Theta').min(0).max(180).listen();

        this.actionController = this.folder.add(this, 'actionBound').name('Spawn Satellite');


        this.folder.onChange(this.apply.bind(this));
        this.apply();
    }

    hotReplaceApplication(app: Application) {
        this.app = app;
        this.apply();
    }

    protected newDraftSatellite() {
        const satellite = Satellite.spawn(this.spawnPosition, this.spawnVelocity);
        satellite.name = `Satellite #${this.nextSatelliteId}`;

        return satellite;
    }

    protected apply() {
        this.app.world.ghost.state = this.satellite; // _POLYMORPHISM_.
        this.app.world.ghost.visible = this.preview;
    }

    protected updateSatellitesList() {
        this.satelliteController = this.satelliteController.options([NEW_SATELLITE, ...this.app.world.satellites.map(({ name }, id) => `${id}: ${name}`)]);
    }

    protected refreshInterface() {
        this.actionController.name(this.satelliteId === -1 ? 'Spawn Satellite' : 'Delete Satellite');
        this.folder.controllersRecursive().forEach(controller => controller.updateDisplay());
    }

    protected action() {
        if (this.satelliteId === -1) this.spawn();
        else this.delete();
    }

    protected delete() {
        this.app.toaster.toast(`Satellite ${this.name ? `"${this.name}"` : `#${this.satelliteId}`} has been deleted.`, 'alert');
        this.app.world.removeSatellite(this.satellite);

        this.satelliteId = -1;
        this.updateSatellitesList();
    }

    protected spawn() {
        this.nextSatelliteId++;

        this.spawnPosition.copy(this.satellite.position);
        this.spawnVelocity.copy(this.satellite.velocity);

        this.app.world.addSatellite(this.satellite);
        this.satellite.addDestructionListener(this.onSatelliteDestroyed.bind(this));

        this.updateSatellitesList();
        this.satelliteId = -1;
    }

    protected onSatelliteDestroyed(satellite: Satellite) {
        this.updateSatellitesList();
        if (this.satelliteId === -1) return;

        if (this.satellite === satellite) this.satelliteId = -1;
        else if (this.app.world.satellites[this.satelliteId] !== this.satellite) this.satelliteId--;
    }
}
