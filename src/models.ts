import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { loadingManager } from './loading-manager';

import satellite from 'assets/satellite/Satellite.glb';

const gltfLoader = new GLTFLoader(loadingManager);
export const satelliteModel = gltfLoader.loadAsync(satellite);
