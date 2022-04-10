import * as THREE from 'three';

const scene = new THREE.Scene();


const geometry = new THREE.BoxGeometry();
const meterial = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
});

const cube = new THREE.Mesh(geometry, meterial);
scene.add(cube);

export default scene;