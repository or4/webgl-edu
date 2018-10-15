
// SCENE
export const scene = new THREE.Scene();
scene.background = new THREE.Color(0xFFFFFF);
// scene.fog = new THREE.Fog(0x000000, 250, 1400);

// // LIGHTS
// let dirLight = new THREE.DirectionalLight(0xffffff, 1.125);
// dirLight.position.set(0, 0, 1).normalize();
// scene.add(dirLight);

let pointLight = new THREE.PointLight(0xff0000, 1.5);
pointLight.position.set(0, 100, 90);
scene.add(pointLight);

// Get text from hash
// const color = Math.random();
// // const color = 0.6640553208162103;
// pointLight.color.setHSL(color, 1, 0.5);
