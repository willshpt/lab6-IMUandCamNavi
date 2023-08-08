import * as THREE from 'three';

const InstagramFilter = {

    // YOUR CODE:

    // change the uniforms values, play with it and try to understand them.
    // also be careful about all the uniforms types, 
    // for example, color should be a THREE.Color type, 
    // so you can assign it like "color": { value: new THREE.Color(0.66, 1.2, 0.66) }.

    uniforms: {
    "tDiffuse": { value: null }, // sampler2D
    "resolution": { type: "v2", value: new THREE.Vector2() },
    "vignette": { value: null }, // vignetting factor, float
    "exposure": { value: null }, // float
    "color": { value: new THREE.Color() }, // THREE.Color
    },

    // YOUR CODE:

    // write the main, 
    // in vertex shader, assign the gl_Position and vUv
    // find example at: https://threejs.org/docs/#api/en/renderers/webgl/WebGLProgram.

    vertexShader: [

        "varying vec2 vUv;", // texture coordinate

        "void main() {",
            "vUv = uv;", // temp from copyshader
            "gl_Position = projectionMatrix * viewMatrix * vec4( position, 1.0 );", // temp from copyshader

        "}"

    ].join( "\n" ),

    // YOUR CODE:

    // Similar example at: https://stackoverflow.com/questions/52762754/how-to-render-a-circular-vignette-with-glsl
    // try to understand the code and how the below steps 1,2,and 3 are achieved.
    // the plotting for color can be assigned to gl_FragColor.xyz (like color.rgb in the example)

    fragmentShader: [

    "uniform sampler2D tDiffuse;", // a 2D texture
    "uniform vec2 resolution;",
    "uniform float vignette;", // the size of the dark blending
    "uniform float exposure;", // the size of the exposure light
    "uniform vec3 color;", // color exposure into
    "varying vec2 vUv;", // texture coordinate

        "void main() {",
        //"vec4 texel = texture2D( tDiffuse, vUv );", // temp from copyshader
        //"gl_FragColor = texel;", // temp from copyshader
            // STEP 1: Map the texture2D
            // texture2D(sample2D sampler, vec2 coord) can use the texture coordinate 'coord',
            // to perform a texture lookup within 2D texture currently bound to 'sampler'.
            // the texture2D can thus be assign to gl_FragColor.
        "vec4 texel = texture2D( tDiffuse, vUv);",
        "gl_FragColor = texel;",
        //"gl_FragColor.rgb = color;",
            // STEP 2: Map the position
            // calculate the relative position
            // make [0,1] range from [-1,1]
        "vec2 position = (2.0*vUv.xy) - vec2(1.0, 1.0);",
        // "vec2 position = (gl_FragCoord.xy/resolution) - vec2(0.5, 0.5);",
        // "position *= resolution.x / resolution.y;",
            // STEP 3: Add Vignette Mask
            // make a vignette effect by assign a vignette mask float 
            // (name it whatever you like, here i'll call it vig_mask)
            // and update your gl_FragColor with vig_mask
            // you should see a center bright and surrounding original rendering result
        "float vig_mask  = clamp(1.0 - length(position)*vignette, 0.0, 1.0);",
        // "float vignette2 = smoothstep(vignette, vignette-exposure, length(position));",
        // "float vig_mask = (vignette2);",
        //"gl_FragColor = vec4((color.rgb * vec3(vig_mask)), 1.0);",
            // STEP 4: Compensate for Vignette Effect
            // now try to inverse the above step of updating gl_FragColor with 1/vig_mask.
            // which also means if you have both updates of gl_FragColor, you will get a flat even colored image
            // now comment out the code of Step 3 update,
            // you can see a image with the inner original, outer bright image
            // CONGRATS, you complete the vignette compensation step!
        "float vig_thing = 1.0/vig_mask;",
        // "gl_FragColor.rgb = gl_FragColor.rgb + 1.0 - (vig_mask);",
        "gl_FragColor.xyz *= 1.0 / vig_mask;",

        "}"

    ].join( "\n" )

};

export{InstagramFilter};