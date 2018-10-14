if (WEBGL.isWebGLAvailable() === false) {
  document.body.appendChild(WEBGL.getWebGLErrorMessage());
}

THREE.Cache.enabled = true;

let container;
let stats;
let permalink;
let hex;
let color;
let camera;
let cameraTarget;
let scene;
let renderer;
let group;
let textMesh1;
let textMesh2;
let textGeo;
let materials;
let firstLetter = true;

let text = 'three.js';
let height = 20;
let size = 70;
let hover = 30;
let curveSegments = 4;
let bevelThickness = 2;
let bevelSize = 1.5;
let bevelSegments = 3;
let bevelEnabled = true;
let font;
let fontName = 'optimer'; // helvetiker, optimer, gentilis, droid sans, droid seri;
let fontWeight = 'bold'; // normal bol;

let mirror = true;

let fontMap = {
  'helvetiker': 0,
  'optimer': 1,
  'gentilis': 2,
  'droid/droid_sans': 3,
  'droid/droid_serif': 4
};

let weightMap = {
  'regular': 0,
  'bold': 1
};

let reverseFontMap = [];
let reverseWeightMap = [];

for (const i in fontMap) {
  reverseFontMap[fontMap[i]] = i;
}

for (const i in weightMap) {
  reverseWeightMap[weightMap[i]] = i;
}

let targetRotation = 0;
let targetRotationOnMouseDown = 0;
let mouseX = 0;
let mouseXOnMouseDown = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let fontIndex = 1;

init();

animate();

function decimalToHex(d) {
  let hex = Number(d).toString(16);
  hex = '000000'.substr(0, 6 - hex.length) + hex;
  return hex.toUpperCase();
}

function init() {
  container = document.createElement('div');
  document.body.appendChild(container);
  permalink = document.getElementById('permalink');

  // CAMERA
  camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 1500);
  camera.position.set(0, 400, 700);
  cameraTarget = new THREE.Vector3(0, 150, 0);

  // SCENE
  scene = new THREE.Scene();
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
  if (hash.length !== 0) {
    let colorhash  = hash.substring(0, 6);
    let fonthash   = hash.substring(6, 7);
    let weighthash = hash.substring(7, 8);
    let bevelhash  = hash.substring(8, 9);
    let texthash   = hash.substring(10);
    hex = colorhash;
    pointLight.color.setHex(parseInt(colorhash, 16));
    fontName = reverseFontMap[parseInt(fonthash, 10)];
    fontWeight = reverseWeightMap[parseInt(weighthash, 10)];
    bevelEnabled = parseInt(bevelhash, 10);
    text = decodeURI(texthash);
    updatePermalink();

  } else {
    pointLight.color.setHSL(Math.random(), 1, 0.5);
    hex = decimalToHex(pointLight.color.getHex());

  }
  materials = [
    new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true }), // front
    new THREE.MeshPhongMaterial({ color: 0xffffff }) // side
  ];

  group = new THREE.Group();
  group.position.y = 100;
  scene.add(group);

  loadFont();

  let plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(10000, 10000),
    new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0.5, transparent: true })
  );
  plane.position.y = 100;
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);

  // RENDERER
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  // STATS
  stats = new Stats();
  container.appendChild(stats.dom);

  // EVENTS
  document.addEventListener('mousedown', onDocumentMouseDown, false);
  document.addEventListener('touchstart', onDocumentTouchStart, false);
  document.addEventListener('touchmove', onDocumentTouchMove, false);
  document.addEventListener('keypress', onDocumentKeyPress, false);
  document.addEventListener('keydown', onDocumentKeyDown, false);

  document.getElementById('color').addEventListener('click', function() {
    pointLight.color.setHSL(Math.random(), 1, 0.5);
    hex = decimalToHex(pointLight.color.getHex());
    updatePermalink();
  }, false);
  document.getElementById('font').addEventListener('click', function() {
    fontIndex++;
    fontName = reverseFontMap[fontIndex % reverseFontMap.length];
    loadFont();
  }, false);
  document.getElementById('weight').addEventListener('click', function() {
    if (fontWeight === 'bold') {
      fontWeight = 'regular';
    } else {
      fontWeight = 'bold';
    }
    loadFont();
  }, false);
  document.getElementById('bevel').addEventListener('click', function() {
    bevelEnabled = !bevelEnabled;
    refreshText();
  }, false);
  //
  window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

//
function boolToNum(b) {
  return b ? 1 : 0;
}

function updatePermalink() {
  let link = hex + fontMap[fontName] + weightMap[fontWeight] + boolToNum(bevelEnabled) + '#' + encodeURI(text);
  permalink.href = '#' + link;
  window.location.hash = link;
}

function onDocumentKeyDown(event) {
  if (firstLetter) {
    firstLetter = false;
    text = '';
  }
  let keyCode = event.keyCode;
  // backspace
  if (keyCode === 8) {
    event.preventDefault();
    text = text.substring(0, text.length - 1);
    refreshText();
    return false;
  }
}

function onDocumentKeyPress(event) {
  let keyCode = event.which;
  // backspace
  if (keyCode === 8) {
    event.preventDefault();
  } else {
    let ch = String.fromCharCode(keyCode);
    text += ch;
    refreshText();
  }
}

function loadFont() {
  let loader = new THREE.FontLoader();
  loader.load('fonts/' + fontName + '_' + fontWeight + '.typeface.json', function (response) {
    font = response;
    refreshText();
  });
}

function createText() {
  textGeo = new THREE.TextGeometry(text, {
    font: font,
    size: size,
    height: height,
    curveSegments: curveSegments,
    bevelThickness: bevelThickness,
    bevelSize: bevelSize,
    bevelEnabled: bevelEnabled
  });
  textGeo.computeBoundingBox();
  textGeo.computeVertexNormals();
  // "fix" side normals by removing z-component of normals for side faces
  // (this doesn't work well for beveled geometry as then we lose nice curvature around z-axis)
  if (!bevelEnabled) {
    let triangleAreaHeuristics = 0.1 * (height * size);
    for (let i = 0; i < textGeo.faces.length; i++) {
      let face = textGeo.faces[i];
      if (face.materialIndex === 1) {
        for (let j = 0; j < face.vertexNormals.length; j++) {
          face.vertexNormals[j].z = 0;
          face.vertexNormals[j].normalize();
        }
        let va = textGeo.vertices[face.a];
        let vb = textGeo.vertices[face.b];
        let vc = textGeo.vertices[face.c];
        let s = THREE.GeometryUtils.triangleArea(va, vb, vc);
        if (s > triangleAreaHeuristics) {
          for (let j = 0; j < face.vertexNormals.length; j++) {
            face.vertexNormals[j].copy(face.normal);
          }
        }
      }
    }
  }
  let centerOffset = -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);
  textGeo = new THREE.BufferGeometry().fromGeometry(textGeo);
  textMesh1 = new THREE.Mesh(textGeo, materials);
  textMesh1.position.x = centerOffset;
  textMesh1.position.y = hover;
  textMesh1.position.z = 0;
  textMesh1.rotation.x = 0;
  textMesh1.rotation.y = Math.PI * 2;
  group.add(textMesh1);
  if (mirror) {
    textMesh2 = new THREE.Mesh(textGeo, materials);
    textMesh2.position.x = centerOffset;
    textMesh2.position.y = -hover;
    textMesh2.position.z = height;
    textMesh2.rotation.x = Math.PI;
    textMesh2.rotation.y = Math.PI * 2;
    group.add(textMesh2);
  }
}

function refreshText() {
  updatePermalink();
  group.remove(textMesh1);
  if (mirror) group.remove(textMesh2);
  if (!text) return;
  createText();
}

function onDocumentMouseDown(event) {
  event.preventDefault();
  document.addEventListener('mousemove', onDocumentMouseMove, false);
  document.addEventListener('mouseup', onDocumentMouseUp, false);
  document.addEventListener('mouseout', onDocumentMouseOut, false);
  mouseXOnMouseDown = event.clientX - windowHalfX;
  targetRotationOnMouseDown = targetRotation;
}

function onDocumentMouseMove(event) {
  mouseX = event.clientX - windowHalfX;
  targetRotation = targetRotationOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.02;
}

function onDocumentMouseUp(event) {
  document.removeEventListener('mousemove', onDocumentMouseMove, false);
  document.removeEventListener('mouseup', onDocumentMouseUp, false);
  document.removeEventListener('mouseout', onDocumentMouseOut, false);
}

function onDocumentMouseOut(event) {
  document.removeEventListener('mousemove', onDocumentMouseMove, false);
  document.removeEventListener('mouseup', onDocumentMouseUp, false);
  document.removeEventListener('mouseout', onDocumentMouseOut, false);
}

function onDocumentTouchStart(event) {
  if (event.touches.length === 1) {
    event.preventDefault();
    mouseXOnMouseDown = event.touches[0].pageX - windowHalfX;
    targetRotationOnMouseDown = targetRotation;
  }
}

function onDocumentTouchMove(event) {
  if (event.touches.length === 1) {
    event.preventDefault();
    mouseX = event.touches[0].pageX - windowHalfX;
    targetRotation = targetRotationOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.05;
  }
}

//
function animate() {
  requestAnimationFrame(animate);
  render();
  stats.update();
}

function render() {
  group.rotation.y += (targetRotation - group.rotation.y) * 0.05;
  camera.lookAt(cameraTarget);
  renderer.clear();
  renderer.render(scene, camera);
}
