// SCENE
export const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
scene.fog = new THREE.Fog(0x000000, 250, 1400);

// LIGHTS
let dirLight = new THREE.DirectionalLight(0xffffff, 0.125);
dirLight.position.set(0, 0, 1).normalize();
scene.add(dirLight);

let pointLight = new THREE.PointLight(0xffffff, 1.5);
pointLight.position.set(0, 100, 90);
scene.add(pointLight);

// Get text from hash
let hash = document.location.hash.substr(1);
pointLight.color.setHSL(Math.random(), 1, 0.5);

