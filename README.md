# Lab6_IMUandCameraNavigation
Program webgl using Three.js library. Hosting the webpage on the Python Flask server.

Hi VR/AR Explorers! Welcome to our sixth lab: IMU and Camera Navigation

In this assignment, you will know how to implement the quaternion from the IMU unit and camera navigation through the keyboard behaviors. 


## Step 1: Environment Setup 

Same as last two assignments. Clone the repo, configure the python environment, and run this starter code to see the stereo rendering of a cube.

## Step 2: Console out Quaternion and Apply to Camera

You can use console.log() function to console out the quaterion value from IMU and try to apply it to camera using the window.setInterval() function. In the setInterval() function, you need to fetch the imu information. Then, you want to set the [camera quaternion](https://threejs.org/docs/#api/en/core/Object3D.quaternion) in the response.

## Step 3: Camera Navigation

Besides queaternions, we also want to implement keyboard interaction to change the camera information. We want to have wsad to change the camera position, the space and shift to zoom into or out of the scene, and four arrows keys to control the camera tilted angle. Zooming in and out and changing camera position comes intuitively. The tilted angle change would be different due to the change involve with the lookat variable.

## Step 5: Change Scene

Add objects and make the scene and the camera perspective more fun to look at!