import * as THREE from 'three';

import earthColorMap from 'assets/earth/color-map.jpg';
import earthBumpMap from 'assets/earth/bump-map.jpg';
import jupiterColorMap from 'assets/jupiter/color-map.jpg';
import marsColorMap from 'assets/mars/color-map.jpg';
import marsBumpMap from 'assets/mars/bump-map.jpg';

import sunColorMap from 'assets/sun/color-map.jpg';

import skyboxNX from 'assets/skybox/nx.png';
import skyboxNY from 'assets/skybox/ny.png';
import skyboxNZ from 'assets/skybox/nz.png';
import skyboxPX from 'assets/skybox/px.png';
import skyboxPY from 'assets/skybox/py.png';
import skyboxPZ from 'assets/skybox/pz.png';

export interface TexturePack {
    colorMap: THREE.Texture,
    bumpMap: THREE.Texture,
    bumpScale: number,
    aoMap: THREE.Texture,
    emissiveMap: THREE.Texture,
    metalnessMap: THREE.Texture,
}

const loader = new THREE.TextureLoader();
const cubeLoader = new THREE.CubeTextureLoader();

export const earthTexture: Partial<TexturePack> = {
    colorMap: loader.load(earthColorMap),
    bumpMap: loader.load(earthBumpMap),
    bumpScale: 250e3,
};

export const jupiterTexture: Partial<TexturePack> = {
    colorMap: loader.load(jupiterColorMap),
};

export const marsTexture: Partial<TexturePack> = {
    colorMap: loader.load(marsColorMap),
    bumpMap: loader.load(marsBumpMap),
    bumpScale: 600e3,
};

export const sunTexture: Partial<TexturePack> = {
    colorMap: loader.load(sunColorMap),
};

export const skyBoxTexture = cubeLoader.load([
    skyboxPX,
    skyboxNX,
    skyboxPY,
    skyboxNY,
    skyboxPZ,
    skyboxNZ,
]);