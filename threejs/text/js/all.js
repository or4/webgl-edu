import { scene } from './scene.js';
import { camera, cameraTarget } from './camera.js';
import { renderer } from './renderer.js';
import { targetRotation } from './dom/index.js';
import { group } from './group.js';
import * as plane from './plane.js';


THREE.Cache.enabled = true;

let textMesh1;
let textMesh2;
let textGeo;
let materials;

let text = 'Yandex';
let height = 20; // depth for text
let size = 70;
let bevelEnabled = true; // bold

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

let fontIndex = 1;

init();

animate();

function init() {
  materials = [
    new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true }), // front
    new THREE.MeshPhongMaterial({ color: 0xffffff }) // side
  ];


  loadFont();

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
    curveSegments: 4,
    bevelThickness: 2,
    bevelSize: 1.5,
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
  textMesh1.position.y = 30; // hover
  textMesh1.position.z = 0;
  textMesh1.rotation.x = 0;
  textMesh1.rotation.y = Math.PI * 2;
  group.add(textMesh1);
  if (mirror) {
    textMesh2 = new THREE.Mesh(textGeo, materials);
    textMesh2.position.x = centerOffset;
    textMesh2.position.y = -30; // hover
    textMesh2.position.z = height;
    textMesh2.rotation.x = Math.PI;
    textMesh2.rotation.y = Math.PI * 2;
    group.add(textMesh2);
  }
}

function refreshText() {
  group.remove(textMesh1);
  if (mirror) group.remove(textMesh2);
  if (!text) return;
  createText();
}


//
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
