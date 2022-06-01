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

    protected color = this.app.world.planet.color.toArray();
    protected wireframe = this.app.world.planet.wireframe;
    protected texture = texturesOptions[1];
    
    constructor(protected readonly gui: GUI, protected app: Application) {
        this.folder.open(false); // closed by default.
        
        this.folder.add(this, 'texture', texturesOptions).name('Texture');
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
        this.app.world.planet.color.fromArray(this.color);
        this.app.world.planet.wireframe = this.wireframe;
    }
}