import { scene } from './scene.js';
import { group } from './group.js';
import { materials } from './materials.js';

// converter http://gero3.github.io/facetype.js/
const fontLoad = async () => {
  return new Promise((resolve) => {
    // helvetiker, optimer, gentilis, droid sans, droid seri;
    // normal bold;
    // const url = 'fonts/optimer_bold.typeface.json';
    // const url = 'fonts/ubuntu_regular.typeface.json';
    // const url = 'fonts/ubuntu_bold.typeface.json';
    // const url = 'fonts/mali_regular.typeface.json';
    // const url = 'fonts/h&b_regular.typeface.json';
    // const url = 'fonts/habana_regular.typeface.json';
    const url = 'fonts/Happy brown cat_Regular.json';
    // const url = 'fonts/Happy brown cat shadow_Regular.json';
    new THREE.FontLoader().load(url, function (response) {
      resolve(response);
    });
  });
};

init();

async function init() {
  const font = await fontLoad();

  const height = 10; // depth for text
  const size = 50;

  const textGeo = new THREE.TextGeometry('ALLMAX', {
    font: font,
    size: size,
    height: height,
    curveSegments: 4,
    bevelThickness: 2,
    bevelSize: 1.5,
    bevelEnabled: false, // bold
  });

  textGeo.computeBoundingBox();
  textGeo.computeVertexNormals();

  // "fix" side normals by removing z-component of normals for side faces
  // (this doesn't work well for beveled geometry as then we lose nice curvature around z-axis)
  // if (true) {

  let triangleAreaHeuristics = 0.2 * (height * size);

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

      // if (s > triangleAreaHeuristics) {
      for (let j = 0; j < face.vertexNormals.length; j++) {
        face.vertexNormals[j].copy(face.normal);
      }
      // }
    }
  }
  // }

  const centerOffset = -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);
  const textGeoBuffer = new THREE.BufferGeometry().fromGeometry(textGeo);

  const mainMesh = new THREE.Mesh(textGeoBuffer, materials);

  mainMesh.position.x = centerOffset;
  mainMesh.position.y = 30;
  mainMesh.position.z = 0;
  mainMesh.rotation.x = 0;
  mainMesh.rotation.y = 0;
  group.add(mainMesh);

  // const mirror = true;
  // if (mirror) {
  //   const mirrorMesh = new THREE.Mesh(textGeoBuffer, materials);

  //   mirrorMesh.position.x = centerOffset;
  //   mirrorMesh.position.y = -30;
  //   mirrorMesh.position.z = height;

  //   mirrorMesh.rotation.x = Math.PI;
  //   mirrorMesh.rotation.y = Math.PI * 2;

  //   group.add(mirrorMesh);
  // }
}