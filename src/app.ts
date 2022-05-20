import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import World from 'world';

/**
 * THREE.js Application.
 */
export default class Application {
    readonly renderer = new THREE.WebGLRenderer();
    
    readonly camera = new THREE.PerspectiveCamera(75, this.renderer.domElement.width / this.renderer.domElement.height, 0.1, 1000);
    
    readonly controls = new OrbitControls(this.camera, this.renderer.domElement);

    private _world = new World();
    get world() { return this._world; }

    protected resizeCallback: () => void;

    constructor(public readonly container: HTMLElement) {
        // configure application components.
        this.setupComponents();

        this.updateResolution();

        // integrate with the browser DOM.
        this.resizeCallback = this.updateResolution.bind(this);

        container.appendChild(this.renderer.domElement);
        container.addEventListener('resize', this.resizeCallback);

        this.renderer.setAnimationLoop(this.render.bind(this));
        this.acceptHotModulesReplacement();
    }

    private setupComponents() {
        this.renderer.physicallyCorrectLights = true;
        this.camera.position.z = 2;
        this.controls.enableDamping = true;
    }

    private acceptHotModulesReplacement() {
        if (module.hot) {
            module.hot.accept('./world', () => {
                this._world = new World();
            });
        }
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
    }

    destroy() {
        this.renderer.domElement.remove();
        this.renderer.setAnimationLoop(null);

        this.container.removeEventListener('resize', this.resizeCallback);
    }
}