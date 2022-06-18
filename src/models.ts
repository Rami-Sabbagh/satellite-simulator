import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import satellite from 'assets/satellite/Satellite.glb';

const gltfLoader = new GLTFLoader();
export const satelliteModel = gltfLoader.loadAsync(satellite);
