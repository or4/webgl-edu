import { scene } from './scene.js';
import { group } from './group.js';
import { materials } from './materials.js';


const fontLoad = async () => {
  return new Promise((resolve) => {
    const fontName = 'optimer'; // helvetiker, optimer, gentilis, droid sans, droid seri;
    const fontWeight = 'bold'; // normal bold;
    new THREE.FontLoader().load('fonts/' + fontName + '_' + fontWeight + '.typeface.json', function (response) {
      resolve(response);
    });
  });
};

init();

async function init() {
  const font = await fontLoad();

  const mirror = true;
  const text = 'Yandex';
  const height = 20; // depth for text
  const size = 70;
  const bevelEnabled = true; // bold

  const textGeo = new THREE.TextGeometry(text, {
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
  const textGeoBuffer = new THREE.BufferGeometry().fromGeometry(textGeo);

  const mainMesh = new THREE.Mesh(textGeoBuffer, materials);
  mainMesh.position.x = centerOffset;
  mainMesh.position.y = 30; // hover
  mainMesh.position.z = 0;
  mainMesh.rotation.x = 0;
  mainMesh.rotation.y = Math.PI * 2;
  group.add(mainMesh);

  if (mirror) {
    const mirrorMesh = new THREE.Mesh(textGeoBuffer, materials);
    mirrorMesh.position.x = centerOffset;
    mirrorMesh.position.y = -30; // hover
    mirrorMesh.position.z = height;
    mirrorMesh.rotation.x = Math.PI;
    mirrorMesh.rotation.y = Math.PI * 2;
    group.add(mirrorMesh);
  }
}