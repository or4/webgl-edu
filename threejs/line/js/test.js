let camera;
let scene;
let renderer;
let geometry;
let material;
let mesh;

init();
animate();

function initCamera() {

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 7, 100);
  // camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
  // camera.position.z = 1;
  camera.position.set(0, 0, 100);
  camera.lookAt(0, 0, 0);
}

function initScene() {
  scene = new THREE.Scene();
  material = new THREE.LineBasicMaterial({ color: 0x0000ff });

  geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3(-10, 0, 0));
  geometry.vertices.push(new THREE.Vector3(0, 10, 0));
  geometry.vertices.push(new THREE.Vector3(10, 0, 0));

  line = new THREE.Line(geometry, material);
  scene.add(line);
}

function initRender() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth / 1, window.innerHeight / 1);
}

function initDocument() {
  document.body.appendChild(renderer.domElement);
}

function init() {
  initCamera();

  initScene();

  initRender();

  initDocument();
}

function animate() {

  requestAnimationFrame(animate);

  // mesh.rotation.x += 0.01;
  // mesh.rotation.y += 0.02;

  renderer.render(scene, camera);

}