import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';

import World from 'components/world';
import { EARTH_DISTANCE, EARTH_RADIUS, SIMULATION_SCALE } from 'physics/constants';
/**
 * THREE.js Application.
 */
export default class Application {
    readonly renderer = new THREE.WebGLRenderer({
        logarithmicDepthBuffer: true,
    });
    readonly camera = new THREE.PerspectiveCamera(75, this.renderer.domElement.width / this.renderer.domElement.height, 0.1, EARTH_DISTANCE * 1.2 * SIMULATION_SCALE);
    readonly controls = new OrbitControls(this.camera, this.renderer.domElement);
    readonly stats = Stats();

    private _world = new World();
    get world() { return this._world; }

    protected _statsVisible = false;

    protected resizeCallback: () => void;

    constructor(public readonly container: HTMLElement) {
        // configure application components.
        this.setupComponents();

        this.updateResolution();

        // integrate with the browser DOM.
        this.resizeCallback = this.updateResolution.bind(this);

        container.appendChild(this.renderer.domElement);
        window.addEventListener('resize', this.resizeCallback);
        if (module.hot) module.hot.addDisposeHandler(() => window.removeEventListener('resize', this.resizeCallback));

        this.renderer.setAnimationLoop(this.render.bind(this));

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

    get showStats() { return this._statsVisible; }
    set showStats(value: boolean) {
        if (this._statsVisible === value) return;
        this._statsVisible = value;

        if (value) this.container.appendChild(this.stats.dom);
        else this.container.removeChild(this.stats.dom);
    }

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
        this.controls.update();
        this.renderer.render(this.world, this.camera);
        this.stats.update();
    }

    destroy() {
        if (this._statsVisible) this.stats.domElement.remove();
        this.renderer.domElement.remove();
        this.renderer.setAnimationLoop(null);

        this.container.removeEventListener('resize', this.resizeCallback);
    }
}