var camera, scene, renderer;
var geometry, material, mesh;

init();
animate();

function initCamera() {
	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
	camera.position.z = 1;
}

function initScene() {
	scene = new THREE.Scene();
	geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
	material = new THREE.MeshNormalMaterial( );

	mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );
}

function initRender() {
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize( window.innerWidth / 1, window.innerHeight / 1, false );
}

function initDocument() {
  document.body.appendChild( renderer.domElement );
}

function init() {
  initCamera();

  initScene();

  initRender();

  initDocument();
}

function animate() {

	requestAnimationFrame( animate );

	mesh.rotation.x += 0.01;
	mesh.rotation.y += 0.02;

	renderer.render( scene, camera );

}