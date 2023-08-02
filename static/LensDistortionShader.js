import * as THREE from 'three'

export const LensDistortionShader = {

  // YOUR CODE:

  // change the uniforms values, play with it and try to understand them.
  // also be careful about all the uniforms types, 

  uniforms: {
    'tDiffuse': { value: 0 }, // sampler2D
    // 'uK0': { value: null }, // radial distortion coeff // THREE.Vector2
    // 'uCc': { value: null }, // setted principal point // THREE.Vector2
    // 'uFc': { value: null },  // focal length, zoom in and out // THREE.Vector2
    'uK0': { value: new THREE.Vector2(1, 1) }, // radial distortion coeff 0
    'uCc': { value: new THREE.Vector2(0, 0) }, // principal point, setted
    'uFc': { value: new THREE.Vector2(0.5, 0.5) },  // focal length
    'uAlpha_c': { value: 0 }, // skew coeff
  },

  // YOUR CODE:

  // Same as how you set in Vignette Shader

  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }`,

  // YOUR CODE:

  // Understanding Example: http://marcodiiga.github.io/radial-lens-undistortion-filtering
  // Follow the steps below in the main() of fragmentShader

  // STEP 1: Ranging r_d in the example above from (-1,1)
  // rd can get from xy of texture coord.

  // STEP 2: Distortion
  // achieve with the equation given in README.md
  // recommend of using vec3 of this step result for later use
  // you can make the z into 1.

  // STEP 3: Projection
  // project the distortion result (.xy) you got range from (0,1)
  // note: do not touch the z if you get a vec3 result from your last step

  // STEP 4: gl_FragColor update
  // make the result color to gl_FragColor
  // note: we only want it from the texture xy from (0,1)
  // other parts, for better observation, we can choose another special color and assign. (using if else statement)


  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform vec2 uK0; // radial distortion coeff 
    uniform vec2 uCc; // setted principal point
    uniform vec2 uFc; // focal length, zoom in and out
    uniform float uAlpha_c; // skew coeff, maybe do need to use here
    varying vec2 vUv;
    void main() {

      vec2 Xn = 2. * ( vUv.st - .5 ); // -1..1

      vec3 Xd = vec3(( 1. + uK0 * dot( Xn, Xn ) ) * Xn, 1.); // distorted 

      mat3 KK = mat3(
        vec3(uFc.x, 0., 0.),
        vec3(uAlpha_c * uFc.x, uFc.y, 0.),
        vec3(uCc.x, uCc.y, 1.)
      );

      vec2 Xp = ( KK * Xd ).xy * .5 + .5; // projected; into 0..1 

      if ( Xp.x >= 0. && Xp.x <= 1. && Xp.y >= 0. && Xp.y <= 1. ) {
        gl_FragColor = texture2D( tDiffuse, Xp );
      }
      else{
        gl_FragColor = vec4(0,1,0,1);
      }
    }
  `
};