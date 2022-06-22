import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';

import World from 'components/world';
import { EARTH_DISTANCE, EARTH_RADIUS, SIMULATION_SCALE } from 'physics/constants';
import Toaster from 'interface/toaster';
/**
 * THREE.js Application.
 */
export default class Application {
    public readonly renderer = new THREE.WebGLRenderer({
        antialias: true,
        logarithmicDepthBuffer: true,
    });
    public readonly camera = new THREE.PerspectiveCamera(75, this.renderer.domElement.width / this.renderer.domElement.height, 0.1, EARTH_DISTANCE * 1.2 * SIMULATION_SCALE);
    public readonly controls = new OrbitControls(this.camera, this.renderer.domElement);
    public readonly stats = Stats();

    public readonly toaster = new Toaster();
    protected resizeCallback: () => void;

    protected _world = new World();
    get world() { return this._world; }

    protected _statsVisible = false;
    get showStats() { return this._statsVisible; }
    set showStats(value: boolean) {
        if (this._statsVisible === value) return;
        this._statsVisible = value;

        if (value) this.container.appendChild(this.stats.dom);
        else this.container.removeChild(this.stats.dom);
    }

    protected _followedObject: THREE.Object3D | undefined;
    get followedObject() { return this._followedObject; }
    set followedObject(object) {
        this._followedObject = object;
        this.camera.position.normalize().multiplyScalar(object ? 1e7 : EARTH_RADIUS * 4);
    }

    constructor(public readonly container: HTMLElement) {
        this.setupComponents();
        this.updateResolution();

        // integrate with the browser DOM.
        this.resizeCallback = this.updateResolution.bind(this);

        container.appendChild(this.renderer.domElement);
        window.addEventListener('resize', this.resizeCallback);
        if (module.hot) module.hot.addDisposeHandler(() => window.removeEventListener('resize', this.resizeCallback));

        this.renderer.setAnimationLoop(this.render.bind(this));
        this.world.onSatelliteDestruction = (satellite) => this.toaster.toast(`${satellite.name} has collided and was destroyed!`, 'explosion');
        this.showStats = true;
    }

    /**
     * Restore the state from a previous instance of the application.
     * This facilitates HMR (Hot Module Replacement).
     */
    restoreState(application: Application) {
        this.camera.position.copy(application.camera.position);
        this.camera.rotation.copy(application.camera.rotation);
        this.camera.zoom = application.camera.zoom;

        this.controls.target.copy(application.controls.target);
        this.controls.update();
    }

    /**
     * Configures the application's components
     */
    private setupComponents() {
        this.renderer.physicallyCorrectLights = true;
        this.camera.position.z = EARTH_RADIUS * 4 * SIMULATION_SCALE;
        this.controls.enableDamping = true;
        this.world.scale.multiplyScalar(SIMULATION_SCALE);
    }

    protected updateResolution() {
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);

        this.camera.aspect = this.renderer.domElement.width / this.renderer.domElement.height;
        this.camera.updateProjectionMatrix();
    }

    protected render() {
        this.world.update();
        this.followObject();
        this.controls.update();

        this.renderer.render(this.world, this.camera);
        this.stats.update();
    }

    protected followObject() {
        if (!this.followedObject) return;

        const cameraDistance = Math.min(Math.max(this.camera.position.distanceTo(this.followedObject.position), 0.75e7), 2e7);
        const objectDistance = this.followedObject.position.length();
        this.camera.position.copy(this.followedObject.position).multiplyScalar((cameraDistance + objectDistance) / objectDistance);
        this.camera.lookAt(this.followedObject.position);
        this.controls.target.copy(this.followedObject.position);
    }

    destroy() {
        if (this._statsVisible) this.stats.domElement.remove();
        this.renderer.domElement.remove();
        this.renderer.setAnimationLoop(null);

        this.container.removeEventListener('resize', this.resizeCallback);
    }
}