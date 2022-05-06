import * as THREE from 'three';

import DebugCube from 'components/debug-cube';

const scene = new THREE.Scene();
export default scene;

const cube = new DebugCube();
scene.add(cube);
