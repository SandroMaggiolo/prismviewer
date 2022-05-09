# Prism Viewer library
[![NPM Package][npm]][npm-url]

#### JavaScript 3D library for charts ####
Threejs based library for representing three-dimensional data in HTML pages with JavaScript. This project was started by Sandro Maggiolo Ruiz for the final thesis at the University of Alcalá on 2022.

Librería basada en Threejs para representar información tridimensional en páginas HTML con JavaScript. Este proyecto fue iniciado por Sandro Maggiolo Ruiz para el trabajo de fin de grado en la Universidad de Alcalá en 2022.

========

### Usage ###

This code creates a scene, a camera, and a geometric cube, and it adds the cube to the scene. It then creates a `WebGL` renderer for the scene and camera, and it adds that viewport to the `document.body` element. Finally, it animates the cube within the scene for the camera.

```javascript
import * as THREE from 'three';

// init

const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
camera.position.z = 1;

const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
const material = new THREE.MeshNormalMaterial();

const mesh = new THREE.Mesh( geometry, material );
scene.add( mesh );

const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animation );
document.body.appendChild( renderer.domElement );

// animation

function animation( time ) {

	mesh.rotation.x = time / 2000;
	mesh.rotation.y = time / 1000;

	renderer.render( scene, camera );

}
```