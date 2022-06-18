import * as THREE from 'three';

import earthColorMap from 'assets/earth/color-map.jpg';
import earthBumpMap from 'assets/earth/bump-map.jpg';
import jupiterColorMap from 'assets/jupiter/color-map.jpg';
import marsColorMap from 'assets/mars/color-map.jpg';
import marsBumpMap from 'assets/mars/bump-map.jpg';
import sunColorMap from 'assets/sun/color-map.jpg';

import skyboxNX from 'assets/skybox/nx.jpg';
import skyboxNY from 'assets/skybox/ny.jpg';
import skyboxNZ from 'assets/skybox/nz.jpg';
import skyboxPX from 'assets/skybox/px.jpg';
import skyboxPY from 'assets/skybox/py.jpg';
import skyboxPZ from 'assets/skybox/pz.jpg';

import lensflareBase from 'assets/lensflare/lensflare0_alpha.png';
import lensflareExtra from 'assets/lensflare/lensflare3.png';

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

export const lensflareBaseTexture = loader.load(lensflareBase);
export const lensflareExtraTexture = loader.load(lensflareExtra);