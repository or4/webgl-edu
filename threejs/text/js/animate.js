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
  const speed = 0.015;
  let value = (targetRotation.value - group.rotation.y) * 0.05;
  if (value < 0) {
    targetRotation.value -= speed;
  } else if (value > 0 || value === 0) {
    targetRotation.value += speed;
  }

  value = (targetRotation.value - group.rotation.y) * 0.05;
  group.rotation.y += value;

  camera.lookAt(cameraTarget);
  renderer.clear();
  renderer.render(scene, camera);
}
