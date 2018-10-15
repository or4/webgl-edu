export const materials = [
  // new THREE.MeshBasicMaterial({ color: 0xFFFF00 }),
  new THREE.MeshPhongMaterial({
    color: 0xffffff,
    flatShading: true,
    wireframe: true
  }), // front
  new THREE.MeshPhongMaterial({ color: 0xffffff }) // side
];