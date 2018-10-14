import { scene } from './scene.js';

const plane = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(10000, 10000),
  new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0.5, transparent: true })
);
plane.position.y = 100;
plane.rotation.x = -Math.PI / 2;
scene.add(plane);