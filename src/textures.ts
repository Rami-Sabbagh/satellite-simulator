import * as THREE from 'three';

import earthColorMap from 'assets/textures/earth-texture-maps/earth-color.jpg';
import earthBumpMap from 'assets/textures/earth-texture-maps/earth-bump.jpg';
import jupiterColorMap from 'assets/textures/jupiter-texture-maps/jupiter-color.jpg';
import marsColorMap from 'assets/textures/mars-texture-maps/mars-color.jpg';
import marsBumpMap from 'assets/textures/mars-texture-maps/mars-bump.jpg';

import sunColorMap from 'assets/sun.jpg';

export interface TexturePack {
    colorMap: THREE.Texture,
    bumpMap: THREE.Texture,
    bumpScale: number,
    aoMap: THREE.Texture,
    emissiveMap: THREE.Texture,
    metalnessMap: THREE.Texture,
}

const loader = new THREE.TextureLoader();

export const earthTexture: Partial<TexturePack> = {
    colorMap: loader.load(earthColorMap),
    bumpMap: loader.load(earthBumpMap),
    bumpScale: 0.2,
};

export const jupiterTexture: Partial<TexturePack> = {
    colorMap: loader.load(jupiterColorMap),
};

export const marsTexture: Partial<TexturePack> = {
    colorMap: loader.load(marsColorMap),
    bumpMap: loader.load(marsBumpMap),
    bumpScale: 0.2,
};

export const sunTexture: Partial<TexturePack> = {
    colorMap: loader.load(sunColorMap),
};