// CAMERA
export const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 1500);
camera.position.set(0, 400, 700);

export const cameraTarget = new THREE.Vector3(0, 150, 0);
