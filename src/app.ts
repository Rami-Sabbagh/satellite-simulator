import GUI from 'lil-gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import World from 'world';
import Singleton from "./singleton";

/**
 * THREE.js Application.
 */
export default class Application {
    readonly renderer = new THREE.WebGLRenderer();
    readonly camera = new THREE.PerspectiveCamera(75, this.renderer.domElement.width / this.renderer.domElement.height, 0.1, 1000);
    readonly controls = new OrbitControls(this.camera, this.renderer.domElement);

    readonly gui = new GUI({
        title: 'Satellites Simulator VI: Deluxe Edition',
        width: 500,
    });

    private _world = new World();

    readonly singleton = new Singleton();

    get world() { return this._world; }

    protected resizeCallback: () => void;

    constructor(public readonly container: HTMLElement) {
        // configure application components.
        this.setupComponents();

        this.updateResolution();

        // integrate with the browser DOM.
        this.resizeCallback = this.updateResolution.bind(this);

        container.appendChild(this.renderer.domElement);
        window.addEventListener('resize', this.resizeCallback);

        this.renderer.setAnimationLoop(this.render.bind(this));
        this.provideHotModulesReplacement();

        this.constructGUI();
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

    private setupComponents() {
        this.renderer.physicallyCorrectLights = true;
        this.camera.position.z = 2;
        this.controls.enableDamping = true;
    }

    private constructGUI() {
        this.constructPlanetGUI();
        this.constructCreationGUI();
        this.constructCameraGUI();
    }

    private constructCreationGUI() {
        const folder = this.gui.addFolder('Satellite Creation');

        // gui.add( this.orbitalElements, 'eccentricity').name('Eccentricity').min(0).max(1);
        // gui.add( this.orbitalElements, 'semiMajorAxis').name('Semi-Major Axis').min(0).max(5);
        // gui.add( this.orbitalElements, 'inclination').name('Inclination').min(0).max(Math.PI);
        // gui.add( this.orbitalElements, 'trueAnomaly').name('True Anomaly').min(0).max(Math.PI);
        // gui.add( this.orbitalElements, 'argumentOfPeriapsis').name('Argument of Periapsis').min(0).max(Math.PI);
        // gui.add( this.orbitalElements, 'longitudeOfAscendingNode').name('Longitude of Ascending Node').min(0).max(Math.PI);

    }

    private constructPlanetGUI() {
        const folder = this.gui.addFolder('Planet');

        const properties = {
            color: this.world.planet.color.toArray(),
            wireframe: this.world.planet.wireframe,
        };

        folder.addColor(properties, 'color').name('Color')
            .onChange((value: number[]) => this.world.planet.color.fromArray(value));

        folder.add(properties, 'wireframe').name('Wireframe')
            .onChange((value: boolean) => this.world.planet.wireframe = value);
        
        //could change planet physics in addition of texture (presets)
        const texturesOptions = {
            earth: () => {
                this.world.planet.setTexture(this.singleton.texturePacks.earth);
            },
            mars: () => {
                this.world.planet.setTexture(this.singleton.texturePacks.mars);
            },
            jupiter: () => {
                this.world.planet.setTexture(this.singleton.texturePacks.jupiter);
            },
        };

        const texturesFolder = folder.addFolder('textures');
        texturesFolder.add( texturesOptions, 'earth').name('Earth Texture');
        texturesFolder.add( texturesOptions, 'mars').name('Mars Texture');
        texturesFolder.add( texturesOptions, 'jupiter').name('Jupiter Texture');
    }

    private constructCameraGUI() {
        const folder = this.gui.addFolder('Camera');
        folder.open(false);

        const actions = {
            reset: () => {
                this.controls.reset();
                this.camera.position.z = 2;
            },
            lookAtOrigin: () => {
                this.controls.target.set(0, 0, 0);
                this.controls.update();
            },
            lookAtX: () => {
                const distance = this.camera.position.length();
                this.camera.position.set(distance, 0, 0);
                this.controls.update();
            },
            lookAtY: () => {
                const distance = this.camera.position.length();
                this.camera.position.set(0, distance, 0);
                this.controls.update();
            },
            lookAtZ: () => {
                const distance = this.camera.position.length();
                this.camera.position.set(0, 0, distance);
                this.controls.update();
            },
        };

        folder.add(actions, 'lookAtX').name('Look at X axis');
        folder.add(actions, 'lookAtY').name('Look at Y axis');
        folder.add(actions, 'lookAtZ').name('Look at Z axis');
        folder.add(actions, 'lookAtOrigin').name('Look at origin (planet)');
        folder.add(actions, 'reset').name('Reset');
    }

    private provideHotModulesReplacement() {
        if (module.hot) {
            module.hot.accept('./world', () => {
                this._world = new World();
            });

            module.hot.addDisposeHandler(() => this.gui.destroy());
            module.hot.addDisposeHandler(() => window.removeEventListener('resize', this.resizeCallback));
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