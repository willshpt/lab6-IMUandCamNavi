import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FlyControls } from 'three/addons/controls/FlyControls.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { InstagramFilter } from './vignetteShader.js';
import { LensDistortionShader } from './LensDistortionShader.js'
import { CopyShader } from 'three/addons/shaders/CopyShader.js';

// Quaternion Test
var cx ;
var cy ;
var cz ;
var cw ;

// create a scene 
const scene = new THREE.Scene();

let SCREEN_HEIGHT = window.innerHeight;
let SCREEN_WIDTH = window.innerWidth;

// stereo camera setup here
var stereocam = new THREE.StereoCamera()
stereocam.eyeSep = 1.5

// scene camera update
const camera = new THREE.PerspectiveCamera( 75, SCREEN_WIDTH /2/ SCREEN_HEIGHT, 0.1, 1000 );
camera.position.set(0, 0, 7);
camera.lookAt(0, 0, 0);
stereocam.update(camera)

// create a timestamp
const clock = new THREE.Clock();

// left and right renderers setup
var half_canvas_seperation = 5;

// left
const rendererLeft = new THREE.WebGLRenderer();
rendererLeft.setSize( SCREEN_WIDTH/2-half_canvas_seperation, SCREEN_HEIGHT );
rendererLeft.domElement.style.position = 'absolute';
rendererLeft.domElement.style.left = (0) + 'px';
rendererLeft.domElement.style.right = (SCREEN_WIDTH/2-half_canvas_seperation) + 'px';
rendererLeft.domElement.style.top = '0px';
document.body.appendChild( rendererLeft.domElement );

// right 
const rendererRight = new THREE.WebGLRenderer();
rendererRight.setSize(SCREEN_WIDTH/2-half_canvas_seperation, SCREEN_HEIGHT);
rendererRight.domElement.style.position = 'absolute';
rendererRight.domElement.style.left = (SCREEN_WIDTH/2+half_canvas_seperation) + 'px';
rendererRight.domElement.style.top = '0px';
document.body.appendChild(rendererRight.domElement);


// EffectComposer setup
var renderTargetLeft = new THREE.WebGLRenderTarget(SCREEN_WIDTH/2,SCREEN_HEIGHT);
var renderTargetRight = new THREE.WebGLRenderTarget(SCREEN_WIDTH/2,SCREEN_HEIGHT);

const renderPassL = new RenderPass( scene, stereocam.cameraL );
const renderPassR = new RenderPass( scene, stereocam.cameraR );

// add the RenderPasses
const composerLeft = new EffectComposer( rendererLeft, renderTargetLeft );
const composerRight = new EffectComposer( rendererRight, renderTargetRight );

composerLeft.addPass( renderPassL );
composerRight.addPass( renderPassR );

// storing camera information
var c = {
    lookat: new THREE.Vector3(0, 0, 1),
    pos: new THREE.Vector3(11, 3, 24),
    up: new THREE.Vector3(0, 1, 0),
    quat: new THREE.Quaternion(),
}

// recording camera behavior
var s = {
    pitch: 0,
    yaw: -1.5600000000000007,
    perspective: true,
    movement: false,
    moveablelights: true,
}

// dictionary of keys behavior
var k = {}

// list of keys for keyboard detection
let validKeys = [
    'w',
    'a',
    's',
    'd',
    ' ',
    'Shift',
    'ArrowUp',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
]

// set keydown and keyup listener
window.addEventListener(
    'keydown',
    (e) => {
        if (validKeys.includes(e.key)) {
            k[e.key] = true;
        }
    },
    false
)

window.addEventListener(
    'keyup',
    (e) => {
        if (validKeys.includes(e.key)) {
            k[e.key] = false;
        }
    },
    false
)

window.setInterval(() => {
    fetch("http://127.0.0.1:8001/getimu")
      .then((response) => {
            if (response.status != 500) {
                response.json().then((t) => {
                    cx = t[0]
                    cy= t[1]
                    cz=t[2]
                    cw=t[3]
                    console.log(cx,cy,cz,cw)

					// YOUR CODE:

					// set the camera quaternion.
                    // camera.rotation.set[t[0],t[1],t[2]]
                    // camera.quaternion.set(cx,cy,cz,cw)
                    // camera.updateMatrixWorld(true)
                    
                })
            }
        }
        )
      
    }, 50)

    window.setInterval(() => {
        fetch("http://127.0.0.1:8001/gesture")
          .then((response) => {
                if (response.status != 500) {
                    response.json().then((t) => {
                        if(t.localeCompare("Thumb_Up") == 0) {
                            sphere1.material.color.set({ color: 0xfc03c6 })
                        }
                        else{
                            sphere1.material.color.set({ color: 0x0000ff })
                        }
    
                        // YOUR CODE:
    
                        // set the camera quaternion.
                        // camera.rotation.set[t[0],t[1],t[2]]
                        // camera.quaternion.set(cx,cy,cz,cw)
                        // camera.updateMatrixWorld(true)
                        
                    })
                }
            }
            )
          
        }, 1000)

// vignette shader pass setup
var vignettePass = new ShaderPass(InstagramFilter);
vignettePass.uniforms[ "vignette" ].value = 0.9;
vignettePass.uniforms[ "exposure" ].value = 0.9;
vignettePass.uniforms[ "color" ].value = new THREE.Color(0.66, 1.2, 0.66);
composerLeft.addPass( vignettePass );
composerRight.addPass( vignettePass );

// lens distortion shader pass set up

var lensDistortion = new ShaderPass(LensDistortionShader);
composerLeft.addPass( lensDistortion );
composerRight.addPass( lensDistortion );

// create a cube 
//const geometry = new THREE.BoxGeometry( 1, 1, 1 );
//const material = new THREE.MeshBasicMaterial( { color: 0x5AD684 } );
//const cube = new THREE.Mesh( geometry, material );
//scene.add( cube );


// Euler Test
// var cx = camera.rotation.x;
// var cy = camera.rotation.y;
// var cz = camera.rotation.z;
//var cw = camera.rotation.w;


// BEGINNING OF CODE FROM LAB 1
//################################################
//const effect = new StereoEffect( renderer );
//effect.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
// the four spheres
const s1_geometry = new THREE.SphereGeometry( 1, 32, 16 );
const s1_material = new THREE.MeshStandardMaterial( { color: 0x00ff00 } );
const sphere1 = new THREE.Mesh( s1_geometry, s1_material );
sphere1.castShadow = true;
sphere1.receiveShadow = true;
scene.add( sphere1 );

const sphere2 = sphere1.clone();
sphere2.material = new THREE.MeshStandardMaterial( { color: 0xff0000 } );
scene.add( sphere2 );

const sphere3 = sphere1.clone();
sphere3.material = new THREE.MeshStandardMaterial( { color: 0xffa500 } );
scene.add( sphere3 );

//sphere4color = new THREE.Color(0x0000ff);

const sphere4 = sphere1.clone();
sphere4.material = new THREE.MeshStandardMaterial( { color: 0x0000ff } );
scene.add( sphere4 );

sphere1.position.x = 2;
sphere2.position.x = -2;
sphere3.position.z = 2;
sphere4.position.z = -2;

//ground plane
const geometry = new THREE.PlaneGeometry( 20, 20 );
const material = new THREE.MeshStandardMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
const plane = new THREE.Mesh( geometry, material );
plane.castShadow = false;
plane.receiveShadow = true;
scene.add( plane );
plane.rotation.x = Math.PI / 2;
plane.position.y = -1;

const loader = new GLTFLoader();

loader.load( './Jellyfish.glb', function ( gltf ) {

	scene.add( gltf.scene );
	gltf.scene.position.setX(-3);
	gltf.scene.position.setY(3);
	gltf.scene.position.setZ(0);
	gltf.scene.rotation.set(1,4,0);
	gltf.scene.scale.setScalar(.05);
	gltf.scene.traverse( function( node ) {

        if ( node.isMesh ) { node.castShadow = true; }

    } );

}, undefined, function ( error ) {
	console.error( error );
} );
loader.load( './Piano.glb', function ( gltf ) {

	scene.add( gltf.scene );
	gltf.scene.position.setX(5);
	gltf.scene.position.setY(0);
	gltf.scene.position.setZ(0);
	gltf.scene.rotation.set(0,4,0);
	gltf.scene.traverse( function( node ) {

        if ( node.isMesh ) { node.castShadow = true; }

    } );

}, undefined, function ( error ) {
	console.error( error );
} );


//Create a PointLight and turn on shadows for the light
//######################################################
const light1 = new THREE.PointLight( 0xffffff, 1, 100 );
light1.position.set( -2, 6, 4 );
light1.castShadow = true; // default false
scene.add( light1 )

const pointLightHelper1 = new THREE.PointLightHelper( light1 );
scene.add( pointLightHelper1 );


const light2 = new THREE.PointLight( 0xffffff, 1, 100 );
light2.position.set( 2, 3, 4 );
light2.castShadow = true; // default false
scene.add( light2 )

const pointLightHelper2 = new THREE.PointLightHelper( light2 );
scene.add( pointLightHelper2 );

//const light3 = new THREE.PointLight( 0xffffff, 1, 100 );
//light3.position.set( 0, 3, -4 );
//light3.castShadow = true; // default false
//scene.add( light3 )

//const pointLightHelper3 = new THREE.PointLightHelper( light3 );
//scene.add( pointLightHelper3 );

const flyControlsL = new FlyControls( camera, rendererLeft.domElement );
flyControlsL.dragToLook = true;
flyControlsL.movementSpeed = 5;
flyControlsL.rollSpeed = .25;
flyControlsL.autoForward = false;
console.log(flyControlsL);


// const flyControlsR = new FlyControls( camera, rendererRight.domElement );
// flyControlsR.dragToLook = true;
// flyControlsR.movementSpeed = 5;
// flyControlsR.rollSpeed = .25;
// flyControlsR.autoForward = false;
// console.log(flyControlsR);

window.addEventListener( 'resize', onWindowResize );
function onWindowResize() {

	SCREEN_HEIGHT = window.innerHeight;
	SCREEN_WIDTH = window.innerWidth;

	camera.aspect = SCREEN_WIDTH /2/ SCREEN_HEIGHT;
	camera.updateProjectionMatrix();

	rendererLeft.setSize( (SCREEN_WIDTH/2 - half_canvas_seperation), SCREEN_HEIGHT );
	document.body.appendChild( rendererLeft.domElement );

	rendererRight.setSize((SCREEN_WIDTH/2 - half_canvas_seperation), SCREEN_HEIGHT);
	rendererRight.domElement.style.left = (SCREEN_WIDTH/2 + half_canvas_seperation) + 'px';

}

function animate() {

    //cy = cy + 0.1;
   //camera.rotation.set(cx,cy,cz);

    camera.quaternion.set(cx,cy,cz,cw);
	// camera.quaternion.normalize();


    camera.updateWorldMatrix(true);
    // console.log(camera.rotation)
    // console.log(camera.quaternion)

	const delta = clock.getDelta();
	stereocam.update(camera)
	requestAnimationFrame( animate );

	// call camera navigation function
	// doMovement(camera);
    //flyControlsL.update( delta );
	// flyControlsR.update( delta );

	// update sphere motion
	//cube.rotation.x += delta;
	//cube.rotation.y += delta;

	// render both EffectComposers
	rendererLeft.setRenderTarget(renderTargetLeft);
	composerLeft.render();

    rendererRight.setRenderTarget(renderTargetRight);
    composerRight.render();

}

// YOUR CODE:

// some useful variable to use
var scaling = 0.1
var xoff = 0
var yoff = 0

// function doMovement(camera) {

// 	// four arrow behaviors, change camera rotation, and thus the lookat point of camera.
// 	// space and shift are zoom in and out
// 	// wsad can be use to change camera position

// 	// Arrow Key Control
// 	// Note: we want to update the camera yaw and pitch information here
// 	// Note: when pitch is over 90 degree, you want to keep it as 90, and smaller than -90 need to be -90. 
// 	let r = 0.5
    
//     if (k['ArrowUp'] == true) yoff -= r
//     if (k['ArrowDown'] == true) yoff += r

//     if (k['ArrowLeft'] == true) xoff += r
//     if (k['ArrowRight'] == true) xoff -= r

//     xoff *= scaling
//     yoff *= scaling

//     s.yaw += xoff
//     s.pitch += yoff

//     if (s.pitch > Math.PI / 2 - 0.01) s.pitch = Math.PI / 2 - 0.01
//     if (s.pitch < -(Math.PI / 2) + 0.01) s.pitch = -Math.PI / 2 + 0.01

// 	// maybe keep here.
//     c.lookat.x = -Math.cos(s.pitch) * Math.cos(s.yaw)
//     c.lookat.z = -Math.cos(s.pitch) * Math.sin(-s.yaw)
//     c.lookat.y = -Math.sin(s.pitch)

//     let mScaling = 0.1

//     c.lookat.normalize()

// 	// Space and Shift Control
// 	// zoom in and out, change z of camera pos.

// 	if (k[' '] == true) c.pos.z-=mScaling
// 	if (k['Shift'] == true) c.pos.z+=mScaling

// 	// WSAD Control
// 	// change camera position, change x and y of camera pos.

//     if (k['w'] == true) c.pos.y-=mScaling
//     if (k['s'] == true) c.pos.y+=mScaling

//     if (k['a'] == true) c.pos.x-=mScaling
//     if (k['d'] == true) c.pos.x+=mScaling

// 	// update camera position and lookat point
// 	// Note: the lookat point need to combine c.lookat and c.pos.

//     camera.position.copy(c.pos)
//     let templookat = new THREE.Vector3().addVectors(c.lookat, c.pos)
//     camera.lookAt(templookat)
// }

animate();