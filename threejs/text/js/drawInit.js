import { scene } from './scene.js';
import { group } from './group.js';
import { materials } from './materials.js';

let textMesh1;
let textMesh2;
let textGeo;

let text = 'Yandex';
let height = 20; // depth for text
let size = 70;
let bevelEnabled = true; // bold

let font;

let mirror = true;


init();

function init() {
  const fontName = 'optimer'; // helvetiker, optimer, gentilis, droid sans, droid seri;
  const fontWeight = 'bold'; // normal bol;
  const loader = new THREE.FontLoader();
  loader.load('fonts/' + fontName + '_' + fontWeight + '.typeface.json', function (response) {
    font = response;
    refreshText();
  });
}

function refreshText() {
  group.remove(textMesh1);
  if (mirror) group.remove(textMesh2);
  if (!text) return;
  createText();
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

  const centerOffset = -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);
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