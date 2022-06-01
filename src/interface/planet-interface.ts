import GUI from 'lil-gui';
import type Application from 'app';

import { earthTexture, jupiterTexture, marsTexture, TexturePack } from 'textures';

const textures: Record<string, Partial<TexturePack>> = {
    abstract: {},
    earth: earthTexture,
    jupiter: jupiterTexture,
    mars: marsTexture,
};

const texturesOptions = Object.keys(textures).map(key => `${key.charAt(0).toUpperCase()}${key.slice(1)}`);

export default class PlanetInterface {
    protected readonly folder = this.gui.addFolder('Planet');

    protected radius = this.app.world.planet.radius;
    protected mass = this.app.world.planet.mass;
    protected color = this.app.world.planet.color;
    protected wireframe = this.app.world.planet.wireframe;
    protected texture = texturesOptions[1];
    
    constructor(protected readonly gui: GUI, protected app: Application) {
        this.folder.open(false); // closed by default.
        
        this.folder.add(this, 'texture', texturesOptions).name('Texture');
        this.folder.add(this, 'radius').name('Radius').min(.5).max(1);
        this.folder.add(this, 'mass').name('Mass')
            .min(this.app.world.planet.mass)
            .max(this.app.world.planet.mass * 100);
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
        // TODO: could change planet physics in addition of texture (presets).

        this.app.world.planet.texture = textures[`${this.texture.charAt(0).toLowerCase()}${this.texture.slice(1)}`];
        this.app.world.planet.radius = this.radius;
        this.app.world.planet.mass = this.mass;
        this.app.world.planet.color = this.color;
        this.app.world.planet.wireframe = this.wireframe;
    }
}   