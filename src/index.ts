import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 2;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const geometry = new THREE.BoxGeometry();
const meterial = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
});

const cube = new THREE.Mesh(geometry, meterial);
scene.add(cube);

function render(time: number) {
    time /= 1000; // convert time to seconds.

    controls.update();
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(render);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);