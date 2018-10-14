import { scene } from './scene.js';
import { camera, cameraTarget } from './camera.js';
import { renderer } from './renderer.js';
import { group } from './group.js';
import { targetRotation } from './dom/index.js';

animate();

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  group.rotation.y += (targetRotation.value - group.rotation.y) * 0.05;
  camera.lookAt(cameraTarget);
  renderer.clear();
  renderer.render(scene, camera);
}
