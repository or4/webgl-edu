import { camera, cameraTarget } from './../camera.js';
import { renderer } from './../renderer.js';

if (WEBGL.isWebGLAvailable() === false) {
  document.body.appendChild(WEBGL.getWebGLErrorMessage());
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}, false);

// CONTAINER
export const container = document.createElement('div');
document.body.appendChild(container);
container.appendChild(renderer.domElement);
