import { scene } from './scene.js';
import { group } from './group.js';
import { materials } from './materials.js';


init();

async function init() {
  const geometry = new THREE.SphereGeometry(30, 15, 15);

  geometry.computeBoundingBox();
  geometry.computeVertexNormals();


  const centerOffset = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
  const buffer = new THREE.BufferGeometry().fromGeometry(geometry);

  const mesh = new THREE.Mesh(buffer, materials);

  mesh.position.x = centerOffset;
  mesh.position.y = 30;
  mesh.position.z = 0;
  mesh.rotation.x = 0;
  mesh.rotation.y = 0;
  group.add(mesh);
}