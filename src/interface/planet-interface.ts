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

    protected get period() {
        return this.app.world.planet.period / 3600;
    }

    protected set period(value) {
        this.app.world.planet.period = value * 3600;
    }

    protected radius = this.app.world.planet.radius;
    protected mass = this.app.world.planet.mass;
    protected color = this.app.world.planet.color;
    protected wireframe = this.app.world.planet.wireframe;
    protected texture = texturesOptions[1];
    protected bumpScale = textures.earth.bumpScale ?? 0;
    protected atmosphereDensity = this.app.world.planet.atmosphereDensity;
    protected atmosphereHeight = this.app.world.planet.atmosphereHeight;
    protected atmosphereVisible = this.app.world.planet.atmosphereVisible;

    constructor(protected readonly gui: GUI, protected app: Application) {
        this.folder.open(false); // closed by default.

        this.folder.add(this, 'period').name('Period').min(1).max(48).step(1);
        this.folder.add(this, 'texture', texturesOptions).name('Texture')
            .onChange(() => {
                this.bumpScale = textures[`${this.texture.charAt(0).toLowerCase()}${this.texture.slice(1)}`].bumpScale ?? 0;
                this.folder.controllers.find(c => c.property === 'bumpScale')?.updateDisplay();
            });
        this.folder.add(this, 'bumpScale').name('Bump Scale').min(1e5).max(1e6)
            .onChange(() => this.app.world.planet.bumpScale = this.bumpScale);
        this.folder.add(this, 'radius').name('Radius').min(this.app.world.planet.radius * .5).max(this.app.world.planet.radius * 5);
        this.folder.add(this, 'mass').name('Mass')
            .min(this.app.world.planet.mass)
            .max(this.app.world.planet.mass * 100);

        this.folder.add(this, 'atmosphereVisible').name('Show Atmosphere');
        this.folder.add(this, 'atmosphereDensity').name('Atmosphere Density').min(this.atmosphereDensity / 20).max(this.atmosphereDensity * 10);
        this.folder.add(this, 'atmosphereHeight').name('Atmosphere Height').min(this.atmosphereHeight / 10).max(this.atmosphereHeight * 4);

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
        this.app.world.planet.atmosphereDensity = this.atmosphereDensity;
        this.app.world.planet.atmosphereHeight = this.atmosphereHeight;
        this.app.world.planet.atmosphereVisible = this.atmosphereVisible;
    }
}   