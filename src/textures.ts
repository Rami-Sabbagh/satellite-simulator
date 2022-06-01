import * as THREE from 'three';

import earthColorMap from 'assets/earth/color-map.jpg';
import earthBumpMap from 'assets/earth/bump-map.jpg';
import jupiterColorMap from 'assets/jupiter/color-map.jpg';
import marsColorMap from 'assets/mars/color-map.jpg';
import marsBumpMap from 'assets/mars/bump-map.jpg';

import sunColorMap from 'assets/sun/color-map.jpg';
import { EARTH_RADIUS } from 'physics/constants';

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
    bumpScale: EARTH_RADIUS / 50,
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