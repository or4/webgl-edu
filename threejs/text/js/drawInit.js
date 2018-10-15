import { scene } from './scene.js';
import { group } from './group.js';
import { materials } from './materials.js';

// font converter http://gero3.github.io/facetype.js/
const fontLoad = async () => {
  return new Promise((resolve) => {
    const font = {
      depth: 10,
      size: 50,
      bold: false,
    };
    const url = [
      // 'fonts/optimer_bold.typeface.json',
      // 'fonts/ubuntu_regular.typeface.json',
      // 'fonts/ubuntu_bold.typeface.json',
      // 'fonts/mali_regular.typeface.json',
      // 'fonts/h&b_regular.typeface.json',
      // 'fonts/habana_regular.typeface.json',
      // 'fonts/Happy brown cat_Regular.json',
      'fonts/Happy brown cat shadow_Regular.json'
    ][0];
    new THREE.FontLoader().load(url, function (response) {
      font.data = response;
      resolve(font);
    });
  });
};

init();

async function init() {
  const font = await fontLoad();

  const textGeo = new THREE.TextGeometry('ALLMAX', {
    font: font.data,
    size: font.size,
    height: font.depth,
    curveSegments: 4,
    bevelThickness: 2,
    bevelSize: 1.5,
    bevelEnabled: font.bold,
  });

  textGeo.computeBoundingBox();
  textGeo.computeVertexNormals();

  // "fix" side normals by removing z-component of normals for side faces
  // (this doesn't work well for beveled geometry as then we lose nice curvature around z-axis)
  if (font.bold) {
    let triangleAreaHeuristics = 0.2 * (font.depth * font.size);

    for (let i = 0; i < textGeo.faces.length; i++) {
      let face = textGeo.faces[i];

      if (face.materialIndex === 1) {

        for (let j = 0; j < face.vertexNormals.length; j++) {
          face.vertexNormals[j].z = 0;
          face.vertexNormals[j].normalize();
        }

        const va = textGeo.vertices[face.a];
        const vb = textGeo.vertices[face.b];
        const vc = textGeo.vertices[face.c];
        const s = THREE.GeometryUtils.triangleArea(va, vb, vc);

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
  mainMesh.position.y = 30;
  mainMesh.position.z = 0;
  mainMesh.rotation.x = 0;
  mainMesh.rotation.y = 0;
  group.add(mainMesh);
}