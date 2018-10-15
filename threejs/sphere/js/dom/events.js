import { camera, cameraTarget } from './../camera.js';
import { renderer } from './../renderer.js';

export const targetRotation = { value: 0 };
let targetRotationOnMouseDown = 0;
let mouseX = 0;
let mouseXOnMouseDown = 0;

// EVENTS
document.addEventListener('mousedown', onDocumentMouseDown, false);
document.addEventListener('touchstart', onDocumentTouchStart, false);
document.addEventListener('touchmove', onDocumentTouchMove, false);


function onDocumentMouseDown(event) {
  event.preventDefault();
  document.addEventListener('mousemove', onDocumentMouseMove, false);
  document.addEventListener('mouseup', onDocumentMouseUp, false);
  mouseXOnMouseDown = event.clientX - window.innerWidth / 2;
  targetRotationOnMouseDown = targetRotation.value;
}

function onDocumentMouseMove(event) {
  const mouseX = event.clientX - window.innerWidth / 2;
  targetRotation.value = targetRotationOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.02;
}

function onDocumentMouseUp(event) {
  document.removeEventListener('mousemove', onDocumentMouseMove, false);
  document.removeEventListener('mouseup', onDocumentMouseUp, false);
}


function onDocumentTouchStart(event) {
  if (event.touches.length === 1) {
    event.preventDefault();
    mouseXOnMouseDown = event.touches[0].pageX - window.innerWidth / 2;
    targetRotationOnMouseDown = targetRotation.value;
  }
}

function onDocumentTouchMove(event) {
  if (event.touches.length === 1) {
    event.preventDefault();
    const mouseX = event.touches[0].pageX - window.innerWidth / 2;
    targetRotation.value = targetRotationOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.05;
  }
}