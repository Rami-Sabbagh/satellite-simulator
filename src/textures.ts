import * as THREE from 'three';

import earthColorMap from 'assets/earth.jpg';
import jupiterColorMap from 'assets/jupiter.jpg';
import marsColorMap from 'assets/mars.jpg';

export interface TexturePack {
    colorMap: THREE.Texture,
    bumpMap: THREE.Texture,
    aoMap: THREE.Texture,
    emissiveMap: THREE.Texture,
    metalnessMap: THREE.Texture,
}

const loader = new THREE.TextureLoader();

export const earthTexture: Partial<TexturePack> = {
    colorMap: loader.load(earthColorMap),
};

export const jupiterTexture: Partial<TexturePack> = {
    colorMap: loader.load(jupiterColorMap),
};

export const marsTexture: Partial<TexturePack> = {
    colorMap: loader.load(marsColorMap),
};